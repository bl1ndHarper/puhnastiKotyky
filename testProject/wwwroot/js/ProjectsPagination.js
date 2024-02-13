$(document).ready(function () {
    loadProjects(1); // Load projects for the first page
    showPageNumbers(1); // Display page numbers for the first page

    $('#pagination').on('click', 'li:not(.right, .left, .dots)', function () {
        $('#pagination li').removeClass('home__catalog-pagination-chosen-page');
        $(this).addClass('home__catalog-pagination-chosen-page'); // Highlight the chosen page

        var page = $(this).text();
        loadProjects(page);
        showPageNumbers(page);

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
            loadProjects(page);
            showPageNumbers(page);

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
            loadProjects(page);
            showPageNumbers(page);

            // Scroll to the top of the home__catalog container
            var container = document.querySelector('.home__catalog');
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    function loadProjects(page) {
        $.ajax({
            url: '/Home/Home/LoadProjects',
            type: 'GET',
            data: { page: page },
            success: function (data) {
                // Update project container with new projects
                $('#projectContainer').html(data);
            },
            error: function () {
                console.log('Error loading projects.');
            }
        });
    }

    function showPageNumbers(currentPage) {
        $.ajax({
            url: '/Home/Home/CountPages',
            type: 'GET',
            success: function (data) {
                var rangeWithDots = pagination(currentPage, data);
                $('#pagination').empty(); // Clear previous page numbers
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
});
