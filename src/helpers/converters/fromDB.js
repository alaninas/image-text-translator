const constants = require('./constants');
const monthNames = constants.monthNames;
const accuracyDict = constants.accuracyDict;

function setTimestamp(image) {
    // Convert Firestore.timestamp to human readable format ready for tempale
    if (!image.timestamp) return image;
    const date_ob = image.timestamp.toDate();
    const date = date_ob.getDate();
    const month = date_ob.getMonth();
    const year = date_ob.getFullYear();
    image.timestamp = `${monthNames[month]} ${date}, ${year}`;
    return image;
}

function setGeopoint(image) {
    // Convert Firestore.geopoint to 'Latitude: ..., Longitude: ...'
    if (image.geopoint !== undefined 
        && image.geopoint !== null 
        && image.geopoint.latitude !== undefined 
        && image.geopoint.longitude !== undefined) {
      const lat = image.geopoint.latitude;
      const long = image.geopoint.longitude;
      image.geopoint = `Latitude: ${lat}, Longitude: ${long}`
    }
    return image;
}

function setUrgency(image) {
    // Convert urgency: from bool to 'Yes'/'No'
    if (image.urgency === undefined || image.urgency === null) return image;
    const val = image.urgency;
    image.urgency = val === true ? 'yes' : 'no';
    return image;
}

function setSatisfaction(image) {
    // Convert accuracy level: from 1..3 to 'Low/Interm/High'
    if (image.satisfaction === undefined || image.satisfaction === null) return image;
    const val = image.satisfaction;
    image.satisfaction = accuracyDict[val] || 'Low';
    return image;
}

function prepareImageForViewUI(image) {
    setTimestamp(image);
    setGeopoint(image);
    setUrgency(image);
    setSatisfaction(image);
}

function prepareImageForUpdateUI(image) {
    setGeopoint(image);
    setUrgency(image);
}

module.exports = {
    prepareImageForViewUI,
    prepareImageForUpdateUI
}
