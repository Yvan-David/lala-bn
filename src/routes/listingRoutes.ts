// @ts-nocheck
import express from 'express'
import configureMulter from '../utils/multer'
import listingController from '../controllers/listingController'
import multer from 'multer'

const router = express.Router()
const upload = multer()
router.post(
  '/:hostId/:categoryId/addlisting',
  configureMulter,
  listingController.addListing,
)

router.get(
  '/categories',
  listingController.listCategories,
)

router.get(
  '/:hostId/:listingId/singleListing',
  listingController.getSingleListing,
)

router.get(
    '/:hostId/userListings',
    listingController.listUserListings,
  )

  router.get(
    '/allListings',
    listingController.listListings,
  )
  
  
router.delete(
  '/:hostId/:listingId/listing',
  listingController.deleteListing
)

router.put(
  '/:hostId/:listingId/updateListing',
  listingController.updateListing,
)
router.delete(
  '/:listingId/images',

  listingController.removeImages
)
router.post(
  '/:listingId/images',
  upload.array('images'),
  listingController.addImages
)

export default router
