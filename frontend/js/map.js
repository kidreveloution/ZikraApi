// Load necessary external resources
// <script src="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.bundle.min.js"></script>

var map;
var clickListener; 
var marker;

map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    mapId: "bc55fc2e7ebbdda0",
    center: { lat: 31.476737, lng: 34.4813380 }, // Set your own default coordinates
    streetViewControl: false,
    disableDefaultUI: false
});
google.maps.event.addListenerOnce(map, 'idle', function() {
    console.log(map.getBounds());
});

// Function to activate map click event
function activateMapClick() {
    if (!clickListener) {
        clickListener = map.addListener('click', function(e) {
            var lat = e.latLng.lat();
            var long = e.latLng.lng();
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

// Function to get address from latitude and longitude
function getAddress(lat, long, callback) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=YOUR_API_KEY";
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(res) {
            if (res.status === "OK") {
                var locationName = res.results[0]['formatted_address'];
                locationName = locationName.substring(locationName.indexOf(" ") + 1);
                callback(locationName);
            } else {
                console.log("No Location Found");
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

// Function to drop a pin on the map
function dropPin(latLng) {
    if (marker) {
        marker.setPosition(latLng);
    } else {
        marker = new google.maps.Marker({
            position: latLng,
            map: map,
            animation: google.maps.Animation.DROP
            // Optional: specify a custom icon
            // icon: 'path/to/your/custom/pin/image.png'
        });
    }
}

// Function to get the map's current bounds
function getMapBounds() {
    console.log(map.getBounds());
    return map.getBounds();
}



// function _getBounds(){
//     console.log(map.getBounds())
//     return map.getBounds()
// }
function _getBounds() {
    return new Promise((resolve, reject) => {
        if (map) {
            if (map.getBounds()) {
                // If bounds are already available, resolve immediately
                resolve(map.getBounds());
            } else {
                // Wait for the 'idle' event if bounds are not available
                google.maps.event.addListenerOnce(map, 'idle', function() {
                    resolve(map.getBounds());
                });
            }
        } else {
            reject(new Error("Map is not initialized"));
        }
    });
}
