const {Firestore} = require('@google-cloud/firestore');
const admin       = require('firebase-admin');
const constants   = require('./constants');
const locStringRegex = constants.geolocationStringRegex;

function setTimestamp(data) {
    data.timestamp = admin.firestore.Timestamp.fromMillis(new Date());
    return data;
}

function setGeopoint(data) {
  // Convert geoString (Latitude: 54.7160064, Longitude: 25.264128) to 
  // firestore geopoint: new GeoPoint(latitude, longitude)
  if (!data.geopoint) return data;
  let lat;
  let long;
  const searchStr = data.geopoint;
  if (locStringRegex.test(searchStr)) {
    const patternMatch = searchStr.match(locStringRegex);
    if (patternMatch) {
      lat = parseFloat(patternMatch[1]);
      long = parseFloat(patternMatch[2]);
    }
  }
  data.geopoint = lat !== undefined && long !== undefined ? new Firestore.GeoPoint(lat, long) : null;
  return data;
}

function setUrgency(data) {
    // Convert urgency (yes/no) to boolean
    if (!data.urgency) return data;
    const val = data.urgency;
    data.urgency = val.toString().toLowerCase() === 'yes' ? true : false;
    return data;
}

function prepareDataSettersForDB(data) {
    setTimestamp(data);
    setGeopoint(data);
    setUrgency(data);
}

function sanitizeUiGeopoint(data) {
    if (data.geopoint === undefined) data.geopoint = null;
    return data;
}

module.exports = {
    prepareDataSettersForDB,
    sanitizeUiGeopoint
}