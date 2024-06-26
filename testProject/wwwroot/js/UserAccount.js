﻿var buttonEdit = document.getElementById("buttonEditProfile");
var buttonAccept = document.getElementById("buttonSaveProfileChanges");
var buttonCancel = document.getElementById("buttonCancelProfileChanges");
var descTextArea = document.getElementById("selfDescriptionText");
var userImageContainer = document.getElementById("userImageContainer");
var userImage = document.getElementById("userImage");
var imageInput = document.getElementById("imageInput");
var deleteUserImageButton = document.getElementById("deleteUserImageButton");
var changeUserImageText = document.getElementById("changeUserImageText");
var addUserTechnology = document.getElementById("addUserTechnology");
var userAccountTechnologies = document.getElementById("userAccountTechnologies");
var userTechsArray = [];
var updatedUserTechsArray = document.getElementById("updatedUserTechsArray");
var modelTechsArray = [];
var originalText;
const userSocials = document.querySelector(".user-account-day__user-socials");
const addSocialMediaLink = document.querySelector("#addLink");
const addLinkInput = document.querySelector(".user-account-day__user-socials input");
const addLinkContainer = addLinkInput.parentElement;
const userAccountTabs = document.querySelectorAll(".user-account-day__tab-name");

function auto_height(elem) {
    elem.style.height = '1px';
    elem.style.height = `${elem.scrollHeight}px`;
}

window.onload = function () {
    auto_height(descTextArea);
}

function is_touch_enabled() {
    return ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);
}


/* USER PROFILE */
function editProfile() {
    buttonEdit.classList.add("hidden");
    buttonAccept.classList.remove("hidden");
    buttonCancel.classList.remove("hidden");

    originalText = descTextArea.value;

    descTextArea.readOnly = false;
    descTextArea.style.outline = "outset 1px"
    userImageContainer.classList.add("hover-active");
    userAccountTechnologies.classList.add("hover-active");
    addUserTechnology.classList.remove("hidden");
    addSocialMediaLink.classList.remove("hidden");
    userSocials.classList.add("editable");

    if (is_touch_enabled()) {
        userImageContainer.addEventListener("touchstart", handleTouchClick);
    }

    imageInput.onchange = function () {
        if (imageInput.files.length > 0) {
            const fileSize = imageInput.files[0].size;
            const fileMb = fileSize / 1024 / 1024;
            if (fileMb >= 7) {
                alert("Please select a file less than 7 MB.");
                imageInput.value = null;
            }
        }

        if (imageInput.files[0] != null && imageInput.files[0] != "") {
            userImage.src = URL.createObjectURL(imageInput.files[0]);
        }
    }

    buttonCancel.onclick = function () {
        imageInput.onchange = null;
        stopEditingProfile();
    };

    setUpLinks();
}

function stopEditingProfile() {
    buttonEdit.classList.remove("hidden");
    buttonAccept.classList.add("hidden");
    buttonCancel.classList.add("hidden");
    descTextArea.readOnly = true;
    descTextArea.style.outline = "none"
    userImageContainer.classList.remove("hover-active");
    userAccountTechnologies.classList.remove("hover-active");
    addUserTechnology.classList.add("hidden");
    addSocialMediaLink.classList.add("hidden");
    addLinkContainer.classList.add("hidden");
    userSocials.classList.remove("editable");

    descTextArea.value = originalText;

    var form = document.querySelector('form');
    form.reset();
    location.reload();

    if (is_touch_enabled()) {
        userImageContainer.removeEventListener("touchstart", handleTouchClick);
    }
}

let tapCounter = 0;
function handleTouchClick(event) {
    event.preventDefault();

    tapCounter++;
    if (tapCounter === 1 && event.target.id !== "deleteUserImageButton") {
        showOverlayOnTouch();
        setTimeout(() => {
            hideOverlay();
            tapCounter = 0;
        }, 5000);
    } else if (tapCounter === 2 && event.target.id !== "deleteUserImageButton") {
        imageInput.click();
        tapCounter = 0;
    } else if (event.target.id === "deleteUserImageButton") {
        deleteUserImage();
    }
}

function showOverlayOnTouch() {
    const overlay = userImageContainer.querySelector(".user-account-day__change-user-image-overlay");
    overlay.style.opacity = 1;
    overlay.style.pointerEvents = 'auto';
}

function hideOverlay() {
    const overlay = userImageContainer.querySelector(".user-account-day__change-user-image-overlay");
    overlay.style.opacity = 0;
    overlay.style.pointerEvents = 'none';
}

let clickCounter = 0;
function deleteUserImage() {
    clickCounter++;
    changeUserImageText.innerHTML = "Click again to delete your profile image";

    if (clickCounter == 2) {
        userImage.src = "/images/default-profile-icon (1).png";

        fetch('/images/default-profile-icon (1).png')
            .then(response => response.blob())
            .then(blob => {
                const file = new File([blob], 'default-profile-icon.png', {
                    type: 'image/png',
                });

                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                imageInput.files = dataTransfer.files;
            })
            .catch(error => {
                console.error('An error occurred while loading profile image: ', error);
            });

        changeUserImageText.innerHTML = "Click to change";
        clickCounter = 0;
        tapCounter = 0;
        hideOverlay();
    }
    else {
        setTimeout(function () {
            changeUserImageText.innerHTML = "Click to change";
            clickCounter = 0;
        }, 3000)
    }
}

function openTechsDropdown(dropDown, plusButton) {
    dropDown.classList.remove("hidden");
    plusButton.classList.add("hidden");

    removeChosen();
};
function closeTechsDropdown(dropDown, plusButton) {
    dropDown.classList.add("hidden");
    plusButton.classList.remove("hidden");
}

function dropdownFilterFunction(input, dropdown) {
    var filter, p, i;
    filter = input.value.toUpperCase();
    p = dropdown.getElementsByTagName("p");
    for (i = 0; i < p.length; i++) {
        txtValue = p[i].textContent || p[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            p[i].style.display = "";
        } else {
            p[i].style.display = "none";
        }
    }
}

function removeChosen() {
    var container = document.getElementById("dropdownTechsContainer");
    container.replaceChildren();
    for (var i = 0; i < modelTechsArray.length; i++) {
        const p = document.createElement("p");
        p.id = "userTechsDropdownItem";
        p.textContent = modelTechsArray[i];
        p.onclick = function () { chooseUserTech(p.textContent); };
        container.appendChild(p);
    }
    for (var i = 0; i < userTechsArray.length; i++) {
        for (var j = 0; j < container.childElementCount; j++) {
            if (userTechsArray[i] == container.children[j].textContent) {
                container.children[j].remove();
            }
        }
    }
}

var techsDropdownItem = document.getElementById("userTechsDropdownItem");
function chooseUserTech(techName) {
    const divElement = document.createElement("div");
    const tooltip = document.createElement("span");
    const removeOverlay = document.createElement("div");
    const paragraph = document.createElement("p");

    tooltip.classList.add("user-account-day__tooltip");
    tooltip.textContent = "Click to delete";
    removeOverlay.classList.add("removeTechOverlay");

    paragraph.append(techName);
    divElement.append(tooltip);
    divElement.append(removeOverlay);
    divElement.append(paragraph);

    divElement.onclick = function () {
        removeUserTech(divElement, techName)
    }

    const container = document.getElementById("userAccountTechnologies");
    container.insertBefore(divElement, addUserTechnology);

    addUserTechToArray(techName);
    updatedUserTechsArray.value = userTechsArray;

    removeChosen()
}

function removeUserTech(element, techName) {
    const userTechsInput = document.getElementById("userTechsInput");
    if (!buttonAccept.classList.contains("hidden")) {
        element.remove();
        var index = userTechsArray.indexOf(techName);
        if (userTechsArray.length == 1) { // user is trying to delete the last element left
            updatedUserTechsArray.value = "none";
            userTechsArray.splice(index, 1);
        } else {
            userTechsArray.splice(index, 1);
            updatedUserTechsArray.value = userTechsArray;
        }

        removeChosen()
    }
}

function addUserTechToArray(techName) {
    userTechsArray.push(techName);
}


// social media links setup
addSocialMediaLink.addEventListener("click", function () {
    addLinkContainer.classList.toggle("hidden");
});

const socialsContainer = document.querySelector(".user-account-day__user-socials-container");
const addSocialMediaButton = addLinkContainer.querySelector("button");
var originalLinksArray = [];
var newLinksArray = [];

setUpLinks();
populateLinksArray();

function setUpLinks() {
    Array.from(socialsContainer.children).forEach(function (item) {
        var i = item.querySelector("i");
        var link = item.querySelector("a");
        if (link != null && i != null) {
            link.textContent = extractRootDomain(link.href);
            link = link.href;
            i.className = assignFaClass(link);
        }
        if (item.tagName == "DIV" && item.id != "addLink") {
            if (userSocials.classList.contains("editable")) {
                item.removeEventListener("click", allowOpenSocialMediaLink(item));
                item.addEventListener("click", forbidOpenSocialMediaLink(item));
                item.onclick = function (event) {
                    event.preventDefault();
                    item.remove();
                    newLinksArray.splice(newLinksArray.indexOf(item.querySelector("a").href), 1)
                    document.getElementById("newSocialMediasArray").value = newLinksArray;
                };
            } else {
                item.removeEventListener("click", forbidOpenSocialMediaLink(item));
                item.addEventListener("click", allowOpenSocialMediaLink(item));
            }
        }
    });
}

function populateLinksArray() {
    Array.from(socialsContainer.children).forEach(function (item) {
        var link = item.querySelector("a");
        if (link != null) {
            originalLinksArray.push(link.href);
            newLinksArray.push(link.href);
        }
    });
    document.getElementById("originalSocialMediasArray").value = originalLinksArray;
    document.getElementById("newSocialMediasArray").value = originalLinksArray;
}

function allowOpenSocialMediaLink(linkItem) {
    var a = linkItem.querySelector("a");
    a.style.pointerEvents = "auto";
}
function forbidOpenSocialMediaLink(linkItem) {
    var a = linkItem.querySelector("a");
    a.style.pointerEvents = "none";
}
addSocialMediaButton.addEventListener("click", function () {
    addSocialMedia(addLinkInput.value);
});
function addSocialMedia(link) {
    if (validateDomain(extractRootDomain(link)) &&
        link.includes("http://") || link.includes("https://")) { // the input string must be a link
        const linksCount = 5;
        if (limitLinksCount(linksCount)) {
            alert("You can add up to " + linksCount + " social media links.")
            addLinkInput.value = "";
            return;
        }
        if (newLinksArray.includes(link)) {
            alert("This link has already been added.");
            addLinkInput.value = "";
            return;
        }
        const div = document.createElement("div");
        const i = document.createElement("i");
        const a = document.createElement("a");
        const classes = assignFaClass(link).split(" ");
        Array.from(classes).forEach(function (c) {
            i.classList.add(c);
        });
        a.href = link;
        a.target = "_blank"
        a.textContent = extractRootDomain(link);
        div.appendChild(i);
        div.appendChild(a);
        socialsContainer.insertChildAtIndex(div, socialsContainer.children.length - 1);
        addLinkInput.value = "";
        setUpLinks();
        newLinksArray.push(link);
        document.getElementById("newSocialMediasArray").value = newLinksArray;
    } else {
        alert("An error occurred validating the URL. Please, make sure your URL is valid and try again.")
    }
}

Element.prototype.insertChildAtIndex = function (child, index) {
    if (!index) index = 0
    if (index >= this.children.length) {
        this.appendChild(child)
    } else {
        this.insertBefore(child, this.children[index])
    }
}
function limitLinksCount(linksCount) {
    if (socialsContainer.childElementCount-2 >= linksCount) {
        return true;
    }
    return false;
}

function highlightSelectedTab(event) {
    userAccountTabs.forEach(function (tab) {
        tab.classList.remove('user-account-day__tab-active');
    });

    event.currentTarget.classList.add('user-account-day__tab-active');
}

function loadTabPartialView(event) {
    let url;

    switch (event.currentTarget.id) {
        case 'ownProjectsTab':
            url = '/UserAccount/Tabs/OpenOwnProjectsTab';
            break;
        case 'communityProjectsTab':
            url = '/UserAccount/Tabs/OpenCommunityProjectsTab';
            break;
        case 'requestsTab':
            url = '/UserAccount/Tabs/OpenRequestsTab';
            break;
    }

    $.ajax({
        url: url,
        type: 'GET',
        success: function (data) {
            document.getElementById("tabsContainer").innerHTML = data;
        },
        error: function () {
            console.error('Failed to load a tab:', textStatus, errorThrown);
        }
    });        
}

userAccountTabs.forEach(function (tab) {
    tab.addEventListener('click', highlightSelectedTab);
    tab.addEventListener('click', loadTabPartialView);
});