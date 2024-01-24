const openBtn = document.querySelector(".modal__open-button");
const modal = document.querySelector(".modal__container");
const modalBody = document.querySelector(".modal__body");
const closeBtn = document.querySelector(".modal__close-button");
var navbar = document.querySelector(".navbar__container");

// request modal:
document.querySelectorAll('.user-account-day__user-requests .modal__open-button').forEach(function (btn) {
    btn.addEventListener('click', function () {
        navbar.style.zIndex = "0";

        var modalId = this.getAttribute('data-modal-id');
        var currentModal = document.getElementById(modalId);
        currentModal.classList.remove("hidden");
        currentModal.onclick = function (e) {
            if (e.target.classList.contains("modal__container")) {
                navbar.style.zIndex = "5";
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
        navbar.style.zIndex = "0";

        var accountProjectCardTechs = btn.parentNode.parentNode.querySelector(".user-account-day__technologies");
        var accountProjectCardStatus = btn.parentNode.children[2].querySelector("p");

        var modalId = this.getAttribute('data-modal-id');
        var currentModal = document.getElementById(modalId);

        var isUserOwner = currentModal.querySelector("#isUserOwner").getAttribute("data-isOwner");

        currentModal.onclick = function (e) {
            if (e.target.classList.contains("modal__container")) {
                expandOrCollapseDesc(descriptionParagraph, expandButton);
                navbar.style.zIndex = "5";
                closeModal(e, true);
            }
        }

        const descriptionParagraph = currentModal.querySelector('.modal__body-subject .modal__text-expandable');
        const expandButton = currentModal.querySelector('.modal__body-subject > #buttonExpandDescription');
        currentModal.classList.remove('hidden');

        expandButton.onclick = function () {
            expandOrCollapseDesc(descriptionParagraph, expandButton);
        };

        var showMembersButton = currentModal.querySelector('#showTeamMembers').querySelector('p');
        if (showMembersButton) {
            setShowMembersButton()
        }

        function setShowMembersButton() {
            var teamMembersDropdown = currentModal.querySelector('.modal__team-dropdown');
            var showMembersButton = currentModal.querySelector('#showTeamMembers').querySelector('p');
            var hideMembersButton = currentModal.querySelector('.arrow.up');
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

        // filling techsItems with initial values
        var techsItems = currentModal.querySelector('.modal__body .modal__body-subject .modal__technologies-container');

        for (var i = 0; i < techsItems.querySelectorAll("#tech").length; i++) {
            // deleting initial (chosen) values from dropdown
            techsItems.children[i].onclick = function () {
                if (isUserOwner == "true") {
                    removeProjectTech(this, this.querySelector("p").textContent);
                }
            }
        }

        function addProjectTechnology(technology) {
            const statusInput = currentModal.querySelector(".modal__project-status input");
            const projectId = statusInput.getAttribute('data-projectId');

            $.ajax({
                url: '/Account/Projects/AddProjectTechnology',
                type: 'POST',
                data: {
                    projectId: projectId.toString(),
                    technology: technology
                },
                success: function () {
                    const div = document.createElement("div");
                    const p = document.createElement("p");
                    p.textContent = technology;
                    div.appendChild(p);
                    div.id = "tech";
                    accountProjectCardTechs.appendChild(div);
                }
            });
        }

        function deleteProjectTechnology(technology) {
            const statusInput = currentModal.querySelector(".modal__project-status input");
            const projectId = statusInput.getAttribute('data-projectId');

            $.ajax({
                url: '/Account/Projects/RemoveProjectTechnology',
                type: 'POST',
                data: {
                    projectId: projectId.toString(),
                    technology: technology
                },
                success: function () {

                    const divToRemove = Array.from(accountProjectCardTechs.children).find(div => {
                        const p = div.querySelector('p');
                        return p && p.textContent === technology;
                    });

                    if (divToRemove) {
                        divToRemove.remove();
                    }
                }
            });
        }

        const addTechsButton = currentModal.querySelector('#modalAddProjectTechnology');
        if (isUserOwner == "true") {

            const techsDropdown = currentModal.querySelector('#modalProjectTechnologiesDropdown');
            const closeTechsDropdownButton = currentModal.querySelector('#modalProjectTechnologiesDropdown > .header > img');
            const techsDropdownSearchInput = currentModal.querySelector('#modalProjectTechnologiesDropdown > .header > input');
            addTechsButton.onclick = function openModalTechsDropdown() {
                addTechsButton.classList.add("hidden");
                techsDropdown.classList.remove("hidden");
                fillProjectTechsDropdown();
            }
            closeTechsDropdownButton.onclick = function closeModalTechsDropdown() {
                addTechsButton.classList.remove("hidden");
                techsDropdown.classList.add("hidden");
            }
            techsDropdownSearchInput.onkeyup = function () {
                dropdownFilterFunction(this, techsDropdown);
            }

            function fillProjectTechsDropdown() {
                var choosenTechsItems = currentModal.querySelectorAll('.modal__body .modal__body-subject .modal__technologies-container #tech');
                var container = techsDropdown.querySelector(".container");
                container.replaceChildren();

                // adding all technologies to the dropdown
                for (var i = 0; i < modelTechsArray.length; i++) {
                    const p = document.createElement("p");
                    p.textContent = modelTechsArray[i];
                    p.onclick = function () { chooseProjectTech(p.textContent); };
                    container.appendChild(p);
                }

                // deleting choosen technologies from the dropdown
                Array.from(choosenTechsItems).forEach(function (chosenTech) {
                    for (var j = 0; j < container.childElementCount; j++) {
                        if (chosenTech.innerText === container.children[j].innerText) {
                            container.children[j].remove();
                        }
                    }
                });
            }
        }

        function removeProjectTech(element, techName) {
            if (techsItems.classList.contains("hover-active")) {    // checking if user must be able to delete a tech
                if (techsItems.querySelectorAll("#tech").length == 1) { // user is trying to delete the last element left
                    element.querySelector("span").textContent = "You cannot delete the last element here!";
                    element.querySelector("span").style.visibility = "visible";
                    setTimeout(function () {
                        element.querySelector("span").textContent = "Click to delete";
                        element.querySelector("span").removeAttribute('style');
                    }, 5000)
                } else {
                    element.remove();
                    deleteProjectTechnology(techName);
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

            fillProjectTechsDropdown();

            addProjectTechnology(techName);
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

        const deleteMemberButtons = currentModal.querySelectorAll(".modal__team-dropdown-items i");
        deleteMemberButtons.forEach(function (button) {
            deleteParticipant(button);
        });

        function createTooltip() {
            const deleteMemberTooltip = document.createElement("div");
            const h3 = document.createElement("h3");
            const p = document.createElement("p");

            h3.appendChild(document.createTextNode("Click again to confirm deleting a user"));
            p.appendChild(document.createTextNode("Better think twice before doing it! This user will not be a member of your project's team anymore. They will be notified about your decision."));

            deleteMemberTooltip.classList.add("modal__info-tooltip", "hidden");
            deleteMemberTooltip.appendChild(h3);
            deleteMemberTooltip.appendChild(p);

            return deleteMemberTooltip;
        }

        function deleteParticipant(deleteButton, deleteMemberTooltip) {
            const currentMember = deleteButton.parentNode;
            if (deleteMemberTooltip == null) {
                const tooltip = createTooltip();
                deleteMemberTooltip = tooltip;
                currentMember.after(tooltip);
            }
            deleteButton.onclick = function () {
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
                            const showTeamMembersElement = document.getElementById("showTeamMembers");
                            const currentCount = parseInt(showTeamMembersElement.querySelector("p").textContent.match(/\d+/)[0]);
                            const newCount = currentCount - 1;
                            const teamDropdown = document.getElementById('teamMembersDropdown').parentElement;

                            deleteMemberTooltip.remove();
                            currentMember.remove();

                            if (newCount > 0) {
                                showTeamMembersElement.querySelector("p").textContent = `and ${newCount} more...`;
                            } else {
                                showTeamMembersElement.querySelector("p").remove();
                                showTeamMembersElement.querySelector("i").remove();
                                showTeamMembersElement.classList.add('hidden');
                                teamDropdown.classList.add('hidden');
                            }
                        }
                    });
                }
            };
        }

        var acceptRequestButtons = currentModal.querySelectorAll('.modal__request-accept-button');

        acceptRequestButtons.forEach(function (button) {
            button.onclick = function () {
                acceptRequest(button);
            }
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
                    const userId = clickedButton.getAttribute('data-userId');
                    const projectId = clickedButton.getAttribute('data-projectId');
                    const userPhoto = clickedButton.getAttribute('data-userPhoto');
                    const userName = requestItem.querySelector('h3 span').textContent.trim();

                    // remove the request
                    if (requestItem) {
                        requestItem.remove();
                        showNoRequests()
                    }

                    // create a new participant and append it to the dropdown
                    const teamDropdown = document.getElementById('teamMembersDropdown');

                    const newUserElement = document.createElement('div');
                    newUserElement.classList.add('modal__user-item');
                    newUserElement.setAttribute('data-userId', userId);
                    newUserElement.setAttribute('data-url', '/Account/Projects/DeleteUserFormProject');
                    newUserElement.setAttribute('data-projectId', projectId); 

                    const userPhotoElement = document.createElement('img'); 
                    userPhotoElement.src = userPhoto;
                    newUserElement.appendChild(userPhotoElement);

                    const userFullName = document.createElement('p');
                    userFullName.textContent = userName;
                    newUserElement.appendChild(userFullName);

                    const deleteIcon = document.createElement('i');
                    deleteIcon.classList.add('fa', 'fa-user-times');
                    deleteIcon.setAttribute('aria-hidden', 'true');
                    newUserElement.appendChild(deleteIcon);
                    teamDropdown.appendChild(newUserElement);

                    // create a tooltip after the element
                    const deleteMemberTooltip = createTooltip();
                    newUserElement.after(deleteMemberTooltip);

                    /*TODO:  correct the deleteParticipant function to work for the newly created delete icon*/
                    deleteParticipant(deleteIcon, deleteMemberTooltip);

                    // increase number of participants by 1
                    const showTeamMembersElement = document.getElementById("showTeamMembers");
                    if (showTeamMembersElement.querySelector('p')) {
                        const currentCount = parseInt(showTeamMembersElement.querySelector('p').textContent.match(/\d+/)[0]);
                        const newCount = currentCount + 1;
                        showTeamMembersElement.querySelector('p').textContent = `and ${newCount} more...`;
                    } else {
                        const p = document.createElement('p');
                        const i = document.createElement('i');
                        p.textContent = `and 1 more...`;
                        i.classList.add('arrow', 'up', 'hidden');
                        showTeamMembersElement.appendChild(p);
                        showTeamMembersElement.appendChild(i);
                        showTeamMembersElement.classList.remove('hidden');
                        setShowMembersButton();
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
                        showNoRequests()
                    }
                }
            });
        }

        function showNoRequests() {
            const requestsContainer = currentModal.firstElementChild.lastElementChild;
            console.log(requestsContainer);
            if (requestsContainer) {
                if (!requestsContainer.classList.contains('danger') && requestsContainer.lastElementChild.childElementCount == 0) {
                    const h3 = document.createElement('h3');
                    h3.textContent = "No requests have been sent yet";
                    requestsContainer.replaceChildren();
                    requestsContainer.appendChild(h3);
                }
            }
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
        }
    }
}

modal.addEventListener("click", (e) => closeModal(e, !modal.contains(e.target)));
openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
