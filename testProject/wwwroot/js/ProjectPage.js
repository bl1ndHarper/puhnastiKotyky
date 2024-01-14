window.onload = function () {
    const body = document.querySelector(".project__body");
    const header = document.querySelector(".project__header");
    var headerHeight = header.clientHeight;
    const title = header.querySelector("h1");
    const projectInfo = header.querySelector("div");
    
    body.onscroll = function () {
        if (body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
            //projectInfo.style.opacity = 0;
            projectInfo.classList.add("hidden");
            title.style.marginTop = "50px";
        } else {
            //projectInfo.style.opacity = 1;
            projectInfo.classList.remove("hidden");
            title.style.marginTop = "0";
        }
    }
}

function createNewRequest() {
    const toast = document.querySelector(".project__toast");
    $.ajax({
        url: '/Projects/Public/CreateNewRequest',
        type: 'POST',
        success: function (data) {
            if (data.success == true) {
                toast.querySelector("p").textContent = data.message;
                toast.classList.remove("toast-error");
            } else {
                toast.querySelector("p").textContent = data.message;
                toast.classList.add("toast-error");
            }
            toast.classList.remove("hidden");
            setTimeout(function () {
                toast.classList.add("hidden");
            }, 7000)
        }
    });
}