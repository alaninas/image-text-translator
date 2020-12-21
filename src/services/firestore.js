'use strict';
const {Firestore} = require('@google-cloud/firestore');
const admin       = require('firebase-admin');
const toDB        = require('../helpers/converters/toDB');

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});
const db = admin.firestore();
const collection = 'Image';

// Lists all images in the database sorted alphabetically by title.
async function list(limit, token) {
  const snapshot = await db
    .collection(collection)
    .orderBy('title')
    .startAfter(token || '')
    .limit(limit)
    .get();
  if (snapshot.empty) {
    return {
      images: [],
      nextPageToken: false,
    };
  }
  const images = [];
  snapshot.forEach((doc) => {
    let image = doc.data();
    image.id = doc.id;
    images.push(image);
  });
  const q = await snapshot.query.offset(limit).get();
  return {
    images,
    nextPageToken: q.empty ? false : images[images.length - 1].title,
  };
}

// Creates a new image data or updates an existing image data with new one.
async function update(id, data) {
  let ref;
  if (id === null) {
    ref = db.collection(collection).doc();
  } else {
    ref = db.collection(collection).doc(id);
  }
  data.id = ref.id;
  toDB.prepareDataSettersForDB(data);
  data = {...data};
  await ref.set(data);
  return data;
}

async function create(data) {
  return await update(null, data);
}

// Get image from firestore
async function read(id) {
  const doc = await db.collection(collection).doc(id).get();
  if (!doc.exists) {
    throw new Error('No such document!');
  }
  return doc.data();
}

async function _delete(id) {
  await db.collection(collection).doc(id).delete();
}

module.exports = {
  create,
  read,
  update,
  delete: _delete,
  list,
};
