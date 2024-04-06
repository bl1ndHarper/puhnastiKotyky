var buttonEdit = document.getElementById("buttonEditProfile");
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

function auto_height(elem) {
    elem.style.height = '1px';
    elem.style.height = `${elem.scrollHeight}px`;
}

window.onload = function () {
    auto_height(descTextArea);
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

    userImageContainer.addEventListener("click", imageButtonClickHandler);

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

    userImageContainer.removeEventListener("click", imageButtonClickHandler);
}
function imageButtonClickHandler() {
}

var clickCounter = 0;
function deleteUserImage() {
    clickCounter++;
    changeUserImageText.innerHTML = "Click again to delete your profile image";

    if (clickCounter == 2) {
        userImage.src = "/images/default-profile-icon (1).png";
        changeUserImageText.innerHTML = "Click to change";
        clickCounter = 0;

        $(function () {
            $.post("DeleteProfilePhoto", "Account");
        });
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
setUpLinks();
function setUpLinks() {
    Array.from(socialsContainer.children).forEach(function (item) {
        if (item.tagName == "DIV" && item.id != "addLink") {
            if (userSocials.classList.contains("editable")) {
                item.removeEventListener("click", allowOpenSocialMediaLink(item));
                item.addEventListener("click", forbidOpenSocialMediaLink(item));
                item.onclick = function (event) {
                    event.preventDefault();
                    item.remove();
                };
            } else {
                item.removeEventListener("click", forbidOpenSocialMediaLink(item));
                item.addEventListener("click", allowOpenSocialMediaLink(item));
            }
        }
    });
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
    if (link.includes("http://") || link.includes("https://")) {
        // the input string must be a link
        if (limitLinksCount(5)) {
            addLinkInput.value = "";
            return;
        }
        const div = document.createElement("div");
        const i = document.createElement("i");
        const a = document.createElement("a");
        const classes = assignFaClass(link).split(" ");
        Array.from(classes).forEach(function(c) {
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
        alert("You can add up to " + linksCount + " social media links.")
        return true;
    }
    return false;
}
const knownServices = [
    { domain: "github", faClass: "fa-github" },
    { domain: "linkedin", faClass: "fa-linkedin" },
    { domain: "facebook", faClass: "fa-facebook-f" },
    { domain: "twitter", faClass: "fa-twitter" },
    { domain: "instagram", faClass: "fa-instagram" },
    { domain: "discord", faClass: "fa-discord" },
    { domain: "stackoverflow", faClass: "fa-stack-overflow" },
    { domain: "medium", faClass: "fa-medium" },
    { domain: "codepan", faClass: "fa-codepan" },
    { domain: "telegram", faClass: "fa-telegram" },
    { domain: "t.me", faClass: "fa-telegram" },
    { domain: "pinterest", faClass: "fa-pinterest" },
    { domain: "microsoft", faClass: "fa-microsoft" },
    { domain: "messenger", faClass: "fa-facebook-messenger" },
    { domain: "atlassian", faClass: "fa-atlassian" },
    { domain: "trello", faClass: "fa-trello" },
    { domain: "reddit", faClass: "fa-reddit" },
    { domain: "patreon", faClass: "fa-patreon" },
    { domain: "kickstarter", faClass: "fa-kickstarter-k" },
    { domain: "jira", faClass: "fa-jira" }
];
function assignFaClass(link) {
    const domain = extractRootDomain(link);
    const service = knownServices.find(service => domain.includes(service.domain));
    if (service) {
        return "fa-brands " + service.faClass;
    } else {
        return "fa fa-globe";
    }
}