let filterSearchButton = document.getElementById('filter-search');

function filterSearch(event) {
    event.preventDefault();
    let visitCards = document.getElementsByClassName('visits-container');
    let filterName = document.getElementById('filter-name').value.trim();
    let filterDoctor = document.getElementById('filter-doctor').value;
    let filterUrgency = document.getElementById('filter-urgency').value;

    console.log(filterDoctor, filterName, filterUrgency);
    
    Array.from(visitCards).forEach(element => {
        let match = true;
        if (filterDoctor !== 'all' && element.dataset.doctor !== filterDoctor) {
            match = false;
        }
        if (filterUrgency !== 'all' && element.dataset.urgency !== filterUrgency) {
            match = false;
        }
        if (filterName && !element.dataset.name.includes(filterName)) {
            match = false;
        }
        if (match) {
            element.style.display = 'flex'
        } else {
            element.style.display = 'none'
        }
    });

};

filterSearchButton.addEventListener('click', filterSearch);