import { NextFunction, Request, Response } from 'express'
import {db} from '../database/models'
import {
  getUserById,updateUserById
} from '../services/userServices'

import { hashPassword, comparePassword } from '../utils/passwords'
import { generateToken } from '../utils/jwt'
import passport from '../config/passport'
import { UserAttributes } from 'database/models/user'
/**
 * User Controller class
 */
export default class UserController {
  /**
   * Signup method for user registration
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
  static async signup(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password, username } = req.body
      const existingUser = await db.User.findOne({ where: { email } })
      if (existingUser) {
        return res.status(409).json({
          message: 'This user already exists',
        })
      }
      const hashedpassword = hashPassword(password)

      const newUser = new db.User({
        username,
        email,
        password: (await hashedpassword).toString(),
      })

      await newUser.save()

      const token = generateToken({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      })

      return res.status(201).json({
        message: `Account Created successfully, verify your email to continue id: ${newUser.id}`,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error })
    }
  }

  /**
   * verifyEmail method for verifying a user
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
  // static async verifyEmail(req: Request, res: Response): Promise<Response> {
  //   try {
  //     const { token } = req.params

  //     const decodedToken = decodeToken(token)

  //     if (!decodedToken) {
  //       return res.status(401).send({ message: 'Invalid token' })
  //     }

  //     const user = await getUserById(decodedToken.id as number)

  //     if (!user) {
  //       return res
  //         .status(400)
  //         .send({ message: 'Invalid token or user not found' })
  //     }

  //     await Promise.all([
  //       user.update({ verified: true }),
  //     ])

  //     return res.status(201).send({ message: 'Email verified successfully' })
  //   } catch (error) {
  //     return res.status(500).send({ message: 'Internal server error' })
  //   }
  // }


  /**
   * getUser method for getting user profile
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
  static async getUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params 
      if (!id) {
        return res.status(401).json({ message: `User doesn't exist` })
      }
      const user = await getUserById(id as string)
      return res.status(200).json(user)
      
    } catch (err: unknown) {
      return res.status(500).json({ message: 'Internal server error', error: err })
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params
      const fieldsToUpdate = req.body
  
      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ message: 'Nothing to update' })
      }
  
      // Filter only allowed fields
      const { username, email, userRole } = fieldsToUpdate
      // Proceed only if there are fields to update
      if (username || email || userRole) {
        await updateUserById({ username, email, userRole }, id)
      } else {
        return res.status(400).json({ message: 'Invalid fields to update' })
      }
  
      const updatedUser = await getUserById(id)
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' })
      }
  
      return res.status(200).json(updatedUser)
    } catch (err: unknown) {
      const error = err as Error
      return res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
  }
  
    /**
   * Handles user login.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
    static async login(req: Request, res: Response): Promise<Response> {
      try {
        const { email, password } = req.body
  
        const existingUser = await db.User.findOne({ where: { email } })
  
        if (!existingUser) {
          return res.status(404).send({ message: 'User not found' })
        }
        const isPasswordValid = await comparePassword(
          password,
          existingUser.password,
        )
        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid email or password' })
        }
  
        const tokenPayload = {
          id: existingUser.id,
          userRole: existingUser.userRole,
          username: existingUser.username,
          email: existingUser.email,
        }
  
        // if (existingUser.userRole === UserRole.SELLER) {
        //   const otp = `${Math.floor(1000 + Math.random() * 9000)}`
        //   const html = otpEmailTemplate(existingUser.username, otp)
        //   const otptoken = generateToken({
        //     id: existingUser.id,
        //     email: existingUser.email,
        //     username: existingUser.username,
        //     userRole:existingUser.userRole,
        //     otp,
        //   })
        //   await redisClient
        //     .setEx(existingUser.email, 300, `${otp}=${otptoken}`)
        //     .then(async () => {
        //       await sendMail(email, 'OTP VERIFICATION CODE', html)
        //     })
  
        //   tokenPayload.otp = otp
        //   const sellerTokenMessage =
        //     'Email sent to your email. Please check your inbox messages and enter the OTP for verification'
        //   return res.status(200).json({ message: sellerTokenMessage })
        // }
  
        // Generate and return JWT token for authenticated user
        const authToken = generateToken(tokenPayload)
         res.setHeader('Authorization', `Bearer ${authToken}`)
        return res.status(200).send({ message: 'Login successful', authToken })
      } catch (error) {
        return res
          .status(500)
          .send({ message: 'Internal server error', error })
      }
    }
  
    /**
     * Handles user logout
     * @param {AuthenticatedRequest} req - Express request object with user property
     * @param {Response} res - Express response object
     * @returns {Promise<Response>} Promise that resolves to an Express response
     */
    static async logOut(req: Request, res: Response): Promise<Response> {
      try{
      const {id} = req.params

        res.removeHeader('authorization')
        return res.status(200).json({ message: 'Logout successfully' })
    }catch (error) {
        return res
          .status(500)
          .send({ message: 'Internal server error', error })
      }
    }
     /**
     * Login method via google
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @param {NextFunction} next - Express next middleware function
     */
  //    static loginWithGoogle(
  //     req: Request,
  //     res: Response,
  //     next: NextFunction,
  // ) {
  //     passport.authenticate(
  //         'google',
  //         (err: unknown, user: UserAttributes | null) => {
  //             if (err) {
  //                 console.log('why');
  //                 return res.status(500).json({ error: 'Internal Server Error' });
  //             }
  //             if (!user) {
  //                 return res.status(401).json({ error: 'Authentication failed' });
  //             }
  //             return res.json({ message: 'Authentication successful', user });
  //         },
  //     )(req, res, next);
  // }
  static loginWithGoogle(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    passport.authenticate(
        'google',
        (err: unknown, user: UserAttributes | null, info: any) => {
            if (err) {
                console.error('Authentication error:', err); // Log detailed error
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            
            if (!user) {
                console.warn('No user found:', info); // Log additional info if no user
                return res.status(401).json({ error: 'Authentication failed' });
            }

            // If authentication is successful
            return res.json({ message: 'Authentication successful', user });
        },
    )(req, res, next);
}

  }
  
//   const generateUserToken = (user: UserAttributes) => {
//     const plainUser = {
//       id: user.id,
//       username: user.username,
//       email: user.email,
//       userRole: user.userRole,
//     }
//     return generateToken(plainUser)
// }
