src="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.bundle.min.js"
var map;
var clickListener; 
var lat;
var long;
// Initialize Google Maps
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: 31.476737, lng: 34.4813380 }, // Set your own default coordinates
        styles: [
        {
            streetViewControl: false,
            disableDefaultUI: false,
            featureType: "poi",
            elementType: "labels",
            stylers: [
            { visibility: "off" }
            ]
        }
        ]
    });

}
// Function to activate map click event
function activateMapClick() {
    if (!clickListener) {
        clickListener = map.addListener('click', function(e) {
            lat = e.latLng.lat();
            long = e.latLng.lng();
            var inputField = document.getElementById('location');
            inputField.innerHTML = lat + ', ' + long;
        });
    }
}

// Function to deactivate map click event
function deactivateMapClick() {
    if (clickListener) {
        google.maps.event.removeListener(clickListener);
        clickListener = null;
    }
}


// Load the map
window.onload = function() {
initMap();
};


