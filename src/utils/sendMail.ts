import nodemailer from 'nodemailer'
import {
  NODEMAILER_HOST,
  NODEMAILER_USER,
  NODEMAILER_PASS,
  NODEMAILER_EMAIL_PORT,
  NODEMAILER_SECURE,
} from '../config'

const Mailer = async (email: string, subject: string, mail: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: NODEMAILER_HOST,
      port: NODEMAILER_EMAIL_PORT,
      secure: NODEMAILER_SECURE,
      auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: email,
      subject,
      html: mail,
    })
  } catch (error) {
    throw (error)
  }
}

export default Mailer
