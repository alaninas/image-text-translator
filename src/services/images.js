'use strict';
const express           = require('express');
const bodyParser        = require('body-parser');
const {Storage}         = require('@google-cloud/storage');
const db                = require('./firestore');
const imageHelper       = require('../helpers/images.helper')
const imageUploadHelper = require('../helpers/image-upload.helper');
const toStorage         = require('../helpers/converters/toStorage');
const toDB              = require('../helpers/converters/toDB');
const fromDB            = require('../helpers/converters/fromDB');

// Set router.
const router = express.Router();
// Parse request body as form data.
router.use(bodyParser.urlencoded({extended: false}));
// Set Content-Type on responses.
router.use((req, res, next) => {
  res.set('Content-Type', 'text/html');
  next();
});

// GET /images
router.get('/', async (req, res) => {
  try {
    let {images, nextPageToken} = await db.list(10, req.query.pageToken);
    res.render('list', { layout: false, images, nextPageToken });
  } catch (err) {
    res.send({err})
  }
});

// GET /images/add
router.get('/add', (req, res) => {
  res.render('new-form', { layout: false, image: {}, action: 'Add' });
});

// GET /images/:id
router.get('/:image', async (req, res) => {
  const image = await db.read(req.params.image);
  fromDB.prepareImageForViewUI(image);
  res.render('view', { layout: false, image });
});

// GET /images/:id/edit
router.get('/:image/edit', async (req, res) => {
  const image = await db.read(req.params.image);
  fromDB.prepareImageForUpdateUI(image);
  res.render('edit-form', { layout: false, image, action: 'Edit' });
});

// POST /images/add
router.post('/add', imageUploadHelper.multer.single('image'), imageUploadHelper.sendUploadToGCS, async (req, res) => {
  const data = req.body;
  if (req.file && req.file.cloudStoragePublicUrl) {
    const imUrl = req.file.cloudStoragePublicUrl;
    imageHelper.setPayloadImageUrl(data, imUrl);
    await toStorage.setTranslationUrls(data, imUrl);
  }
  toDB.sanitizeUiGeopoint(data);
  try {
    const savedData = await db.create(data);
    res.redirect(`${req.baseUrl}/${savedData.id}`);
  } catch (error) {
    console.log(error);
  }
});

// POST /images/:id/edit
router.post('/:image/edit', imageUploadHelper.multer.single('image'), imageUploadHelper.sendUploadToGCS, async (req, res) => {
  const data = req.body;
  if (req.file && req.file.cloudStoragePublicUrl) {
    imageHelper.setPayloadImageUrl(data, req.file.cloudStoragePublicUrl);
    try {
      const image = await db.read(req.params.image);
      await imageHelper.deleteAllImageFiles(image);
    } catch (error) {
      console.log(error)
    }
  }
  try {
    if (data.imageUrl) await toStorage.setTranslationUrls(data, data.imageUrl);
    toDB.sanitizeUiGeopoint(data);
    const savedData = await db.update(req.params.image, data);
    res.redirect(`${req.baseUrl}/${savedData.id}`);
  } catch (error) {
    console.log(error)
  } 
});

// GET /images/:id/delete
router.get('/:image/delete', async (req, res) => {
  try {
    const image = await db.read(req.params.image);
    await imageHelper.deleteAllImageFiles(image);
    await db.delete(req.params.image);
  } catch (error) {
    console.log(error)
  }
  res.redirect(req.baseUrl);
});

module.exports = router;