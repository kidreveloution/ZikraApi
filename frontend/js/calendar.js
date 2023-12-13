var picker; // Global variable for the Pikaday instance

// Function to initialize or update Pikaday
function initializeOrUpdatePikaday(events) {
    // If picker already exists, destroy it
    if (picker) {
        picker.destroy();
    }

    // Initialize Pikaday with the new events
    picker = new Pikaday({
        field: document.getElementById('datepicker'),
        onSelect: function(date) {
            console.log("Selected Date: ", date.toISOString());
        },
        events: events.map(event => new Date(event))
    });
}

// Function to get dates and update Pikaday
async function updatePikadayWithNewEvents() {
    console.log("Kiss Omk")
    var results = await getMemoriesForCalendar(); // Fetch new events
    console.log(results)

    initializeOrUpdatePikaday(results);
}

// Initial setup of Pikaday without events
picker = new Pikaday({
    field: document.getElementById('datepicker'),
    onSelect: function(date) {
        console.log("Selected Date: ", date.toISOString());
    },
    events: [] // Initialize with no events
});

// Update Pikaday with new events
updatePikadayWithNewEvents();