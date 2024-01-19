const tabs = document.querySelectorAll(".navbar__tab-item");

var currentPage = window.location.pathname;
if (currentPage.search("Account/Index") != -1) {
    Array.from(tabs).at(1).style.background = "#8EC3B0";
}
else if (currentPage == "/") {
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