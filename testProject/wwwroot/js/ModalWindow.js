const openBtn = document.querySelector(".modal__open-button");
const modal = document.querySelector(".modal__container");
const modalBody = document.querySelector(".modal__body");
const closeBtn = document.querySelector(".modal__close-button");

document.querySelectorAll('.modal__open-button').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var modalId = this.getAttribute('data-modal-id');
        var currentModal = document.getElementById(modalId);

        const descriptionParagraph = document.querySelector('#' + modalId + ' .modal__body .modal__body-subject .modal__text-expandable');
        const expandButton = document.querySelector('#' + modalId + ' .modal__body .modal__body-subject > #buttonExpandDescription');
        currentModal.classList.remove('hidden');
        currentModal.addEventListener("click", function (e) {
            if (e.target.classList.contains("modal__container")) {
                expandOrCollapseDesc(descriptionParagraph, expandButton);
                closeModal(e, true);
            }
        });

        expandButton.onclick = function () {
            expandOrCollapseDesc(descriptionParagraph, expandButton);
        };

        var teamMembersDropdown = currentModal.querySelector('.modal__team-dropdown');
        var showMembersButton = currentModal.querySelector('#showTeamMembers');
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

        var clickCounter = 0;
        var leaveAndDeleteButton = currentModal.querySelector('#leaveAndDeleteButton');
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
