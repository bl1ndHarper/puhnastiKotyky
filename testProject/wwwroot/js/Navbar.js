const tabs = document.querySelectorAll(".navbar__tab-item");

var currentPage = window.location.pathname;
if (currentPage.search("Account") != -1) {
    Array.from(tabs).at(1).style.background = "#8EC3B0";
}
else if (currentPage.search("Notifications") != -1) {
    Array.from(tabs).at(2).style.background = "#8EC3B0";
}
else if (currentPage == "/" || currentPage.search("Welcome") != -1) {
    Array.from(tabs).at(0).style.background = "#8EC3B0";
}

function showLoggedOutToast() {
    const toast = document.querySelector("#loggedOutToast");
    toast.firstChild.textContent = "Logging out...";
    toast.classList.remove("hidden");
    setTimeout(function () {
        toast.classList.add("hidden");
        document.querySelector("#logOutForm").submit();
    }, 1500)
}


const collapsibleButton = document.querySelector(".navbar__branding").querySelector("span");
const tabsContainer = document.querySelector(".navbar__tabs");
const navbarContainer = document.querySelector(".navbar__container");

window.addEventListener('load', checkFlexGap);
window.addEventListener('resize', checkFlexGap);
function checkFlexGap() {
    var containerWidth = navbarContainer.offsetWidth;
    var childrenWidth = 0;
    Array.from(navbarContainer.children).forEach(function (child) {
        var childRect = child.getBoundingClientRect();
        childrenWidth += childRect.width;
    });

    var gap = containerWidth - childrenWidth;

    if (collapsibleButton.classList.contains('hidden')) {
        if (gap < 0) {
            tabsContainer.classList.add('collapsed');
            tabsContainer.classList.add('hidden');
            collapsibleButton.classList.remove('hidden');
        }
    } else {
        if (gap >= childrenWidth) {
            tabsContainer.classList.remove('collapsed');
            tabsContainer.classList.remove('hidden');
            collapsibleButton.classList.add('hidden');
        }
    }
}

collapsibleButton.addEventListener('click', function () {
    collapsibleSwitch();
});
function collapsibleSwitch() {
    tabsContainer.classList.toggle('hidden');
    collapsibleButton.classList.toggle('fa-caret-up');
}