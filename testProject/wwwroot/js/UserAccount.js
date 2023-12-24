var buttonEdit = document.getElementById("buttonEditProfile");
var buttonAccept = document.getElementById("buttonSaveProfileChanges");
var buttonCancel = document.getElementById("buttonCancelProfileChanges");
var descTextArea = document.getElementById("selfDescriptionText");
var userImageContainer = document.getElementById("userImageContainer");
var userImage = document.getElementById("userImage");
var imageInput = document.getElementById("imageInput");
var deleteUserImageButton = document.getElementById("deleteUserImageButton");
var changeUserImageText = document.getElementById("changeUserImageText");
var originalText;

function auto_height(elem) {
    elem.style.height = '1px';
    elem.style.height = `${elem.scrollHeight}px`;
}

window.onload = function () {
    auto_height(descTextArea);
}

function editProfile() {
    originalText = descTextArea.value;
    buttonEdit.style.display = "none";
    buttonAccept.style.display = "block";
    buttonCancel.style.display = "block";
    descTextArea.readOnly = false;
    descTextArea.style.outline = "outset 1px"
    userImageContainer.classList.add("hover-active");

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
    buttonAccept.onclick = function () {
        var form = document.querySelector('form');
        form.submit();
    };
}

function stopEditingProfile() {
    buttonEdit.style.display = "block";
    buttonAccept.style.display = "none";
    buttonCancel.style.display = "none";
    descTextArea.readOnly = true;
    descTextArea.style.outline = "none"
    userImageContainer.classList.remove("hover-active");

    var form = document.querySelector('form');
    form.reset();
    location.reload();

    userImageContainer.removeEventListener("click", imageButtonClickHandler);
}

function imageButtonClickHandler() {
}

function showDetailed() {
    var createNewProject = document.getElementById("createNewProjectLayout");
    var createNewProjectDetailed = document.getElementById("createNewProjectDetailed");
    var newAppName = document.getElementById("newAppName");

    if (newAppName.value != "") {
        createNewProject.style.display = "none";
        createNewProjectDetailed.style.display = "flex";
        newAppName.value = "";
        newAppName.style.height = "fit-content";
    }
}

function hideDetailed() {
    var createNewProject = document.getElementById("createNewProjectLayout");
    var createNewProjectDetailed = document.getElementById("createNewProjectDetailed");

    createNewProject.style.display = "flex";
    createNewProjectDetailed.style.display = "none";
}

imageInput.onchange = function () {
    if (imageInput.files[0] != null && imageInput.files[0] != "") {
        userImage.src = URL.createObjectURL(imageInput.files[0]);
        imageInput.files[0] = null
    }
}

function cancelUserProfileChanges() {
    descTextArea.value = originalText;
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
    }
    else {
        setTimeout(function () {
            changeUserImageText.innerHTML = "Click to change";
            clickCounter = 0;
        }, 3000)
    }
}