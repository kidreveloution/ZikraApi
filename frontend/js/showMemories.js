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
                console.log(res)

            }
        })
    }