import { Request, Response } from 'express'
import {db} from '../database/models'

 /**
   * Buyer checkout details.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express nextFunction objects
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
 export const createBooking = async (req: Request, res: Response): Promise<Response> => {
    const {
        startDate,
        endDate,
        totalPrice,
      } = req.body
    const {renterId, listingId} = req.params
    try {
 
        const listing = await db.Listing.findByPk(listingId)
        if(listing.booked){
            return res.status(400).json( "this listing is already booked")
        }

      const booking = await db.Booking.create({
        startDate,
        endDate,
        totalPrice,
        renterId,
        listingId,
      })
      listing.booked=true
      await listing.save()
      return res
        .status(201)
        .json({ message: 'Booking processed successfully', booking })
    } catch (error) {
        return res.status(500).json( error)
    }
  }

/**
 * Get notifications for the authenticated user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} Promise that resolves to an Express response
 */
export const getbooking = async (req: Request, res: Response) => {

    const { renterId, bookingId } = req.params;
    try {
      const booking = await db.Booking.findOne({
        where: { renterId: renterId, id:  bookingId},
      });
      if (!booking) {
        return res.status(404).json({message: 'Booking not found'})
      }
      return res.status(200).json({message: 'Booking retrieved successful', booking})
    } catch (err: unknown) {
      const errors = err as Error;
      return res.status(500).json( errors.message)
    }
  };

/**
 * Get notifications for the authenticated user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} Promise that resolves to an Express response
 */
export const getUserBookings = async (req: Request, res: Response) => {
    const { renterId } = req.params;
    try {
      const bookings = await db.booking.findAll({
        where: { renterId: renterId },
      });
      if (!bookings) {
        return res.status(404).json({message: 'User has no bookings'})
      }
      return res.status(200).json({message: 'bookings retrieved successful', bookings})
    } catch (err: unknown) {
      const errors = err as Error;
      return res.status(500).json( errors.message)
    }
  };
