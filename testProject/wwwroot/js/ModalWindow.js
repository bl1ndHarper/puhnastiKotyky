const openBtn = document.querySelector(".open-modal-btn");
const modal = document.querySelector(".modal-overlay");
const closeBtn = document.querySelector(".close-modal-btn");

document.querySelectorAll('.open-modal-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var modalId = this.getAttribute('data-modal-id');
        var currentModal = document.getElementById(modalId);
        currentModal.classList.remove('hidden');
        currentModal.addEventListener("click", function (e) {
            closeModal(e, true);
        });
    });
});

document.querySelectorAll('.close-modal-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var modal = this.closest('.modal-overlay');
        modal.classList.add('hidden');
    });
});

function openModal() {
	modal.classList.remove("hidden");
}

function closeModal(e, clickedOutside) {
    var modal = e.target.closest('.modal-overlay');
    if (modal) {
        if (clickedOutside || e.target.classList.contains("close-modal-btn")) {
            modal.classList.add("hidden");
        }
    }
}

modal.addEventListener("click", (e) => closeModal(e, !modal.contains(e.target)));
openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);