
function showMemories( 
    timestamp){
        bounds = getBounds();
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

function buildContent(memory) {
    const content = document.createElement("div");
  
    content.classList.add("property");
    console.log(memory);
    console.log(memory['title']);
    console.log(memory[0].title);
    memory = memory[0]


    content.innerHTML = `
      <div class="icon">
          <i aria-hidden="true" class="fa-solid fa-person-falling-burst" title="${memory.title}"></i>
      </div>
      <div class="details">
          <div class="price">${memory.title}</div>
          <div class="address">${memory.description}</div>
          <div class="features">
          <div>
              <i aria-hidden="true" class="fas fa-bed" title="bedroom"></i>
              <span class="fa-sr-only">bedroom</span>
              <span>${memory.bed}</span>
          </div>
          </div>
      </div>
      `;
    return content;
}
  
async function _populateMemories(res){
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  for (memory in res){
      console.log(res[memory])
      if (res[memory].length > 1){
          //_populateSharedMemories(res[memory])
          //add Support for shared memory here
          console.log("BIGGER THAN 1")
          continue
      }      
      const AdvancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
          map,
          content: buildContent(res[memory]),
          position: { lat: res[memory][0]["lat"], lng: res[memory][0]["lon"] },
          title: res[memory]["title"],
          //TODO: Need to eventually add animation
      });
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
  