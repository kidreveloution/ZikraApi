var formattedDate;

function handleDateSelection() {
    var selectedDate = picker.getDate();
    formattedDate = selectedDate.toISOString();
    console.log("Selected Date: ", formattedDate);
    showMemories(formattedDate)

}

memoryDates = []

function init_pikaday(){
    picker = new Pikaday({ 
        field: document.getElementById('datepicker'),
        defaultDate: new Date(),
        setDefaultDate: true,
        render: function (date, cell) {
            if (memoryDates.some(memoryDates => 
                memoryDates.getDate() === memoryDates.getDate() && 
                memoryDates.getMonth() === memoryDates.getMonth() && 
                memoryDates.getFullYear() === memoryDates.getFullYear())) {
                    cell.classList.add('event-date'); // Add a class to event dates
            }
        },
        onSelect: handleDateSelection
    })
}

var picker = new Pikaday({ 
    field: document.getElementById('datepicker'),
    defaultDate: new Date(),
    setDefaultDate: true,
    onSelect: handleDateSelection
})

function getDates(){
    results = getMemoriesForCalendar()
    for (result in results){
        memoryDates.append(new Date(result))
        console.log("THESE ARE THE ",result)
    }
    picker.destroy(); // Destroy the current instance
    initializePikaday(); // Reinitialize Pikaday

}

// Trigger the handleDateSelection function on page load
handleDateSelection();
init_pikaday();
getDates();
console.log("GOT HERE")