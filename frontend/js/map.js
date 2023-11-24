src="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.bundle.min.js"
var map;
var clickListener; 
var lat;
var long;
var locationName;
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
            dropPin(e.latLng);

            getAddress(lat, long, function(address) {
                if (address) {
                    var inputField = document.getElementById('location');
                    inputField.innerHTML = address;
                    console.log(address);
                }
            });
        });
    }
}
function getAddress(lat,long, callback){
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&key=AIzaSyCtjjPFCnZakIyYBuhJSG83O-bCAsrOlxs",
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            if (res.status === "OK"){
                locationName = (res.results[0]['formatted_address'])
                locationName = locationName.substring(locationName.indexOf(" ") + 1);
                callback(locationName)
            }
            else{
                console.log("No Location Found")
            }
        }
    });

    
}

// Function to deactivate map click event
function deactivateMapClick() {
    if (clickListener) {
        google.maps.event.removeListener(clickListener);
        clickListener = null;
    }
}

var marker;
function dropPin(latLng) {
    if (marker){
        marker.setPosition(latLng);
    }else{
        marker = new google.maps.Marker({
            position: latLng,
            map: map,
            animation: google.maps.Animation.DROP,
            // Optional: specify a custom icon
            //icon: 'path/to/your/custom/pin/image.png'
        });
    }

}

function getBounds(){
    return map.getBounds()
}

// Load the map
window.onload = function() {
initMap();
};


