
function showMemories(timestamp: string): void{
        const bounds = getBounds();
        if (bounds){
            var dataStruct ={
                "ne_lat": bounds.getNorthEast().lat(),
                "ne_long": bounds.getNorthEast().lng(),
                "sw_lat": bounds.getSouthWest().lat(),
                "sw_long": bounds.getSouthWest().lng(),
                "center_lat":bounds.getCenter().lat(),
                "center_long":bounds.getCenter().lng(),
                "timestamp": timestamp,
            }
        }
        else{
            console.log("Bounds Not found")
            return
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

async function _populateMemories(res: {}): Promise<void>{
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
    for (const memory in res) {
        console.log(memory);
        // if (memory.length > 1) {
        //     _populateSharedMemories(memory);
        //     console.log("BIGGER THAN 1");
        //     continue;
        }
        // const memoryData = memory[0];
        // console.log(memoryData.lat);
        // const marker = new AdvancedMarkerElement({
        //     map,
        //     position: { lat: memoryData.lat, lng: memoryData.lon },
        //     title: memoryData.title,
        //     // TODO: Add animation here if needed
        // });
    //}    
}

// function _populateSharedMemories(sharedMemory){
//     titles = []
//     descx = []
//     for (memory in sharedMemory){

//     }

// }