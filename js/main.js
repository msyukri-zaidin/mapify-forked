function getLatLong() {
    var address = document.getElementById("address").value;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
        
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            // document.getElementById("ShowLat").innerHTML = "Latitude: " + latitude;
            // document.getElementById("ShowLong").innerHTML = "Longitude: " + longitude;
            initMap(latitude, longitude);
        }

    });
}

function initMap(lat, lng) {
    var location = {lat, lng} /*This coordinates is for Sydney {lat: -34.397, lng: 150.644} */
    var map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 12
    });
  }


