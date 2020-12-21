const fromStorage       = require('./converters/fromStorage');
const {Storage}         = require('@google-cloud/storage');

// Set Storage buckets for files.
// Image metadata (title, tags, sentiment, etc) is saved to Firestore.DB.
const storage = new Storage();
const imageBucket = storage.bucket(process.env.IMAGE_BUCKET_NAME);
const resultBucket = storage.bucket(process.env.RESULT_BUCKET_NAME);

function setPayloadImageUrl(data, imUrl) {
    data.imageUrl = imUrl;
}

async function deleteAllImageFiles(image) {
    const { imageFile, transOriginalFiles } = fromStorage.getImageFilenames(image);
    try {
        await imageBucket.file(imageFile).delete();
        transOriginalFiles.forEach(async (el) => {
          await resultBucket.file(el).delete();
        });
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    deleteAllImageFiles,
    setPayloadImageUrl
}