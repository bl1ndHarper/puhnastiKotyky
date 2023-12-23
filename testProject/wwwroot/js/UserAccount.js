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
    descTextArea.readOnly = false;
    descTextArea.style.outline = "outset 1px"
    userImageContainer.classList.add("hover-active");
    userAccountTechnologies.classList.add("hover-active");
    addUserTechnology.classList.remove("hidden");

    userImageContainer.addEventListener("click", imageButtonClickHandler);

    imageInput.onchange = function () {
        if (imageInput.files[0] != null && imageInput.files[0] != "") {
            userImage.src = URL.createObjectURL(imageInput.files[0]);
        }
    }

    buttonCancel.onclick = function () {
        imageInput.onchange = null;
        stopEditingProfile();
    };
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

    var form = document.querySelector('form');
    form.reset();
    location.reload();

    userImageContainer.removeEventListener("click", imageButtonClickHandler);
}
function imageButtonClickHandler() {
}

function cancelUserProfileChanges() {
    stopEditingProfile();
    location.reload();
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

var userTechsDropdown = document.getElementById("userTechsDropdown");
function openUserTechsDropdown() {
    userTechsDropdown.classList.remove("hidden");
    addUserTechnology.classList.add("hidden");
};
function closeUserTechsDropdown() {
    userTechsDropdown.classList.add("hidden");
    addUserTechnology.classList.remove("hidden");
}

function dropdownFilterFunction() {
    var input, filter, p, i;
    input = document.getElementById("userTechSearchInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("userTechsDropdown");
    p = div.getElementsByTagName("p");
    for (i = 0; i < p.length; i++) {
        txtValue = p[i].textContent || p[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            p[i].style.display = "";
        } else {
            p[i].style.display = "none";
        }
    }
}

/* CREATE PROJECT */

function showDetailed() {
    var createNewProject = document.getElementById("createNewProjectLayout");
    var createNewProjectDetailed = document.getElementById("createNewProjectDetailed");
    var newAppName = document.getElementById("newAppName");
    var appNameDetailed = document.getElementById("newAppNameDetailed");

    if (newAppName.value != "") {
        appNameDetailed.innerHTML = newAppName.value;
        createNewProject.classList.add("hidden");
        createNewProjectDetailed.classList.remove("hidden");
        newAppName.value = "";
        newAppName.style.height = "fit-content";
    }
}

function hideDetailed() {
    var createNewProject = document.getElementById("createNewProjectLayout");
    var createNewProjectDetailed = document.getElementById("createNewProjectDetailed");

    createNewProject.classList.remove("hidden");
    createNewProjectDetailed.classList.add("hidden");
}
