const constants = require('./constants');
const langs = constants.languagesDict;
const pubStorage = process.env.PUBLIC_STORAGE_BASEURL;
const resBucket = process.env.RESULT_BUCKET_NAME;

// In entry create
async function setTranslationUrls(data, url) {
    const fname = /[^/]*$/.exec(url)[0];
    data.translationUrl = {}
    for (const langName in langs) {
        const lang = langs[langName];
        data.translationUrl[langName] = 
          `${pubStorage}/${resBucket}/${fname}_to_${lang}.txt`;
    }
    return data
}

module.exports = {
    setTranslationUrls
}