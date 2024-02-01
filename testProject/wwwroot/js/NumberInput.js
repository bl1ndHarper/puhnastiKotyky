const customNum = document.querySelectorAll('.customNumberInput');

customNum.forEach(num => {
    const numInput = num.querySelector("input");
    const arrUp = num.querySelector(".right");
    const arrDown = num.querySelector(".left");

    arrUp.addEventListener('click', () => {
        numInput.stepUp();
        checkMaxMin();
    });

    arrDown.addEventListener('click', () => {
        numInput.stepDown();
        checkMaxMin();
    });

    numInput.addEventListener('input', checkMaxMin);

    function checkMaxMin() {
        const numInputValue = parseInt(numInput.value);
        const numInputMax = parseInt(numInput.max);
        const numInputMin = parseInt(numInput.min);

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
});