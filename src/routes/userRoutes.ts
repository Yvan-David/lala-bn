//@ts-nocheck
import Router from 'express'
import UserController from '../controllers/userController'

const router = Router()

router.post(
  '/signup',
  UserController.signup,
)
router.get('/:id', UserController.getUser);
export default router