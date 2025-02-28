import multer from 'multer'

const configureMulter = () => {
  console.log('hano')
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/')
    },
    filename(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    },
  })

  const upload = multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: 8,
    },
  }).array('images', 8)
console.log(upload)
  return upload
}

export default configureMulter()
