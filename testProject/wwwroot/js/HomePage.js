const filtersHeader = document.querySelector('.home__catalog-filters-header');
const filtersOpenIcon = filtersHeader.querySelector('i');
var level = '';
var minDuration = 1;
var maxDuration = 100;
var selectedTechnologies = [];
var availableTechs = document.querySelector("#availableTechs").value.split(',');

    // ATTENTION! availableTechs is all technologies from db needed at the start

function loadProjects(page, level, minDuration, maxDuration, techsArray) {
    $.ajax({
        url: '/Home/Home/LoadProjects',
        type: 'GET',
        data: {
            page: page,
            level: level,
            minDuration: parseInt(minDuration),
            maxDuration: parseInt(maxDuration),
            techsArray: techsArray === undefined ? techsArray : techsArray.toString()
        },
        success: function (data) {
            // Update project container with new projects
            $('#projectContainer').html(data);
        },
        error: function () {
            console.log('Error loading projects.');
        }
    });
}

function showPageNumbers(currentPage, level, minDuration, maxDuration, techsArray) {
    $.ajax({
        url: '/Home/Home/CountPages',
        type: 'GET',
        data: {
            level: level,
            minDuration: parseInt(minDuration),
            maxDuration: parseInt(maxDuration),
            techsArray: techsArray.toString()
        },
        success: function (data) {
            var rangeWithDots = pagination(currentPage, data);
            $('#pagination').empty(); // Clear previous page numbers

            if (rangeWithDots.length > 0) {
                $('#pagination').append('<li class="arrow left"></li>');

                for (var i = 0; i < rangeWithDots.length; i++) {
                    if (rangeWithDots[i] == '...') {
                        $('#pagination').append('<li class="dots">' + '...' + '</li>');
                    } else {
                        $('#pagination').append('<li>' + rangeWithDots[i] + '</li>');
                    }
                }

                $('#pagination').append('<li class="arrow right"></li>');
                // Highlight the current page
                $('#pagination li').filter(function () {
                    return $(this).text() == currentPage;
                }).addClass('home__catalog-pagination-chosen-page');
            }    
        },
        error: function () {
            console.log('Error counting pages.');
        }
    });
}

function pagination(currentPage, total) {
    var current = parseInt(currentPage),
        last = parseInt(total),
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

    for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
}

$(document).ready(function () {
    loadProjects(1, '', 1, 100, availableTechs); // Load projects for the first page
    showPageNumbers(1, '', 1, 100, availableTechs); // Display page numbers for the first page
  
});

$('#pagination').on('click', 'li:not(.right, .left, .dots)', function () {
    $('#pagination li').removeClass('home__catalog-pagination-chosen-page');
    $(this).addClass('home__catalog-pagination-chosen-page'); // Highlight the chosen page

    var page = $(this).text();
    loadProjects(page, level, minDuration, maxDuration, selectedTechnologies);
    showPageNumbers(page, level, minDuration, maxDuration, selectedTechnologies);

    // Scroll to the top of the home__catalog container
    var container = document.querySelector('.home__catalog');
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

$('#pagination').on('click', 'li.right', function () {
    var chosenPage = $('#pagination li.home__catalog-pagination-chosen-page');
    var nextPage = chosenPage.next();

    // check whether it's not the last page
    if (!nextPage.hasClass('arrow')) {
        chosenPage.removeClass('home__catalog-pagination-chosen-page');
        nextPage.addClass('home__catalog-pagination-chosen-page');

        var page = nextPage.text();
        loadProjects(page, level, minDuration, maxDuration, selectedTechnologies);
        showPageNumbers(page, level, minDuration, maxDuration, selectedTechnologies);

        // Scroll to the top of the home__catalog container
        var container = document.querySelector('.home__catalog');
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

$('#pagination').on('click', 'li.left', function () {
    var chosenPage = $('#pagination li.home__catalog-pagination-chosen-page');
    var prevPage = chosenPage.prev();

    // check whether it's not the first page
    if (!prevPage.hasClass('arrow')) {
        chosenPage.removeClass('home__catalog-pagination-chosen-page');
        prevPage.addClass('home__catalog-pagination-chosen-page');

        var page = prevPage.text();
        loadProjects(page, level, minDuration, maxDuration, selectedTechnologies);
        showPageNumbers(page, level, minDuration, maxDuration, selectedTechnologies);

        // Scroll to the top of the home__catalog container
        var container = document.querySelector('.home__catalog');
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

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

// technologies selector
const searchTechnologiesInput = filters.querySelector(".technologies-search input");
const addButton = filters.querySelector(".home__catalog-filter-search .button");
// suggest the nearest autocomplete option
autocomplete(searchTechnologiesInput, availableTechs);
function autocomplete(inp, arr) {
    var suggested = "";
    // when user starts typing
    inp.addEventListener("input", function () {
        suggested = "";
        // find nearest value from techs
        for (let i = 0; i < arr.length; i++) {
            if (inp.value != "" && arr[i].toLowerCase().includes(inp.value.toLowerCase())) {
                suggested = arr[i];
                break;
            }
            else {
                closeAllLists(document);
            }
        }
        // suggest the nearest value
        if (suggested != null && suggested != "") {
            closeAllLists(document);
            const p = document.createElement("p");
            p.classList.add("autocomplete-item");
            p.textContent = suggested;
            p.addEventListener('click', function () {
                applyAutocompleteItem(p)
            });
            inp.after(p)
        }
        // color button if user typed an available tech
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == inp.value) {
                addButton.style.backgroundColor = '#bcead5';
                break;
            } else {
                addButton.style.backgroundColor = 'lightgrey';
            }
        }
    });
    // add a tech when clicked on button
    addButton.addEventListener('click', function (btn) {
        availableTechs.forEach(function (tech) {
            if (tech == searchTechnologiesInput.value) {
                addTech(tech);
                searchTechnologiesInput.value = "";
            }
        });
    });
    function applyAutocompleteItem(item) {
        searchTechnologiesInput.value = item.textContent;
        closeAllLists(document);
        addButton.style.backgroundColor = '#bcead5';
    }
    function addTech(tech) {
        const container = filters.querySelector(".technologies");
        p = document.createElement("p");
        p.textContent = tech;
        container.append(p);
        p.addEventListener('click', function () {
            removeTech(this);
        });
        availableTechs.splice(availableTechs.findIndex(x => x === tech), 1);
        selectedTechnologies.push(tech);
        addButton.style.backgroundColor = 'lightgrey';
    }
    function removeTech(element) {
        availableTechs.push(element.textContent);
        element.remove();
        selectedTechnologies.splice(selectedTechnologies.findIndex(x => x === element), 1);
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-item");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    // close autocomplete suggestion when clicked outside
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
function clearSelecetedTechs() {
    selectedTechnologies.forEach(function (tech) {
        availableTechs.push(tech);
    });
    selectedTechnologies = [];
    searchTechnologiesInput.value = "";
    filters.querySelector(".technologies").replaceChildren();
    addButton.style.backgroundColor = 'lightgrey';
}

// complexity selector
Array.from(filters.querySelector('.complexity').querySelectorAll(':not(:first-child)')).forEach(function (levelButton) {
    levelButton.addEventListener('click', function () {
        selectFilterLevel(levelButton.textContent);
        // change the background color of a selected level
        Array.from(filters.querySelector(".complexity").children).forEach(function (p) {
            p.removeAttribute('style');
        });
        levelButton.style.backgroundColor = '#9ED5C5';
    });
});
function selectFilterLevel(levelName) {
    var filterLevelInput = document.querySelector("#complexity");
    filterLevelInput.value = levelName;
}
function clearFilterLevel() {
    var filterLevelInput = document.querySelector("#complexity");
    filterLevelInput.value = '';
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
    clearFilterDuration();
    clearSelecetedTechs();

    var level = '';
    var minDuration = 1;
    var maxDuration = 100;

    loadProjects(1, level, minDuration, maxDuration, availableTechs);
    showPageNumbers(1, level, minDuration, maxDuration, availableTechs);
}

// apply filters button
const applyFiltersButton = filters.querySelector('.home__catalog-filters-buttons').children.item(1);
applyFiltersButton.onclick = function () {
    level = document.querySelector("#complexity").value;
    minDuration = filters.querySelector(".duration").children.item(1).querySelector('input').value;
    maxDuration = filters.querySelector(".duration").children.item(2).querySelector('input').value;
    console.log("level = " + level + "; from = " + minDuration + "; to = " + maxDuration + "; selected techs: " + selectedTechnologies)

    loadProjects(1, level, minDuration, maxDuration, selectedTechnologies);
    showPageNumbers(1, level, minDuration, maxDuration, selectedTechnologies);
}

// suggested projects carousel behavior
document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.home__recommendations-cards');
    const leftButton = document.querySelector('.carousel__button--left');
    const rightButton = document.querySelector('.carousel__button--right');
    const cards = document.querySelectorAll('.home__card');
    let cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);

    window.onresize = function() {
        if (container.scrollWidth > window.innerWidth - 36) {
            if (leftButton.classList.contains("hidden")) {
                leftButton.classList.remove("hidden");
                rightButton.classList.remove("hidden");
            }
        } else {
            if (!leftButton.classList.contains("hidden")) {
                leftButton.classList.add("hidden");
                rightButton.classList.add("hidden");
            }
        }
    }

    leftButton.addEventListener('click', function () {
        container.scrollBy({
            left: -cardWidth,
            behavior: 'smooth'
        });
    });

    rightButton.addEventListener('click', function () {
        container.scrollBy({
            left: cardWidth,
            behavior: 'smooth'
        });
    });
});