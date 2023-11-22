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
    var memory ={
        "title": document.getElementById('title').value,
        "lat": lat,
        "long": long,
        "timestamp": document.getElementById('timestamp').value,
        "link": document.getElementById('link').value,

    }
    console.log(memory)
    
    // $.ajax({
    //     url: "../xxx/functions/email/",
    //     type: "POST",
    //     data: email,
    //     contentType: "application/json",
    //     success: function (data) {
    //         callback(data);
    //     }
    // })
});