/* 
    Google Maps JS API used to get the geocoding and maps of a certain location
    
    CITS3403 Project 2
    Author: Ahbar Sakib
    Version: 15.05.2020
*/

// Uses google Maps geocoding services to retrive the latitude and longitude 
// of the entered location
function getLatLong() {
    // Gets the 
    var address = document.getElementById("address").value;
    if (address == '') {
        alert("Please enter your answer!");
        return;
    }
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

// Creates the map with the a specified latitude (lat) and longitude (lang)
function initMap(lat, lng) {
    var location = {lat, lng};
    var map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 4,                // This needs to be changed to zoom in and out of the map
    disableDefaultUI: true, // Disables all the satellite, zoom features and other 
                            // which is unecessary for our webpage
    gestureHandling: 'cooperative' // This allows the map to be interactive
    });

    var emptyStyles = [
        {
            featureType: "all",
            elementType: "labels",
            stylers: [ { visibility: "off" } ]
        }
    ];

    //map.setOptions({styles: emptyStyles});



    let radius = 1000000/2; // Dynamically change the radius from this
                            // Everytime a button is clicked

    let newCoordinates = generatePoint(lat, lng, radius);
    //lat = parseFloat(newCoordinates.newLat.toFixed(6));
    //lng = parseFloat(newCoordinates.newLng.toFixed(6));
    
    // Redefine the latitude and longitude to offset the radius bubble
    lat = newCoordinates.newLat;
    lng = newCoordinates.newLng;

    // Draw the radius circle on the map
    var cityCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: {lat, lng},
        radius: radius
    });
}


function generatePoint(lat, lng, radius) {
    var r, radius, theta;
    // Gets a random angle inside a full circle
    theta = Math.random() * 2 * Math.PI;
    // this gets a smaller portion of the radius
    r = radius * Math.sqrt(Math.random());

    // This is the cartesian coordinates which offsets the
    // original latitude and longitude
    newLat = lat + ((r * Math.cos(theta))/1100)*0.01;
    newLng = lng + ((r * Math.sin(theta))/1100)*0.01;

    return {newLat, newLng};
}