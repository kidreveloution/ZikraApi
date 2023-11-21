document.getElementById('addMemoryBtn').addEventListener('click', function() {
    var icon = document.getElementById('icon');
    if (icon.classList.contains('fa-plus')) {
        datepicker.style.display = 'none'; 
        addMemDiv.style.removeProperty('display');
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');

    } else {
        datepicker.style.removeProperty('display');
        addMemDiv.style.display = 'none'; 
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
    }
});
