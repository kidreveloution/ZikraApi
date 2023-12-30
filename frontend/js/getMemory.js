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

    for (memory in res){
        console.log(memory);
        if (res[memory].length > 1){

          //add Support for shared memory here
            console.log("Shared Memory")
            continue
      }   
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

function _populateSharedMemories(sharedMemory){
    titles = []
    descx = []
    for (memory in sharedMemory){

    }

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