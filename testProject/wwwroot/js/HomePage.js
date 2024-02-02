const filtersHeader = document.querySelector('.home__catalog-filters-header');
const filtersOpenIcon = filtersHeader.querySelector('i');

// filters open button setup
filtersHeader.onclick = function () {
    if (filtersOpenIcon.classList.contains('down')) {   // filters are open
        filtersOpenIcon.classList.replace('down', 'up');
        Array.from(filtersHeader.parentElement.querySelectorAll('div:not(:first-child)')).forEach(function (element) {
            element.classList.remove('hidden');
        });
    } else {
        filtersOpenIcon.classList.replace('up', 'down');
        Array.from(filtersHeader.parentElement.querySelectorAll('div:not(:first-child)')).forEach(function (element) {
            element.classList.add('hidden');
        });
    }
}

const filters = filtersHeader.parentElement;

// complexity selector
Array.from(filters.querySelector('.complexity').querySelectorAll(':not(:first-child)')).forEach(function (levelButton) {
    levelButton.addEventListener('click', function () {
        selectFilterLevel(levelButton.textContent);
        // change the background color of a selected level
        clearFilterLevel();
        levelButton.style.backgroundColor = '#9ED5C5';
    });
});
function selectFilterLevel(levelName) {
    var filterLevelInput = document.querySelector("#complexity");
    filterLevelInput.value = levelName;
}
function clearFilterLevel() {
    Array.from(filters.querySelector(".complexity").children).forEach(function (p) {
        p.removeAttribute('style');
    });
}
function clearFilterDuration() {
    filters.querySelector(".duration").children.item(1).querySelector('input').value = 1;
    filters.querySelector(".duration").children.item(2).querySelector('input').value = 100;
}

// clear filters button functionality
const clearFiltersButton = filters.querySelector('.home__catalog-filters-buttons').children.item(0);
clearFiltersButton.onclick = function () {
    clearFilterLevel();
    clearFilterDuration()
}

// apply filters button
const applyFiltersButton = filters.querySelector('.home__catalog-filters-buttons').children.item(1);
applyFiltersButton.onclick = function () {
    const level = document.querySelector("#complexity").value;
    const durationFrom = filters.querySelector(".duration").children.item(1).querySelector('input').value;
    const durationTo = filters.querySelector(".duration").children.item(2).querySelector('input').value;
    console.log("level = " + level + "; from = " + durationFrom + "; to = " + durationTo)
}
