// @ts-nocheck
import passport, { Profile } from 'passport'
import {
  Strategy as GoogleStrategy,
  StrategyOptionsWithRequest,
} from 'passport-google-oauth20'
import { SinonSpy } from 'sinon'
import { UserAttributes} from '../database/models/user'
import { db } from '../database/models/index'

import { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } from './index'
import { v4 as uuidv4 } from 'uuid' // To generate a random UUID for the password

export const googleOAuthCallback = async (
  req: unknown,
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: Function,
) => {
  try {
    if (!profile.emails || profile.emails.length === 0) {
      return done(new Error('Email not found in the Google profile'), null)
    }

    const email = profile.emails[0].value
    const existingUser = await db.User.findOne({ where: { email } })

    if (existingUser) {
      return done(null, existingUser)
    }

    // Provide a dummy password to avoid validation errors
    const newUser = await db.User.create({
      username: profile.name?.givenName || 'GoogleUser',
      email,
      password: uuidv4(), // Generate a random password placeholder
    })

    return done(null, newUser)
  } catch (error) {
    console.error('Error during Google authentication:', error)
    return done(error, null)
  }
}
  

const googleStrategyOptions: StrategyOptionsWithRequest = {
  clientID: CLIENT_ID as string,
  clientSecret: CLIENT_SECRET as string,
  callbackURL: CALLBACK_URL,
  passReqToCallback: true,
}

passport.use(new GoogleStrategy(googleStrategyOptions, googleOAuthCallback))

passport.serializeUser((user: UserAttributes, done: Function) => {
  const typedUser = user as UserAttributes
  done(null, typedUser.id)
})

passport.deserializeUser(
  async (id: string, done: Function) => {
    const user = await db.User.findByPk(id)
    done(null, user)
  },
)

export default passport
