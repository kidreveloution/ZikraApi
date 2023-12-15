let markersArray = [];

function showMemories(timestamp,bounds){
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
                console.log("THIS IS API RETURNS",res)
                resolve(res); // Resolve the promise with the response
            },
            error: function (err) {
                reject(err); // Reject the promise if there's an error
            }
        });
    });
}

function buildContent(memory) {
    const content = document.createElement("div");
  
    content.classList.add("property");
    //memory = memory[0]


    content.innerHTML = `
      <div class="icon">
          <i aria-hidden="true" class="fa-solid fa-person-falling-burst" title="${memory['title']}"></i>
      </div>
      <div class="details">
          <div class="price">${memory['title']}</div>
          <div class="address">${memory['link']}</div>
          <div class="features">
          <div>
              <i aria-hidden="true" class="fas fa-bed" title="bedroom"></i>
              <span class="fa-sr-only">bedroom</span>
          </div>
          </div>
      </div>
      `;
    return content;
}

async function _populateMemories(res){
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  for (memory in res){
      if (res[memory].length > 1){
          //_populateSharedMemories(res[memory])
          //add Support for shared memory here
          console.log("BIGGER THAN 1")
          continue
      }   
      console.log(memory)   
      const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
          map,
          content: buildContent(res[memory]),
          position: { lat: res[memory]["lat"], lng: res[memory]["lon"] },
          title: res[memory]["title"],
          //TODO: Need to eventually add animation
      });
      markersArray.push(AdvancedMarkerElement)

      AdvancedMarkerElement.addListener("click", () => {
        toggleHighlight(AdvancedMarkerElement, memory);
      });
  
  }    
}

function _populateSharedMemories(sharedMemory){
    titles = []
    descx = []
    for (memory in sharedMemory){

    }

}

function toggleHighlight(markerView, property) {
    if (markerView.content.classList.contains("highlight")) {
      markerView.content.classList.remove("highlight");
      markerView.zIndex = null;
    } else {
      markerView.content.classList.add("highlight");
      markerView.zIndex = 1;
    }
} 