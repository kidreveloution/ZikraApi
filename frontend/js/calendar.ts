import Pikaday from 'pikaday';
var formattedDate;
function handleDateSelection() {
    var selectedDate = picker.getDate();
    if (selectedDate)
    {
        formattedDate = selectedDate.toISOString();
        console.log("Selected Date: ", formattedDate);
        showMemories(formattedDate)
    }
    else{
        console.log("Error")
    }


}

var picker = new Pikaday({ 
    field: document.getElementById('datepicker'),
    defaultDate: new Date(),
    setDefaultDate: true,
    onSelect: handleDateSelection
});

// Trigger the handleDateSelection function on page load
handleDateSelection();
