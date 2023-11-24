"use strict";
document.getElementById('addMemoryBtn').addEventListener('click', function () {
    const icon = document.getElementById('icon');
    const datepicker = document.getElementById('datepicker');
    const addMemDiv = document.getElementById('addMemDiv');
    if (icon && icon.classList.contains('fa-plus')) {
        if (datepicker) {
            datepicker.style.display = 'none';
        }
        activateMapClick();
        if (addMemDiv) {
            addMemDiv.style.removeProperty('display');
        }
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
    }
    else if (icon) {
        if (datepicker) {
            datepicker.style.removeProperty('display');
        }
        if (addMemDiv) {
            addMemDiv.style.display = 'none';
        }
        deactivateMapClick();
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
    }
});
document.getElementById('submitMemoryBtn').addEventListener('click', function () {
    const titleElement = document.getElementById('title');
    const timestamp = document.getElementById('timestamp');
    const link = document.getElementById('link');
    var memory = {
        "title": String(titleElement.value),
        "location": String(locationName),
        "timestamp": String(timestamp.value),
        "lat": String(lat),
        "lon": String(long),
        "link": String(link.value),
    };
    console.log(memory);
    $.ajax({
        url: addMemoryEndpoint,
        type: "POST",
        data: JSON.stringify(memory),
        contentType: "application/json",
        success: function (data) {
            console.log("Memory Added");
            const form = document.getElementById("addMemoryForm");
            form.reset();
        }
    });
});
