const openBtn = document.querySelector(".modal__open-button");
const modal = document.querySelector(".modal__container");
const modalBody = document.querySelector(".modal__body");
const closeBtn = document.querySelector(".modal__close-button");
var projectTechsArray = [];
var initialProjectTechsArray = [];
// request modal:
document.querySelectorAll('.user-account-day__user-requests .modal__open-button').forEach(function (btn) {
    btn.addEventListener('click', function () {

        var modalId = this.getAttribute('data-modal-id');
        var currentModal = document.getElementById(modalId);
        currentModal.classList.remove("hidden");
        currentModal.onclick = function (e) {
            if (e.target.classList.contains("modal__container")) {
                closeModal(e, true);
            }
        }
        const projectLink = currentModal.querySelector(".modal__header span");
        const id = projectLink.getAttribute("data-project-id");
        
        projectLink.onclick = function () {
            if (projectLink.id == "modalLink") {
                currentModal.click();
                document.querySelectorAll("#project-card").forEach(function (card) {
                    if (card.getAttribute("data-modal-id") == id) {
                        card.querySelector("#user-account-day__detailed-info-button").click();
                    }
                });
            }
        }
        
    });
});
// project modal:
document.querySelectorAll('.user-account-day__user-projects .modal__open-button').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var accountProjectCardTechs = btn.parentNode.parentNode.querySelector(".user-account-day__technologies");
        var accountProjectCardStatus = btn.parentNode.children[2].querySelector("p");

        var modalId = this.getAttribute('data-modal-id');
        var currentModal = document.getElementById(modalId);

        var isUserOwner = currentModal.querySelector("#isUserOwner").getAttribute("data-isOwner");

        projectTechsArray = [];
        const saveButton = currentModal.querySelector('.modal__body-subject > #saveProjectsTechButton');
        currentModal.onclick = function (e) {
            if (e.target.classList.contains("modal__container")) {
                resetUnsavedTechsChanges();
                expandOrCollapseDesc(descriptionParagraph, expandButton);
                closeModal(e, true);
            }
        }

        function fillProjectTechsArray(tech) {
            if (!projectTechsArray.includes(tech)) {
                projectTechsArray.push(tech);
            }
        }

        const descriptionParagraph = currentModal.querySelector('.modal__body-subject .modal__text-expandable');
        const expandButton = currentModal.querySelector('.modal__body-subject > #buttonExpandDescription');
        currentModal.classList.remove('hidden');

        expandButton.onclick = function () {
            expandOrCollapseDesc(descriptionParagraph, expandButton);
        };

        var teamMembersDropdown = currentModal.querySelector('.modal__team-dropdown');
        var showMembersButton = currentModal.querySelector('#showTeamMembers');
        var hideMembersButton = currentModal.querySelector('.arrow.up');
        if (showMembersButton != null) {
            showMembersButton.onclick = function () {
                showMembersButton.classList.add("hidden");
                teamMembersDropdown.classList.remove("hidden");
                hideMembersButton.classList.remove("hidden");
            }
            hideMembersButton.onclick = function () {
                showMembersButton.classList.remove("hidden");
                teamMembersDropdown.classList.add("hidden");
                hideMembersButton.classList.add("hidden");
            }
        }
        

        var clickCounter = 0;
        var leaveAndDeleteButton = currentModal.querySelector('#leaveAndDeleteButton');
        if (isUserOwner == "false") {
            leaveAndDeleteButton.onclick = function () {
                clickCounter++;

                if (clickCounter == 2) {
                    clickCounter = 0;

                    const form = currentModal.querySelector('#leaveAndDeleteForm');
                    form.submit();
                }
                else
                if (clickCounter == 1) {
                    const tooltip = currentModal.querySelector('#leaveAndDeleteTooltip');
                    tooltip.classList.remove("hidden");

                    setTimeout(function () {
                        tooltip.classList.add("hidden");
                        clickCounter = 0;
                    }, 20000)
                }
                else {
                    setTimeout(function () {
                        clickCounter = 0;
                    }, 20000)
                }
            }

        }

        // filling projectTechsArray with initial values
        var techsItems = currentModal.querySelector('.modal__body .modal__body-subject .modal__technologies-container');
        
        if (saveButton.classList.contains("hidden")) {
            for (var i = 0; i < techsItems.querySelectorAll("#tech").length; i++) {
                fillProjectTechsArray(techsItems.children[i].querySelector("p").textContent);
                    initialProjectTechsArray.push(techsItems.children[i].querySelector("p").textContent);
                // deleting initial (chosen) values from dropdown
                techsItems.children[i].onclick = function () {
                    if (isUserOwner == "true") {
                        removeProjectTech(this, this.querySelector("p").textContent);
                    }
                }
            }
        }

        saveButton.onclick = function () {
            saveTechnologies(initialProjectTechsArray, projectTechsArray);
        }
        function saveTechnologies(initialProjectTechsArray, projectTechsArray) {
            const url = saveButton.getAttribute('data-url');
            const statusInput = currentModal.querySelector(".modal__project-status input");
            const projectId = statusInput.getAttribute('data-projectId');

            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    projectId: projectId.toString(),
                    updatedProjectTechnologies: projectTechsArray.toString()
                },
                success: function () {
                    initialProjectTechsArray = projectTechsArray.slice();
                    projectTechsArray = [];

                    while (techsItems.children.length > 2) {
                        techsItems.children[0].remove();
                    }
                    accountProjectCardTechs.replaceChildren();
                    initialProjectTechsArray.forEach(function (initialTech) {
                        chooseProjectTech(initialTech);
                        const div = document.createElement("div");
                        const p = document.createElement("p");
                        p.textContent = initialTech;
                        div.appendChild(p);
                        div.id = "tech";
                        accountProjectCardTechs.appendChild(div);
                    });

                    saveButton.classList.add("hidden");
                }
            });
        }

        const addTechsButton = currentModal.querySelector('#modalAddProjectTechnology');
        if (isUserOwner == "true") {

            const techsDropdown = currentModal.querySelector('#modalProjectTechnologiesDropdown');
            const closeTechsDropdownButton = currentModal.querySelector('#modalProjectTechnologiesDropdown > .header > img');
            const techsDropdownSearchInput = currentModal.querySelector('#modalProjectTechnologiesDropdown > .header > input');
            addTechsButton.onclick = function openModalTechsDropdown () {
                addTechsButton.classList.add("hidden");
                techsDropdown.classList.remove("hidden");
                fillProjectTechsDropdown();
            }
            closeTechsDropdownButton.onclick = function closeModalTechsDropdown () {
                addTechsButton.classList.remove("hidden");
                techsDropdown.classList.add("hidden");
            }
            techsDropdownSearchInput.onkeyup = function () {
                dropdownFilterFunction(this, techsDropdown);
            }

            function fillProjectTechsDropdown() {
                var container = techsDropdown.querySelector(".container");
                container.replaceChildren();
                for (var i = 0; i < modelTechsArray.length; i++) {
                    const p = document.createElement("p");
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
        }

        function removeProjectTech(element, techName) {
            if (techsItems.classList.contains("hover-active")) {    // checking if user must be able to delete a tech
                var index = projectTechsArray.indexOf(techName);
                if (projectTechsArray.length == 1) { // user is trying to delete the last element left
                    element.querySelector("span").textContent = "You cannot delete the last element here!";
                    element.querySelector("span").style.visibility = "visible";
                    setTimeout(function () {
                        element.querySelector("span").textContent = "Click to delete";
                        element.querySelector("span").removeAttribute('style');
                    }, 5000)
                } else {
                    element.remove();
                    projectTechsArray.splice(index, 1);
                    if (JSON.stringify(projectTechsArray) != JSON.stringify(initialProjectTechsArray)) {
                        saveButton.classList.remove("hidden");
                    } else {
                        saveButton.classList.add("hidden");
                    }
                }
        
                fillProjectTechsDropdown()
            }
        }

        function chooseProjectTech(techName) {
            const divElement = document.createElement("div");
            const tooltip = document.createElement("span");
            const removeOverlay = document.createElement("div");
            const paragraph = document.createElement("p");

            divElement.id = "tech";
            tooltip.classList.add("modal__tooltip");
            tooltip.textContent = "Click to delete";
            removeOverlay.classList.add("removeTechOverlay");
        
            paragraph.append(techName);
            divElement.append(tooltip);
            divElement.append(removeOverlay);
            divElement.append(paragraph);
        
            if (isUserOwner == "true") {
                divElement.onclick = function () {
                    removeProjectTech(divElement, techName)
                }
            }
        
            techsItems.insertBefore(divElement, addTechsButton);
        
            fillProjectTechsArray(techName);
        
            fillProjectTechsDropdown()

            if (JSON.stringify(projectTechsArray) != JSON.stringify(initialProjectTechsArray)) {
                saveButton.classList.remove("hidden");
            } else {
                saveButton.classList.add("hidden");
            }
        }

        if (isUserOwner == "true") {
            const statusOptions = currentModal.querySelector(".modal__project-status-select-items").children;
            Array.from(statusOptions).forEach(function (status) {
                status.onclick = function () {
                    selectStatus(this.textContent);
                }
            });
            function selectStatus(statusName) {
                const statusValue = currentModal.querySelector(".modal__project-status span");
                const statusInput = currentModal.querySelector(".modal__project-status input");
                statusValue.textContent = statusName;
                statusInput.value = statusName;
                const url = statusInput.getAttribute('data-url');
                const projectId = statusInput.getAttribute('data-projectId');

                $.ajax({
                    url: url,
                    type: 'POST',
                    data: {
                        projectId: projectId,
                        projectStatus: statusName
                    },
                    success: function (data) {
                        if (data.success) {
                            console.log('ProjectsController/EditProjectStatus executed successfully. Message: ' + data.message);
                            accountProjectCardStatus.textContent = statusName;
                        } else {
                            console.error('An error occured while executing ProjectsController/EditProjectStatus: ', data.message);
                        }
                    },
                    error: function (error) {
                        console.error('An error occured while ajax-calling ProjectsController/EditProjectStatus: ', error);
                    }
                });
            }
        }

        function resetUnsavedTechsChanges() {
            if (!saveButton.classList.contains("hidden")) {
                while (techsItems.children.length > 2) {
                    techsItems.children[0].remove();
                }
                initialProjectTechsArray.forEach(function (initialTech) {
                    chooseProjectTech(initialTech);
                });
                saveButton.classList.add("hidden");
            }
                projectTechsArray = [];
                initialProjectTechsArray = [];
        }

        const deleteMemberButtons = currentModal.querySelectorAll(".modal__team-dropdown-items i");
        deleteMemberButtons.forEach(function (button) {
            const currentMember = button.parentNode;
            const deleteMemberTooltip = document.createElement("div");
            const h3 = document.createElement("h3");
            const p = document.createElement("p");
            h3.appendChild(document.createTextNode("Click again to confirm deleting a user"));
            p.appendChild(document.createTextNode("Better think twice before doing it! This user will not be a member of your project's team anymore. They will be notified about your decision."));
            deleteMemberTooltip.classList.add("modal__info-tooltip", "hidden");
            deleteMemberTooltip.appendChild(h3);
            deleteMemberTooltip.appendChild(p);
            currentMember.after(deleteMemberTooltip);
            button.onclick = function () {
                if (deleteMemberTooltip.classList.contains("hidden")) {
                    deleteMemberTooltip.classList.remove("hidden");
                    setTimeout(function () {
                        deleteMemberTooltip.classList.add("hidden");
                    }, 10000)
                } else {
                    const userId = currentMember.getAttribute("data-userId");
                    const url = currentMember.getAttribute('data-url');
                    const projectId = currentMember.getAttribute('data-projectId');
                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: {
                            deleteUserIdInput: userId,
                            deleteUserProjectInput: projectId
                        },
                        success: function (data) {
                            deleteMemberTooltip.remove();
                            currentMember.remove();
                        }
                    });
                }
            }
        });


        var acceptRequestButtons = currentModal.querySelectorAll('.modal__request-accept-button');

        acceptRequestButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                acceptRequest(button);
            });
        });

        function acceptRequest(clickedButton) {
            const requestId = clickedButton.getAttribute('data-requestId');

            $.ajax({
                url: '/Account/Requests/AcceptRequest',
                type: 'POST',
                data: {
                    requestId: requestId.toString()
                },
                success: function () {
                    const requestItem = clickedButton.closest('.modal__request-item');

                    if (requestItem) {
                        requestItem.remove();
                    }
                }
            });
        }

        var hideRequestButtons = currentModal.querySelectorAll('.modal__request-hide-button');

        hideRequestButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                hideRequest(button);
            });
        });

        function hideRequest(clickedButton) {
            const requestId = clickedButton.getAttribute('data-requestId');

            $.ajax({
                url: '/Account/Requests/HideRequest',
                type: 'POST',
                data: {
                    requestId: requestId.toString()
                },
                success: function () {
                    const requestItem = clickedButton.closest('.modal__request-item');

                    if (requestItem) {
                        requestItem.remove();
                    }
                }
            });
        }

    });
});

function expandOrCollapseDesc(descriptionParagraph, expandButton) {
    descriptionParagraph.classList.toggle('expanded');
    expandButton.textContent = descriptionParagraph.classList.contains('expanded') ? 'Less' : 'More';
}

document.querySelectorAll('.modal__close-button').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var modal = this.closest('.modal__container');
        modal.classList.add('hidden');
        location.reload();
    });
});

function openModal() {
    modal.classList.remove("hidden");
}

function closeModal(e, clickedOutside) {
    var modal = e.target.closest('.modal__container');
    if (modal) {
        if (clickedOutside || e.target.classList.contains("modal__close-button")) {
            modal.classList.add("hidden");
            location.reload();
        }
    }
}

modal.addEventListener("click", (e) => closeModal(e, !modal.contains(e.target)));
openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
