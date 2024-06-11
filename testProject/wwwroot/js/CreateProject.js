const projectTechsArray = [];
function validateAndSubmit() {
    const projectNameInput = document.querySelector("#newAppName");
    const projectDescriptionInput = document.querySelector(".user-account-day__project-desc textarea");
    const projectRepositoryLink = document.querySelector(".user-account-day__repository input");
    const projectTechsContainer = document.getElementById("newProjectTechnologies");
    const projectLevelInput = document.querySelector(".user-account-day__new-project-level-dropdown input");
    const createProjectForm = document.getElementById("createNewProjectDetailed");

    if (projectNameInput.value.trim() == "") {
        showTooltip(".user-account-day__project-name-container");
    } else if (projectDescriptionInput.value.length < 12) {
        showTooltip(".user-account-day__project-desc");
    } else if (projectRepositoryLink.value !== "" && !isValidGithubUrl(projectRepositoryLink.value)) {
        showTooltip(".user-account-day__repository");
    } else if (projectTechsContainer.querySelector("#projectTechItem") == null) {
        showTooltip("#newProjectTechnologies");
    } else if (projectLevelInput.value == "") {
        showTooltip(".user-account-day__new-project-level-dropdown");
    } else {
        createProjectForm.submit();
    }
}

    function showTooltip(selector) {
        tooltip = document.querySelector(selector + " .user-account-day__tooltip");
        tooltip.style.border = "3px dashed tomato";
        tooltip.style.visibility = "visible";
        setTimeout(() => { tooltip.style.visibility = "hidden" }, 3000)
    }

    function isValidGithubUrl(url) {
        var githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+/;

        if (githubRegex.test(url)) {
            return true;
        } else {
            return false;
        }
    }


    function showDetailed() {
        var createNewProject = document.getElementById("createNewProjectLayout");
        var createNewProjectDetailed = document.getElementById("createNewProjectDetailed");
        var newAppName = document.getElementById("newAppName");
        var appNameDetailed = document.getElementById("newAppNameDetailed");
        var appNameInput = document.getElementById("newAppNameInput");

        if (newAppName.value != "") {
            appNameDetailed.innerHTML = newAppName.value;
            appNameInput.value = newAppName.value;
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

    function selectLevel(levelName) {
        var levelLabel = document.querySelector(".user-account-day__new-project-level-dropdown label");
        var levelInput = document.querySelector(".user-account-day__new-project-level-dropdown input");
        levelLabel.textContent = levelName;
        levelInput.value = levelName;
}

function projectRemoveChosen() {
    var container = document.querySelector("#newProjectDropdownTechsContainer");
    container.replaceChildren();
    for (var i = 0; i < modelTechsArray.length; i++) {
        const p = document.createElement("p");
        p.id = "projectTechsDropdownItem";
        p.textContent = modelTechsArray[i];
        p.onclick = function () { chooseProjectTech(p.textContent); };
        container.appendChild(p);
    }
    for (var i = 0; i < projectTechsArray.length; i++) {
        for (var j = 0; j < container.childElementCount; j++) {
            if (projectTechsArray[i] == container.children[j].textContent) {
                container.children[j].remove();
            }
        }
    }
}

function chooseProjectTech(techName) {
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
    divElement.id = "projectTechItem"

    divElement.onclick = function () {
        removeProjectTech(divElement, techName)
    }

    const container = document.getElementById("newProjectTechnologies");
    const addProjectTechnology = document.getElementById("addProjectTechnology");
    container.insertBefore(divElement, addProjectTechnology);

    addProjectTechToArray(techName);

    projectRemoveChosen()
}

function removeProjectTech(element, techName) {
    const projectTechnologies = document.getElementById("projectTechnologiesInput");
    element.remove();
    const index = projectTechsArray.indexOf(techName);
    projectTechsArray.splice(index, 1);
    projectTechnologies.value = projectTechsArray;

    projectRemoveChosen()
}

function addProjectTechToArray(techName) {
    const projectTechnologies = document.getElementById("projectTechnologiesInput");
    projectTechsArray.push(techName);
    projectTechnologies.value = projectTechsArray;
}

function checkMaxMin() {
    const num = document.querySelector(".customNumberInput");
    const numInput = document.querySelector(".customNumberInput input");
    const numInputValue = parseInt(numInput.value);
    const numInputMax = parseInt(numInput.max);
    const numInputMin = parseInt(numInput.min);
    const arrUp = document.querySelector(".customNumberInput .right");
    const arrDown = document.querySelector(".customNumberInput .left");

    if (numInputValue === numInputMax) {
        num.style.width = "6em";
        arrUp.style.display = "none";

        arrDown.style.display = "block";
    } else if (numInputValue === numInputMin) {
        num.style.width = "6em";
        arrDown.style.display = "none";

        arrUp.style.display = "block";
    } else {
        num.style.width = "7em";
        arrUp.style.display = "block";
        arrDown.style.display = "block";
    }
}

$(document).ready(function () {
    $("#tabsContainer").on("click", "#addProjectTechnology", function () {
        document.querySelector("#projectTechsDropdown").classList.remove("hidden");
        document.querySelector("#addProjectTechnology").classList.add("hidden");
        removeChosen();
    });

    $("#tabsContainer").on("click", "#closeProjectTechnologyDropdown", function () {
        document.querySelector("#projectTechsDropdown").classList.add("hidden");
        document.querySelector("#addProjectTechnology").classList.remove("hidden");
        removeChosen();
    });

    $("#tabsContainer").on("click", "#projectTechsDropdownItem", function () {
        chooseProjectTech($(this).text());
    });

    $(document).on('click', '.customNumberInput .right', function () {
        const num = $(this).closest('.customNumberInput');
        const numInput = num.find("input")[0];
        numInput.stepUp();
        checkMaxMin(num);
    });

    $(document).on('click', '.customNumberInput .left', function () {
        const num = $(this).closest('.customNumberInput');
        const numInput = num.find("input")[0];
        numInput.stepDown();
        checkMaxMin(num);
    });

    $(document).on('input', '.customNumberInput input', function () {
        const num = $(this).closest('.customNumberInput');
        checkMaxMin(num);
    });
});