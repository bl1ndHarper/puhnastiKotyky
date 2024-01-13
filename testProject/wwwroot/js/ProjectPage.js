window.onload = function () {
    const body = document.querySelector(".project__body");
    const header = document.querySelector(".project__header");
    var headerHeight = header.clientHeight;
    const title = header.querySelector("h1");
    const projectInfo = header.querySelector("div");
    
    body.onscroll = function () {
        //const scrollTop = body.scrollTop;
        //header.style.height = headerHeight - scrollTop + "px";
        //console.log(headerHeight);

        //if (header.style.height >= 100) {
        //    projectInfo.classList.remove('hidden');
        //} else {
        //    projectInfo.classList.add('hidden');
        //}
        console.log(body.scrollTop);
        if (body.scrollTop >= 50 || document.documentElement.scrollTop > 50) {
            projectInfo.style.opacity = 0;
            title.style.marginTop = "150px";
        } else {
            projectInfo.style.opacity = 1;
            title.style.marginTop = "0";
        }
    }
}