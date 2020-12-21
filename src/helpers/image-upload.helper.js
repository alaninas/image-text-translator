'use strict';
const {Storage} = require('@google-cloud/storage');
const path      = require('path')

const storage = new Storage();
const CLOUD_BUCKET = process.env.IMAGE_BUCKET_NAME
const bucket = storage.bucket(CLOUD_BUCKET);

// Returns the public, anonymously accessible URL to a given Cloud Storage
// object.
// The object's ACL has to be set to public read.
function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}

// Express middleware that will automatically pass uploads to Cloud Storage.
// req.file is processed and will have two new properties:
// * ``cloudStorageObject`` the object name in cloud storage.
// * ``cloudStoragePublicUrl`` the public url to the object.
function sendUploadToGCS(req, res, next) {
  if (!req.file) {
    return next();
  }
  const gcsname = Date.now() + req.file.originalname;
  const file = bucket.file(gcsname);
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
    resumable: false,
  });
  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });
  stream.on('finish', async () => {
    req.file.cloudStorageObject = gcsname;
    await file.makePublic();
    req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
    next();
  });
  stream.end(req.file.buffer);
}

const checkFileType = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (!mimetype || !extname) {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    return cb(
      `Error: Images Only! File format provided: ${extname}. URL: ${fullUrl}`, 
      false
    );
  }
  cb(null, true);
}

// Multer handles parsing multipart/form-data requests.
// This instance is configured to store images in memory.
// This makes it straightforward to upload to Cloud Storage.
const Multer = require('multer');
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
  fileFilter: checkFileType
});

module.exports = {
  getPublicUrl,
  sendUploadToGCS,
  multer
};