const constants = require('./constants');
const langs = constants.languagesDict;

function getImageFilenames(imageDataInDb) {
    const imageFile = /[^/]*$/.exec(imageDataInDb.imageUrl)[0];
    const fname = {};
    for (const langName in langs) {
        fname[langName] = /[^/]*$/.exec(imageDataInDb.translationUrl[langName])[0];
    }
    return { imageFile: imageFile, transOriginalFiles: Object.values(fname) }
}

module.exports = {
    getImageFilenames
}