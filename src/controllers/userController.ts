import { Request, Response } from 'express'
import {db} from '../database/models'
import {
  getUserById,
} from '../services/userServices'

import { hashPassword } from '../utils/passwords'
import { generateToken, decodeToken } from '../utils/jwt'
import { verificationsEmailTemplate } from '../utils/emailTemplates'
import sendMail from '../utils/sendMail'
import { NODEMAILER_BASE_URL} from '../config'

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
      console.log(req.params
      )
      const user = await getUserById(id as string)
      return res.status(200).json(user)
      
    } catch (err: unknown) {
      return res.status(500).json({ message: 'Internal server error', error: err })
    }
  }
}
