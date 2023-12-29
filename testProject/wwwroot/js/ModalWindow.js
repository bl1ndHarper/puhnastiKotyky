const openBtn = document.querySelector(".open-modal-btn");
const modal = document.querySelector(".modal-overlay");
const closeBtn = document.querySelector(".close-modal-btn");

document.querySelectorAll('.open-modal-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var modalId = this.getAttribute('data-modal-id');
        var modal = document.getElementById(modalId);
        modal.classList.remove('hidden');
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
	if (clickedOutside) {
		if (e.target.classList.contains("modal-overlay"))
			modal.classList.add("hidden");
	} else modal.classList.add("hidden");
}

openBtn.addEventListener("click", openModal);
modal.addEventListener("click", (e) => closeModal(e, true));
closeBtn.addEventListener("click", closeModal);
