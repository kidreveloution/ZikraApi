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

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addMemoryForm').addEventListener('submit', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();
        console.log('Form submitted!'); 
        console.log()
  
        var memory ={
            "title": String(document.getElementById('title').value),
            "location": String(document.getElementById('location').value),
            "timestamp": String(document.getElementById('timestamp').value),
            "lat": String(newMarkerLat),
            "lon": String(newMarkerLong),
            "link": String(document.getElementById('link').value),
            "icon":String(document.getElementById('eventCategory').value),
        }

        $.ajax({
            url: addMemoryEndpoint,
            type: "POST",
            data: JSON.stringify(memory),
            contentType: "application/json",
            success: function (data) {
                console.log("Memory Added")
                //document.getElementById("addMemoryForm").reset();
            }
        })
    
    
    
    });
});

