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


var projectTechsArray = [];
var addProjectTechnology = document.getElementById("addProjectTechnology");
function projectRemoveChosen() {
    var container = document.getElementById("projectDropdownTechsContainer");
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

    divElement.onclick = function () {
        removeProjectTech(divElement, techName)
    }

    const container = document.getElementById("newProjectTechnologies");
    container.insertBefore(divElement, addProjectTechnology);

    addProjectTechToArray(techName);

    projectRemoveChosen()
}

const projectTechnologies = document.getElementById("projectTechnologiesInput");
function removeProjectTech(element, techName) {
    element.remove();
    var index = projectTechsArray.indexOf(techName);
    projectTechsArray.splice(index, 1);
    projectTechnologies.value = projectTechsArray;

    projectRemoveChosen()
}

function addProjectTechToArray(techName) {
    projectTechsArray.push(techName);
    projectTechnologies.value = projectTechsArray;
}