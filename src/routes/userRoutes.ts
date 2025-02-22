// @ts-nocheck
import Router from 'express'
import UserController from '../controllers/userController'
import passport from 'passport';

const router = Router()

router.post(
  '/signup',
  UserController.signup
)
router.get('/:id', UserController.getUser);
router.post(
  '/login',
  UserController.login
)
router.patch(
  '/:id',
  UserController.updateUser
)
router.get(
  '/login/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
)
router.get('/google/callback', UserController.loginWithGoogle)
export default router
