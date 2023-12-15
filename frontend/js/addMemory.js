document.getElementById('addMemoryBtn').addEventListener('click', function() {
    var icon = document.getElementById('icon');
    if (icon.classList.contains('fa-plus')) {
        datepicker.style.display = 'none'; 
        activateMapClick();
        addMemDiv.style.removeProperty('display');
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');

    } else {
        datepicker.style.removeProperty('display');
        addMemDiv.style.display = 'none'; 
        deactivateMapClick();
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
    }
});

document.getElementById('submitMemoryBtn').addEventListener('click', function() {    
    // var memory ={
    //     "title": String(document.getElementById('title').value),
    //     "location": String(locationName),
    //     "timestamp": String(document.getElementById('timestamp').value),
    //     "lat": String(lat),
    //     "lon": String(long),
    //     "link": String(document.getElementById('link').value),
    // }
    console.log("KISS OMK")

    // $.ajax({
    //     url: addMemoryEndpoint,
    //     type: "POST",
    //     data: JSON.stringify(memory),
    //     contentType: "application/json",
    //     success: function (data) {
    //         console.log("Memory Added")
    //         //document.getElementById("addMemoryForm").reset();
    //     }
    // })
});