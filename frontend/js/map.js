src="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.bundle.min.js"

// Initialize Google Maps
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
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
document.addEventListener("DOMContentLoaded", function () {
    var rangeInput = document.getElementById('rangeInput');
    var thumb = document.getElementById('thumb');

    rangeInput.addEventListener('input', function () {
        var value = (this.value - this.min) / (this.max - this.min);
        thumb.style.left = value * 100 + '%';
    });
});

// Load the map
window.onload = function() {
initMap();
};