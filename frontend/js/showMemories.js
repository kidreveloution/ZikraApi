"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function showMemories(timestamp) {
    const bounds = getBounds();
    if (bounds) {
        var dataStruct = {
            "ne_lat": bounds.getNorthEast().lat(),
            "ne_long": bounds.getNorthEast().lng(),
            "sw_lat": bounds.getSouthWest().lat(),
            "sw_long": bounds.getSouthWest().lng(),
            "center_lat": bounds.getCenter().lat(),
            "center_long": bounds.getCenter().lng(),
            "timestamp": timestamp,
        };
    }
    else {
        console.log("Bounds Not found");
        return;
    }
    $.ajax({
        url: showMemoriesEndpoint,
        type: "GET",
        data: dataStruct,
        success: function (res) {
            _populateMemories(res);
        }
    });
}
function _populateMemories(res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { AdvancedMarkerElement } = yield google.maps.importLibrary("marker");
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
    });
}
// function _populateSharedMemories(sharedMemory){
//     titles = []
//     descx = []
//     for (memory in sharedMemory){
//     }
// }
