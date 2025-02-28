import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRE_TIME, JWT_SECRET_RESET } from '../config/index'
import { UserAttributes } from '../database/models/user'

interface JwtPayload extends UserAttributes {
  iat?: number
  exp?: number
}

export const generateToken = (data: object) => {
  const token = jwt.sign(data, JWT_SECRET)
  return token
}

export const decodeToken: (token: string) => JwtPayload = (token: string) =>
  jwt.verify(token, JWT_SECRET) as JwtPayload

// export const generateResetToken = (data: object) => {
//   const token = jwt.sign(data, JWT_SECRET_RESET)
//   return token
// }
