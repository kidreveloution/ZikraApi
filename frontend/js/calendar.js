var formattedDate;
memoryDates = []

function handleDateSelection() {
    var selectedDate = picker.getDate();
    formattedDate = selectedDate.toISOString();
    console.log("Selected Date: ", formattedDate);
    showMemories(formattedDate)

}

function getDates() {
    console.log("MEGAIND")
    results = getMemoriesForCalendar();
    // Assuming getMemoriesForCalendar is synchronous or this is inside a callback
    memoryDates = []; // Reset the array
    for (let result of results) { // Using for...of for array iteration
        memoryDates.push(new Date(result)); // Using push instead of append
        console.log("Memory Date: ", new Date(result));
    }

    // initializePikaday(); // Reinitialize Pikaday with the new dates
}


var picker = new Pikaday({
    field: document.getElementById('datepicker'),
    onSelect: function(date) {
        console.log(date);
    },
    events:[],
});
// function initPicker(){

// }
handleDateSelection();


window.onload = function() {
    //initPicker();
    getDates();
};
getDates();
