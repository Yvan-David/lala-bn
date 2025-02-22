//@ts-nocheck
import express from 'express'

import {
    createBooking,
  getbooking,
  getUserBookings
} from '../controllers/bookingController'

const router = express.Router()

// router.patch(
//   '/:orderId/status',
//   isAuthenticated,
//   checkPermission(UserRole.ADMIN),
//   validateRequest(orderStatusSchema, 'body'),
//   updateproductorder,
// )
router.get('/:bookingId/:renterId/booking', getbooking)
router.get(
  '/:renterId/bookings',
  getUserBookings,
)
router.post(
  '/:renterId/:listingId/booking', createBooking,
)

export default router
