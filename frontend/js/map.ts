const src = "https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.bundle.min.js";
let map: google.maps.Map;
let clickListener: google.maps.MapsEventListener | null = null; 
let lat: number;
let long: number;
let locationName: string;

// Initialize Google Maps
function initMap(): void {
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        zoom: 10,
        center: { lat: 31.476737, lng: 34.4813380 },
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
            }
        ],
        mapId: 'DEMO_MAP_ID'
    });
}

// Function to activate map click event
function activateMapClick(): void {
    if (!clickListener) {
        clickListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
            lat = e.latLng!.lat();
            long = e.latLng!.lng();
            dropLocPin(e.latLng!);

            getAddress(lat, long, (address: string) => {
                if (address) {
                    const inputField = document.getElementById('location') as HTMLElement;
                    inputField.innerHTML = address;
                    console.log(address);
                }
            });
        });
    }
}
function getAddress(lat: number, long: number, callback: (address: string) => void): void {
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
function deactivateMapClick(): void {
    if (clickListener) {
        google.maps.event.removeListener(clickListener);
        clickListener = null;
    }
}

let marker: google.maps.Marker | null = null;
function dropLocPin(latLng: google.maps.LatLng): void {
    if (marker) {
        marker.setPosition(latLng);
    } else {
        marker = new google.maps.Marker({
            position: latLng,
            map: map,
            animation: google.maps.Animation.DROP,
        });
    }
}

function getBounds(): google.maps.LatLngBounds | null {
    return map.getBounds() as google.maps.LatLngBounds | null;
}

// Load the map
window.onload = function() {
    initMap();
};