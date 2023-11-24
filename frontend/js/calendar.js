"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pikaday_1 = __importDefault(require("pikaday"));
var formattedDate;
function handleDateSelection() {
    var selectedDate = picker.getDate();
    if (selectedDate) {
        formattedDate = selectedDate.toISOString();
        console.log("Selected Date: ", formattedDate);
        showMemories(formattedDate);
    }
    else {
        console.log("Error");
    }
}
var picker = new pikaday_1.default({
    field: document.getElementById('datepicker'),
    defaultDate: new Date(),
    setDefaultDate: true,
    onSelect: handleDateSelection
});
// Trigger the handleDateSelection function on page load
handleDateSelection();
