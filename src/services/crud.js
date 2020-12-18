'use strict';
const express    = require('express');
const bodyParser = require('body-parser');
const imHelper   = require('../helpers/images.helper');
const crudHelper = require('../helpers/crud.helper');
const db         = require('./firestore');
const {Storage}  = require('@google-cloud/storage');

const storage = new Storage();
const imageBucket = storage.bucket(process.env.IMAGE_BUCKET_NAME);
const resultBucket = storage.bucket(process.env.RESULT_BUCKET_NAME);
const router = express.Router();
router.use(bodyParser.urlencoded({extended: false}));
// Set Content-Type on responses
router.use((req, res, next) => {
  res.set('Content-Type', 'text/html');
  next();
});

// GET /images
router.get('/', async (req, res) => {
  try {
    let {images, nextPageToken} = await db.list(10, req.query.pageToken);
    res.render('list', {
      layout: false,
      images,
      nextPageToken,
    });
  } catch (err) {
    res.send({err})
  }
});

// GET /images/add
router.get('/add', (req, res) => {
  res.render('form', {
    layout: false,
    image: {},
    action: 'Add',
  });
});

// GET /images/:id/edit
router.get('/:image/edit', async (req, res) => {
  const image = await db.read(req.params.image);
  res.render('form', {
    layout: false,
    image,
    action: 'Edit',
  });
});

// GET /images/:id
router.get('/:image', async (req, res) => {
  const image = await db.read(req.params.image);
  res.render('view', {
    layout: false,
    image,
  });
});

// POST /images/add
router.post('/add', imHelper.multer.single('image'), imHelper.sendUploadToGCS,
  async (req, res) => {
    const data = req.body;
    if (req.file && req.file.cloudStoragePublicUrl) {
      data.imageUrl = req.file.cloudStoragePublicUrl;
      await crudHelper.setDataTranslationUrls(data, req.file.cloudStoragePublicUrl);
    }
    // Save the data to the database.
    const savedData = await db.create(data);
    res.redirect(`${req.baseUrl}/${savedData.id}`);
  }
);

// POST /images/:id/edit
router.post('/:image/edit', imHelper.multer.single('image'), imHelper.sendUploadToGCS,
  async (req, res) => {
    const data = req.body;
    if (req.file && req.file.cloudStoragePublicUrl) {
      req.body.imageUrl = req.file.cloudStoragePublicUrl;
    }
    const savedData = await db.update(req.params.image, data);
    res.redirect(`${req.baseUrl}/${savedData.id}`);
  }
);

// GET /images/:id/delete
router.get('/:image/delete', async (req, res) => {
  try {
    const image = await db.read(req.params.image);
    const { imageFile, transOriginalFiles } = crudHelper.getOriginalFilenames(image);
    await db.delete(req.params.image);
    await imageBucket.file(imageFile).delete();
    transOriginalFiles.forEach(async (el) => {
      await resultBucket.file(el).delete();
    });
  } catch (error) {
    console.log(error)
  }
  res.redirect(req.baseUrl);
});

module.exports = router;