const geopointSelector = (geopoint, container, getLoc, removeLoc) = {
    getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        }
      },
    showPosition(position) {
        geopoint.value = "Latitude: " + position.coords.latitude + 
        ", Longitude: " + position.coords.longitude;
        container.style.display = "inherit";
        getLoc.style.display = "none";
        removeLoc.style.display = "inherit";
      },
      removeLocation() {
        geopoint.value = undefined;
        container.style.display = "none";
        getLoc.style.display = "inherit";
        removeLoc.style.display = "none";
      }
}

module.exports = geopointSelector;