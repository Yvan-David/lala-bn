import { Request, Response } from 'express'
import cloudinary from 'cloudinary'
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from '../config/index'

import {db} from '../database/models/'
import { ListingAttributes } from '../database/models/listings'
import{ UserRole } from '../database/models/user'
import  cloudinaryUpload  from '../utils/cloudinary'
import { Op } from 'sequelize'
import { getUserById } from '../services/userServices'

cloudinary.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})



/**
 * Product Controller class
 */
export default class listingController {
  /**
   * Adding product
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
  static async addListing(req: Request, res: Response): Promise<Response> {
    try {
      console.log('hino') // Logs when the controller is reached

      const { title, phoneNumber, description, price, location } = req.body
      const { hostId, categoryId } = req.params

      console.log('Params:', { hostId, categoryId }) // Check request params
      console.log('Body:', req.body) // Check request body

      // Validate category existence
      const category = await db.Category.findByPk(categoryId)
      if (!category) {
        console.error('Category not found')
        return res.status(404).json({ message: 'Category not found' })
      }

      // Check if listing already exists
      console.log('Checking for existing listing')
      const existingListing = await db.Listing.findOne({
        where: { title, hostId },
      })
      if (existingListing) {
        console.warn('Listing already exists')
        return res.status(409).json({ message: 'Listing already exists' })
      }

      console.log('here') // Confirms code progression

      // Handle image files
      const files = req.files as Express.Multer.File[]
      console.log('Uploaded files:', files)

      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'Images are required' })
      }
      if (files.length < 4 || files.length > 8) {
        return res.status(400).json({ message: 'Please upload 4 to 8 images' })
      }

      // Upload images to Cloudinary
      const uploadedImages = await Promise.all(
        files.map(async (file: Express.Multer.File) => {
          const result = await cloudinary.v2.uploader.upload(file.path)
          console.log('Cloudinary upload result:', result)
          return { secure_url: result.secure_url }
        }),
      )

      const imageUrls = uploadedImages.map((image) => image.secure_url)
      console.log('Image URLs:', imageUrls)

      // Create the listing in the database
      const listing = await db.Listing.create({
        title,
        phoneNumber,
        description,
        price,
        location,
        hostId,
        categoryId,
        images: imageUrls,
      })

      return res.status(201).json({ message: 'Listing added successfully', listing })
    } catch (error) {
      console.error('Error in addListing:', error) // Log the full error
      return res.status(500).json({ message: 'Internal server error', error })
    }
  }


  /**
   * List products
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
static async listAllCategories(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const categories = await db.Category.findAll()

    if (!categories) {
      return res.status(400).json({ message: 'No categories available' })
    }



    return res.status(200).json({
      message: 'Collections retrieved successfully',
      categories,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', error })
  }
}

  //  User should be able to view specific item

  /**
   * Retrieves the details of a product.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<Response>} - A promise that resolves to an Express response.
   */
  static async getSingleListing(
    req: Request,
    res: Response,
  ): Promise<Response> {
  
    const {hostId, listingId }= req.params

    try {
        const user = await getUserById(hostId as string)
        const userRole = user?.userRole
      const listing: ListingAttributes | null = await db.Listing.findByPk(listingId, {
        include: [
          {
            model: db.User,
            as: 'host',
            attributes: ['id', 'username', 'email'],
          },
        ],
      })

      if (!listing) {
        return res.status(404).json({ status: 404, error: 'Listing not found' })
      }

      if (userRole === UserRole.HOST) {
        if (listing.hostId !== hostId) {
          return res.status(403).json({
            status: 403,
            message: 'You are not authorized to access this listing',
          })
        }
      }
      return res.status(200).json({
        message: 'Listing retrieved successfully',
        listing,
      })
    } catch (error) {
      // console.log('error is', error)
      return res
        .status(500)
        .json({ status: 500, error: 'Internal server error' })
    }
  }

  /**
   * List products
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
  static async listUserListings(req: Request, res: Response): Promise<Response> {
    try {
        const{hostId} = req.params
      const listings = await db.Listing.findAll(
        {
            where: { hostId: hostId },
          }
      )


      return res.status(200).json({
        message: 'Listings retrieved successfully',
        listings,
      })
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error})
    }
  }


  /**
   * List products
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
  static async listListings(req: Request, res: Response): Promise<Response> {
    try {

      const listings = await db.Listing.findAll()

      return res.status(200).json({
        message: 'Products retrieved successfully',
        listings,
      })
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error })
    }
  }

  /**
   * List products
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
  static async listCategories(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const categories = await db.Categories.findAll()

      return res.status(200).json({
        message: 'Categories retrieved successfully',
        categories,
      })
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal server error', error })
    }}
  
  /**
   * update product
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<Response>} Promise that resolves to an Express response
   */
  static async updateListing(req: Request, res: Response): Promise<Response> {
    try {
        const { title, phoneNumber, description, price, location } =
        req.body

      const {hostId, listingId} = req.params

      const listing = await db.Listing.findByPk(listingId)
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' })
      }
      if (listing.hostId !== hostId) {
        return res.status(403).json({ message: 'You do not have permission to update this listing' });
      }


      const updatedListing = await listing.update({
        title, phoneNumber, description, price, location
      })
      return res.status(200).json({ message: 'Product updated successfully', data: updatedListing })
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error })
    }
  }

/**
 * Remove images from a product
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} Promise that resolves to an Express response
 */
static async removeImages(req: Request, res: Response): Promise<Response> {
  try {
    const { images } = req.body;
    const listingId = req.params.id;

    const listing = await db.Listing.findByPk(listingId );
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const currentImages = listing.images || [];
    const updatedImages = currentImages.filter((image: string) => !images.includes(image));

    if (updatedImages.length === currentImages.length) {
      return res.status(400).json({ message: 'No images were removed', imagesToRemove: images });
    }

    await listing.update({ images: updatedImages });
    return res.status(200).json({ message: 'Images removed successfully', imagesRemaining: updatedImages });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error });
  }
}

 /**
 * Update Image of a product
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} Promise that resolves to an Express response
 */
static async addImages(req: Request, res: Response): Promise<Response> {
  try {
    const images = req.files as Express.Multer.File[];
    const listingId = req.params.id;

    const listing = await db.Listing.findByPk(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const existingImages = listing.images || [];
    const newImages = [];

    for (const image of images) {
      const fileName = `${listingId}-${image.originalname}`;
      const url = await cloudinaryUpload(image.buffer, fileName);
      newImages.push(url);
    }
    const updatedImages = [...existingImages, ...newImages];
    if (updatedImages.length < 4 || updatedImages.length > 8 ){
      return res.status(404).json({ message: 'Only 4-8 images need to be uploaded'})
    }
    await listing.update({ images: updatedImages });
    return res.status(200).json({ message: 'Images added successfully', images: updatedImages });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error });
  }
}

  /**
   * delete product
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  static async deleteListing(req: Request, res: Response) {
    try {
        const{hostId, listingId} = req.params
      const listing = await db.Listing.findOne(
        {
            where: {
                [Op.and]: [{ id: listingId }, { hostId }],
              },
          }
      )
      if (listing) {
        const deletedListing = await db.Listing.destroy(
        {
            where: {
                [Op.and]: [{ id: listingId }, { hostId }],
              },
          }
      )
        if (deletedListing) {
          return res.status(200).json({ message: 'listing deleted',deletedListing })
        }
      } else {
        return res.status(404).json({ message: 'listing not found' })
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

}
