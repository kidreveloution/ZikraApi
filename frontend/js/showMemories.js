
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

async function _populateMemories(res){
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    for (memory in res){
        console.log(res[memory])
        if (res[memory].length > 1){
            _populateSharedMemories(res[memory])
            //add Support for shared memory here
            console.log("BIGGER THAN 1")
            continue
        }
        console.log(res[memory][0]["lat"])
        const marker = new AdvancedMarkerElement({
            map,
            position: { lat: res[memory][0]["lat"], lng: res[memory][0]["lon"] },
            title: res[memory]["title"],
            //TODO: Need to eventually add animation
        });
    }    
}

function _populateSharedMemories(sharedMemory){
    titles = []
    descx = []
    for (memory in sharedMemory){

    }

}