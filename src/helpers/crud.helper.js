
// In entry create
async function setDataTranslationUrls(data, url) {
    const fname = /[^/]*$/.exec(url)[0];
    data.translationUrlEn = 
        `${process.env.PUBLIC_STORAGE_BASEURL}/${process.env.RESULT_BUCKET_NAME}/${fname}_to_en.txt`
    data.translationUrlEs = 
        `${process.env.PUBLIC_STORAGE_BASEURL}/${process.env.RESULT_BUCKET_NAME}/${fname}_to_es.txt`
    data.translationUrlFr = 
        `${process.env.PUBLIC_STORAGE_BASEURL}/${process.env.RESULT_BUCKET_NAME}/${fname}_to_fr.txt`
    data.translationUrlJa = 
        `${process.env.PUBLIC_STORAGE_BASEURL}/${process.env.RESULT_BUCKET_NAME}/${fname}_to_ja.txt`
    return data
}

// In entry delete
function getOriginalFilenames(imageDataInDb) {
    const imageFile = /[^/]*$/.exec(imageDataInDb.imageUrl)[0];
    const fnameEn = /[^/]*$/.exec(imageDataInDb.translationUrlEn)[0];
    const fnameEs = /[^/]*$/.exec(imageDataInDb.translationUrlEs)[0];
    const fnameFr = /[^/]*$/.exec(imageDataInDb.translationUrlFr)[0];
    const fnameJa = /[^/]*$/.exec(imageDataInDb.translationUrlJa)[0];
    return { imageFile: imageFile, transOriginalFiles: [fnameEn, fnameEs, fnameFr, fnameJa] }
}

module.exports = {
    getOriginalFilenames,
    setDataTranslationUrls
}