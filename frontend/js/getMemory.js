let markersArray = [];

function getMemoriesCalandar(timestamp,bounds){
        var dataStruct ={
            "ne_lat": bounds.getNorthEast().lat(),
            "ne_long": bounds.getNorthEast().lng(),
            "sw_lat": bounds.getSouthWest().lat(),
            "sw_long": bounds.getSouthWest().lng(),
            "center_lat":bounds.getCenter().lat(),
            "center_long":bounds.getCenter().lng(),
            "timestamp": timestamp,
        }
    
        $.ajax({
            url: showMemoriesEndpoint,
            type: "GET",
            data: dataStruct,
            success: function (res) {

                _populateMemories(res)

            }
        })
}

function showAllMemories(timestamp){
    var dataStruct ={
        "timestamp": timestamp,
    }

    $.ajax({
        url: showAllMemoriesEndpoint,
        type: "GET",
        data: dataStruct,
        success: function (res) {
            _populateMemories(res)
        }
    })
}

function getMemoriesForCalendar() {
    return new Promise(async (resolve, reject) => {
        var bounds = await _getBounds();
        var dataStruct = {
            "ne_lat": bounds.getNorthEast().lat(),
            "ne_long": bounds.getNorthEast().lng(),
            "sw_lat": bounds.getSouthWest().lat(),
            "sw_long": bounds.getSouthWest().lng(),
            "center_lat": bounds.getCenter().lat(),
            "center_long": bounds.getCenter().lng(),
        };

        $.ajax({
            url: showMemoriesEndpoint,
            type: "GET",
            data: dataStruct,
            success: function (res) {
                resolve(res); // Resolve the promise with the response
            },
            error: function (err) {
                reject(err); // Reject the promise if there's an error
            }
        });
    });
}

async function _populateMemories(res){
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
    console.log(res)
    for (memory in res){
        console.log(res[memory]);
        if (res[memory].length > 1){
            console.log("Shared Memory")

            sharedObject = _formatSharedMemories(res[memory])
            createSharedMemoryMarker(sharedObject)
          //add Support for shared memory here
        }   
        else{
            const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
                map,
                content: buildContent(res[memory]),
                position: { lat: res[memory]["lat"], lng: res[memory]["lon"] },
                title: res[memory]["title"],
                //TODO: Need to eventually add animation
            });
            markersArray.push(AdvancedMarkerElement)

            AdvancedMarkerElement.addListener("click", () => {
                toggleHighlight(AdvancedMarkerElement);
            });
    }
  }    
}

// icon: "fa fa-hospital-o"
// lat: 31.50477492950456
// link: "https://maha.com"
// location: "Gaza"
// lon: 34.468350995865435
// timestamp: "2023-12-08"
// title: "Testing Add 2"
// type: "Video"

function createSharedMemoryMarker(sharedObject){

    console.log(sharedObject)

    const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
            map,
            content: buildSharedContent(sharedObject),
            position: { lat: sharedObject["lat"], lng: sharedObject["lon"] },
            title: sharedObject["title"],
        })
        markersArray.push(AdvancedMarkerElement)

        AdvancedMarkerElement.addListener("click", () => {
        toggleHighlight(AdvancedMarkerElement);
        });

}

function _formatSharedMemories(sharedMemory){
    titles=[]
    links=[]
    ids=[]
    icon='fa-solid fa-user-group'
    for (memory in sharedMemory){
        titles.push(sharedMemory[memory]["title"])
        links.push(sharedMemory[memory]["link"])
        ids.push(sharedMemory[memory]["id"])
    }

    retunedObject = {
        "icon": icon,
        "title": "Shared Memories in "+sharedMemory[0]["location"],
        "titles": titles,
        "links": links,
        "ids": ids,
        "lat": sharedMemory[0]["lat"],
        "lon": sharedMemory[0]["lon"],
        "timestamp": sharedMemory[0]["timestamp"],
    }
    return retunedObject

}

function toggleHighlight(markerView) {
    if (markerView.content.classList.contains("highlight")) {
      markerView.content.classList.remove("highlight");
      markerView.zIndex = null;
    } else {
      markerView.content.classList.add("highlight");
      markerView.zIndex = 1;
    }
} 