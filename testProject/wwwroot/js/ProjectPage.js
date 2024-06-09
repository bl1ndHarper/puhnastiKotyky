const repoLink = document.querySelector(".project__repository-link:not(.mobile)");
const repoLinkMobile = document.querySelector(".mobile");

window.onload = function () {
    const body = document.querySelector(".project__body");
    const header = document.querySelector(".project__header");
    const title = header.querySelector("h1");
    const projectInfo = header.querySelector("div:not(.project__repository-link)");

    setTimeout(() => {
        if (repoLinkMobile != null) repoLinkMobile.querySelector("a").style.display = "none";
    }, 3000);

    handleMediaResult();
    
    body.onscroll = function () {
        if (body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
            projectInfo.classList.add("hidden");
            title.style.marginTop = "60px";
            repoLinkMobile.classList.add("fixed-bottom");
        } else {
            projectInfo.classList.remove("hidden");
            title.style.marginTop = "0";
            repoLinkMobile.classList.remove("fixed-bottom");
        }
    }

    let resizeObserver = new ResizeObserver(() => {
        handleMediaResult();
    });

    resizeObserver.observe(body);

    function handleMediaResult() {
        if (repoLink != null) {
            if (window.innerWidth <= 600) {
                if (!repoLink.classList.contains("hidden")) {
                    repoLink.classList.add("hidden");
                    repoLinkMobile.classList.remove("hidden");
                }
            } else {
                if (repoLink.classList.contains("hidden")) {
                    repoLink.classList.remove("hidden");
                    repoLinkMobile.classList.add("hidden");
                }
            }
        }
    }

    if (repoLinkMobile != null) {
        repoLinkMobile.addEventListener("click", () => {
            const a = repoLinkMobile.querySelector("a");
            if (a.style.display == "none") {
                a.style.display = "flex";
                setTimeout(() => { repoLinkMobile.querySelector("a").style.display = "none"; }, 3000);
            }
        });
    }
}

function createNewRequest(projectId) {
    const toast = document.querySelector(".project__toast");
    $.ajax({
        url: '/Projects/Public/CreateNewRequest/' + projectId,
        type: 'POST',
        data: {
            projectsId: String(projectId)
        },
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