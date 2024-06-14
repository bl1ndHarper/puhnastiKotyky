const openBtn = document.querySelector(".modal__open-button");
const modal = document.querySelector(".modal__container");
const modalBody = document.querySelector(".modal__body");
const closeBtn = document.querySelector(".modal__close-button");
const navbar = document.querySelector(".navbar__container");

$(document).ready(function () {
    const initialTab = $('#ownProjectsTab');
    initialTab.trigger('click');
});

// request modal:
$("#tabsContainer").on("click", ".user-account-day__user-requests .modal__open-button", function () {
    navbar.style.zIndex = "0";

    const modalId = this.getAttribute('data-modal-id');
    const currentModal = document.getElementById(modalId);
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

// project modal:
$("#tabsContainer").on("click", ".user-account-day__projects-container .modal__open-button", function () {
    navbar.style.zIndex = "0";

    const accountProjectCardTechs = this.parentNode.parentNode.querySelector(".user-account-day__technologies");
    const accountProjectCardStatus = this.parentNode.children[2].querySelector("p");

    const modalId = this.getAttribute('data-modal-id');
    const currentModal = document.getElementById(modalId);

    const isUserOwner = currentModal.querySelector("#isUserOwner").getAttribute("data-isOwner");

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

    const showMembersButton = currentModal.querySelector('#showTeamMembers').querySelector('p');
    if (showMembersButton) {
        setShowMembersButton()
    }

    function setShowMembersButton() {
        const teamMembersDropdown = currentModal.querySelector('.modal__team-dropdown');
        const showMembersButton = currentModal.querySelector('#showTeamMembers').querySelector('p');
        const hideMembersButton = currentModal.querySelector('.arrow.up');
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

    let clickCounter = 0;
    const leaveAndDeleteButton = currentModal.querySelector('#leaveAndDeleteButton');
    if (isUserOwner === "false") {
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
    const techsItems = currentModal.querySelector('.modal__body .modal__body-subject .modal__technologies-container');

    for (let i = 0; i < techsItems.querySelectorAll("#tech").length; i++) {
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
                if (accountProjectCardTechs.childElementCount < 3) {
                    const div = document.createElement("div");
                    const p = document.createElement("p");
                    p.textContent = technology;
                    div.appendChild(p);
                    div.id = "tech";
                    accountProjectCardTechs.appendChild(div);
                } else {
                    const andNMore = accountProjectCardTechs.querySelector('.user-account-day__technologies_and_more');
                    if (andNMore) {
                        const currentCount = parseInt(andNMore.querySelector('p').textContent.match(/\d+/)[0]);
                        const newCount = currentCount + 1;
                        andNMore.querySelector('p').textContent = `and ${newCount} more`;
                    } else {
                        const p = document.createElement('p');
                        p.textContent = `and 1 more`;
                        const div = document.createElement('div');
                        div.classList.add('user-account-day__technologies_and_more');
                        div.appendChild(p);
                        accountProjectCardTechs.appendChild(div);   
                    }
                }             
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
                } else {
                    const andNMore = accountProjectCardTechs.querySelector('.user-account-day__technologies_and_more');
                    const currentCount = parseInt(andNMore.querySelector('p').textContent.match(/\d+/)[0]);
                    const newCount = currentCount - 1;
                    if (newCount > 0) {
                        andNMore.querySelector('p').textContent = `and ${newCount} more`;
                    } else {
                        andNMore.remove();
                    }     
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
            const choosenTechsItems = currentModal.querySelectorAll('.modal__body .modal__body-subject .modal__technologies-container #tech');
            const container = techsDropdown.querySelector(".container");
            container.replaceChildren();

            // adding all technologies to the dropdown
            for (let i = 0; i < modelTechsArray.length; i++) {
                const p = document.createElement("p");
                p.textContent = modelTechsArray[i];
                p.onclick = function () { chooseProjectTech(p.textContent); };
                container.appendChild(p);
            }

            // deleting choosen technologies from the dropdown
            Array.from(choosenTechsItems).forEach(function (chosenTech) {
                for (let j = 0; j < container.childElementCount; j++) {
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

    const repositoryContainer = currentModal.querySelector(".modal__repository-container");
    const repositoryLinkInput = currentModal.querySelector(".modal__repository-link-input");
    const addRepositoryButton = currentModal.querySelector(".modal__repository-add-button");
    if (repositoryLinkInput) {
        let initialLink = repositoryLinkInput.value; // is used to undo changes when clicking the Cancel button
    }

    if (addRepositoryButton) {
        addRepositoryButton.addEventListener('click', addRepositoryLink);
    }

    function addRepositoryLink() {
        if (isValidGithubUrl(repositoryLinkInput.value)) {
            changeRepositoryLink(repositoryLinkInput.value);
            const repositoryLink = repositoryLinkInput.value;
            initialLink = repositoryLink;

            const addRepositoryButton = currentModal.querySelector(".modal__repository-add-button");
            addRepositoryButton.remove();
            repositoryLinkInput.readOnly = true;

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.classList.add("button", "modal__repository-edit-button");
            repositoryContainer.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("button", "modal__repository-delete-button");
            repositoryContainer.appendChild(deleteButton);

            // create the "View on GitHub" button
            const repositoryDiv = document.createElement("div");
            repositoryDiv.classList.add("modal__repository");
            const divElement = document.createElement("div");
            const icon = document.createElement("i");
            icon.classList.add("fa-brands", "fa-github");
            const link = document.createElement("a");
            link.href = repositoryLinkInput.value;
            link.target = "_blank";
            link.textContent = "View on GitHub";
            repositoryDiv.appendChild(divElement);
            divElement.appendChild(icon);
            icon.after(link);
            const projectStatus = currentModal.querySelector(".modal__project-status");
            projectStatus.after(repositoryDiv);

            editButton.addEventListener('click', editRepositoryLink);
            deleteButton.addEventListener('click', deleteRepositoryLink);
        } else {
            alert("An error occurred validating the URL. Please, make sure your URL is valid and try again.");
        }
    }

    const editRepositoryButton = currentModal.querySelector(".modal__repository-edit-button");
    if (editRepositoryButton) {
        editRepositoryButton.addEventListener('click', editRepositoryLink);
    }

    function editRepositoryLink() {
        const editRepositoryButton = currentModal.querySelector(".modal__repository-edit-button");
        const deleteRepositoryButton = currentModal.querySelector(".modal__repository-delete-button");
        editRepositoryButton.remove();
        deleteRepositoryButton.remove();

        repositoryLinkInput.readOnly = false;

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.classList.add("button", "modal__repository-save-button");
        repositoryContainer.appendChild(saveButton);

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.classList.add("button", "modal__repository-cancel-button");
        repositoryContainer.appendChild(cancelButton);
        saveButton.addEventListener('click', saveRepositoryLink);
        cancelButton.addEventListener('click', cancelLinkChanges);
        repositoryLinkInput.focus();
    }

    const deleteRepositoryButton = currentModal.querySelector(".modal__repository-delete-button");
    if (deleteRepositoryButton) {
        deleteRepositoryButton.addEventListener('click', deleteRepositoryLink);
    }

    function deleteRepositoryLink() {
        changeRepositoryLink(null);
        repositoryLinkInput.value = "";
        repositoryLinkInput.placeholder = "Insert a link to the project's repository here";
        repositoryLinkInput.readOnly = false;
        const editRepositoryButton = currentModal.querySelector(".modal__repository-edit-button");
        const deleteRepositoryButton = currentModal.querySelector(".modal__repository-delete-button");
        editRepositoryButton.remove();
        deleteRepositoryButton.remove();

        const repositoryDiv = currentModal.querySelector(".modal__repository");
        repositoryDiv.remove();

        const addButton = document.createElement("button");
        addButton.textContent = "Add";
        addButton.classList.add("button", "modal__repository-add-button");
        repositoryContainer.appendChild(addButton);
        addButton.addEventListener('click', addRepositoryLink);
    }

    function cancelLinkChanges() {
        const saveRepositoryButton = currentModal.querySelector(".modal__repository-save-button");
        const cancelRepositoryButton = currentModal.querySelector(".modal__repository-cancel-button");
        saveRepositoryButton.remove();
        cancelRepositoryButton.remove();

        repositoryLinkInput.value = initialLink;
        repositoryLinkInput.readOnly = true;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("button", "modal__repository-edit-button");
        repositoryContainer.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("button", "modal__repository-delete-button");
        repositoryContainer.appendChild(deleteButton);

        editButton.addEventListener('click', editRepositoryLink);
        deleteButton.addEventListener('click', deleteRepositoryLink);
    }

    const saveRepositoryButton = currentModal.querySelector(".modal__repository-save-button");
    if (saveRepositoryButton) {
        saveRepositoryButton.addEventListener('click', saveRepositoryLink);
    }

    function saveRepositoryLink() {
        if (isValidGithubUrl(repositoryLinkInput.value)) {
            changeRepositoryLink(repositoryLinkInput.value);
            const saveRepositoryButton = currentModal.querySelector(".modal__repository-save-button");
            const cancelRepositoryButton = currentModal.querySelector(".modal__repository-cancel-button");
            saveRepositoryButton.remove();
            cancelRepositoryButton.remove();

            const repositoryLink = currentModal.querySelector(".modal__repository a");
            repositoryLink.href = repositoryLinkInput.value;
            repositoryLinkInput.readOnly = true;
            initialLink = repositoryLinkInput.value;

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.classList.add("button", "modal__repository-edit-button");
            repositoryContainer.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("button", "modal__repository-delete-button");
            repositoryContainer.appendChild(deleteButton);

            editButton.addEventListener('click', editRepositoryLink);
            deleteButton.addEventListener('click', deleteRepositoryLink);
        } else {
            alert("An error occurred validating the URL. Please, make sure your URL is valid and try again.");
        }
    }

    function isValidGithubUrl(url) {
        const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_]+/;

        if (githubRegex.test(url)) {
            return true;
        } else {
            return false;
        }
    }

    function changeRepositoryLink(link) {
        const projectId = repositoryLinkInput.getAttribute('data-projectId');

        $.ajax({
            url: '/Account/Projects/EditRepositoryLink',
            type: 'POST',
            data: {
                projectId: projectId,
                link: link
            },
            success: function (data) {
                if (data.success) {
                    console.log('Projects/EditRepositoryLink executed successfully. Message: ' + data.message);
                } else {
                    console.error('An error occured while executing Projects/EditRepositoryLink: ', data.message);
                }
            },
            error: function (error) {
                console.error('An error occured while ajax-calling Projects/EditRepositoryLink: ', error);
            }
        });
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
                        const showTeamMembersElement = currentModal.querySelector("#showTeamMembers");
                        const currentCount = parseInt(showTeamMembersElement.querySelector("p").textContent.match(/\d+/)[0]);
                        const newCount = currentCount - 1;
                        const teamDropdown = currentModal.querySelector("#teamMembersDropdown").parentElement;

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

    const acceptRequestButtons = currentModal.querySelectorAll('.modal__request-accept-button');

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
                const teamDropdown = currentModal.querySelector('#teamMembersDropdown');

                const newUserElement = document.createElement('div');
                newUserElement.classList.add('modal__user-item');
                newUserElement.setAttribute('data-userId', userId);
                newUserElement.setAttribute('data-url', '/Account/Projects/DeleteUserFormProject');
                newUserElement.setAttribute('data-projectId', projectId);

                const userProfileLink = document.createElement('a');
                userProfileLink.href = `/Profile?id=` + userId;

                const userPhotoElement = document.createElement('img');
                userPhotoElement.src = userPhoto;
                userProfileLink.appendChild(userPhotoElement);

                const userFullName = document.createElement('p');
                userFullName.textContent = userName;
                userProfileLink.appendChild(userFullName);
                newUserElement.appendChild(userProfileLink);

                const deleteIcon = document.createElement('i');
                deleteIcon.classList.add('fa', 'fa-user-times');
                deleteIcon.setAttribute('aria-hidden', 'true');
                newUserElement.appendChild(deleteIcon);
                teamDropdown.appendChild(newUserElement);

                // create a tooltip after the element
                const deleteMemberTooltip = createTooltip();
                newUserElement.after(deleteMemberTooltip);

                deleteParticipant(deleteIcon, deleteMemberTooltip);

                // increase number of participants by 1
                const showTeamMembersElement = currentModal.querySelector("#showTeamMembers");
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
    const hideRequestButtons = currentModal.querySelectorAll('.modal__request-hide-button');

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

    function expandOrCollapseDesc(descriptionParagraph, expandButton) {
        descriptionParagraph.classList.toggle('expanded');
        expandButton.textContent = descriptionParagraph.classList.contains('expanded') ? 'Less' : 'More';
    }
});        

$("#tabsContainer").on("click", ".modal__container", function (e) {
    closeModal(e, !$(this).has(e.target).length);
});

$("#tabsContainer").on("click", ".modal__close-button", function (e) {
    const modal = this.closest('.modal__container');
    const navbar = document.querySelector(".navbar__container");
    modal.classList.add('hidden');
    navbar.style.zIndex = "5";
    closeModal(e, false);
});

$("#tabsContainer").on("click", ".modal__open-button", function () {
    const modalId = $(this).data('modal-id');
    const modal = $('#' + modalId);
    const navbar = $(".navbar__container");
    if (modal.length) {
        modal.removeClass("hidden");
        navbar.css("z-index", "0");
    }
});

function closeModal(e, clickedOutside) {
    const modal = e.target.closest('.modal__container');
    if (modal) {
        if (clickedOutside || e.target.classList.contains("modal__close-button")) {
            modal.classList.add("hidden");
            navbar.style.zIndex = "5";
        }
    }
}