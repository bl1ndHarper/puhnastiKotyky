$(document).ready(function () {
    loadProjects(1); // Load projects for the first page
    showPageNumbers(); // Display page numbers

    $('#pagination').on('click', 'li:not(.arrow)', function () {
        $('#pagination li').removeClass('home__catalog-pagination-chosen-page');
        $(this).addClass('home__catalog-pagination-chosen-page'); // Highlight the chosen page

        var page = $(this).text();
        loadProjects(page);

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

    function showPageNumbers() {
        $.ajax({
            url: '/Home/Home/CountPages',
            type: 'GET',
            success: function (data) {
                $('#pagination').empty(); // Clear previous page numbers
                $('#pagination').append('<li class="arrow left"></li>');

                // Add page numbers
                for (var i = 1; i <= data; i++) {
                    $('#pagination').append('<li>' + i + '</li>');
                }

                $('#pagination').append('<li class="arrow right"></li>');
                $('#pagination li:nth-child(2)').addClass('home__catalog-pagination-chosen-page'); // Highlight the first page
            },
            error: function () {
                console.log('Error counting pages.');
            }
        });
    }
});
