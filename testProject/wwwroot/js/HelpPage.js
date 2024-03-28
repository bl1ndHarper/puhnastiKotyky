function auto_height(elem) {
    elem.style.height = '48px';
    elem.style.height = `${elem.scrollHeight}px`;
}

var input = document.querySelector('.help-page__help-form-screenshot > input');
var chosenFiles = [];
input.addEventListener("change", function () {
    limitScreenshotsCount();
});
function displayScreenshots() {
    var container = document.querySelector('.help-page__help-form-screenshot > div');
    Array.from(input.files).forEach((file) => {
        var fileSize = file.size;
        var fileMb = fileSize / 1024 / 1024;
        if (fileMb >= 7) {
            alert("Maximum file size is 7 MB");
        } else {
            chosenFiles.push(file);

            var wrapper = document.createElement('div');
            var overlay = document.createElement('div');
            overlay.classList.add('help-page__screenshot-overlay');
            var canvas = document.createElement('img');
            canvas.src = URL.createObjectURL(file);
            wrapper.appendChild(canvas);
            wrapper.appendChild(overlay);
            container.appendChild(wrapper);
            wrapper.addEventListener("click", function () {
                var index = chosenFiles.indexOf(file);
                if (index !== -1) { 
                    chosenFiles.splice(index, 1); 
                }
                wrapper.remove();
            });
        }   
    });
}

function uploadedScreenshotsCount() {
    var container = document.querySelector('.help-page__screenshots-container');
    return container.children.length;
}

function limitScreenshotsCount() {
    if (Array.from(input.files).length <= 4 - uploadedScreenshotsCount()) {
        displayScreenshots();
    } else {
        window.alert("Choose up to 4 images!");
    }
}


var topicsContainer = document.querySelector('.help-page__help-form-topic-selector');
var selectItems = topicsContainer.querySelector('.help-page__help-form-topic-select-items');

Array.from(selectItems.children).forEach((topic) => {
    topic.addEventListener("click", function () {
        selectHelpFormTopic(topic.textContent);
    });
});

function selectHelpFormTopic(topic) {
    var selectedSpan = topicsContainer.querySelector('span');
    var selectedinput = topicsContainer.querySelector('input');

    selectedSpan.textContent = topic;
    selectedinput.textContent = topic;
}

// Assign the chosen topic as the value of the hidden input
document.addEventListener("DOMContentLoaded", function () {
    var topicItems = document.querySelectorAll('.help-page__help-form-topic-select-items p');
    var hiddenInput = document.querySelector('.help-page__help-form-topic-selector input[name="helpFormTopic"]');

    // Set default value
    hiddenInput.value = topicItems[0].textContent;

    topicItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var selectedTopic = this.textContent;
            hiddenInput.value = selectedTopic;
        });
    });
});

function validateForm() {
    const description = document.getElementById("helFormDescription").value;
    const email = document.getElementById("helpFormEmail").value;

    // Check description length
    if (description.length < 12) {
        const tooltip = document.getElementById("descriptionTooltip");
        tooltip.style.border = "3px dashed tomato";
        tooltip.style.visibility = "visible";
        setTimeout(() => { tooltip.style.visibility = "hidden" }, 3000);
        return false;
    }

    // Check email format
    if (!/\S+@\S+\.\S+/.test(email)) {
        const tooltip = document.getElementById("emailTooltip");
        tooltip.style.border = "3px dashed tomato";
        tooltip.style.visibility = "visible";
        setTimeout(() => { tooltip.style.visibility = "hidden" }, 3000);
        return false;
    }

    return true;
}

function submitForm() {
    const toast = document.querySelector(".help-page__toast");
    const topic = document.getElementById("helpFormTopic").value;
    const description = document.getElementById("helFormDescription").value;
    const email = document.getElementById("helpFormEmail").value;
    const clearBtn = document.getElementById("helpFormClear");
    const submitBtn = document.getElementById("helpFormSubmit");

     if (validateForm()) { 
        const formData = new FormData();

        if (chosenFiles.length > 0) {
            for (let i = 0; i < chosenFiles.length; i++) {
                formData.append("screenshots", chosenFiles[i]);
            }
        }

        formData.append("topic", topic);
        formData.append("description", description);
        formData.append("email", email);
        submitBtn.textContent = 'Sending ...';
        submitBtn.disabled = true;
        clearBtn.disabled = true;

        $.ajax({
            url: '/Help/Help/SubmitForm/',
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function (data) {
                if (data.success == true) {
                    toast.querySelector("p").textContent = data.message;
                    toast.classList.remove("toast-error");
                } else {
                    toast.querySelector("p").textContent = data.message;
                    toast.classList.add("toast-error");
                }
                clearForm();
                submitBtn.textContent = 'Send the report!';
                submitBtn.disabled = false;
                clearBtn.disabled = false;
                toast.classList.remove("hidden");
                setTimeout(function () {
                    toast.classList.add("hidden");
                }, 7000);
            }
        });   
    }
}

function clearForm() {
    var topicItems = document.querySelectorAll('.help-page__help-form-topic-select-items p');
    var hiddenInput = document.querySelector('.help-page__help-form-topic-selector input[name="helpFormTopic"]');
    var email = document.getElementById('helpFormEmail');

    hiddenInput.value = topicItems[0].textContent;
    selectHelpFormTopic(topicItems[0].textContent);

    var description = document.getElementById('helFormDescription');
    description.value = '';

    var container = document.querySelector('.help-page__help-form-screenshot > div');
    container.innerHTML = '';
    chosenFiles = [];

    if (!email.hidden) {
        email.value = '';
    }
}


const topicsCards = document.querySelector('.help-page__topics-container');
Array.from(topicsCards.children).forEach((topicCard) => {
    topicCard.addEventListener("click", function () {
        openTopic(topicCard);
    });
});

const openTopicCard = document.querySelector('.help-page__open-topic');
const openTopicPointsContainer = openTopicCard.querySelector('.help-page__open-topic-points');
function openTopic(topicCard) {
    var topicName = topicCard.querySelector('div > h4').textContent;
    var topicIcon = topicCard.querySelector('i');
    const openTopicCardTitle = openTopicCard.querySelector('.help-page__open-topic-header > .help-page__open-topic-header-h > h3');
    const openTopicCardIcon = openTopicCard.querySelector('.help-page__open-topic-header > .help-page__open-topic-header-h > i');
    openTopicCardTitle.textContent = topicName;
    openTopicCardIcon.classList.remove(openTopicCardIcon.classList[1]);
    openTopicCardIcon.classList.add(topicIcon.classList[1]);
    openTopicCard.classList.remove('hidden');
    topicsCards.classList.add('hidden');
    showQuestions(topicName);
}

const backToTopicsButton = document.querySelector('.help-page__open-topic-header-back-button');
backToTopicsButton.addEventListener("click", function () {
    backToTopics();
});
function backToTopics() {
    openTopicCard.classList.add('hidden');
    topicsCards.classList.remove('hidden');
    openTopicPointsContainer.replaceChildren();
}



function showAnswer(selectedPointName) {
    var pointsNames = openTopicCard.querySelectorAll('.help-page__open-topic-points h4');

    Array.from(pointsNames).forEach((item) => {
        if (item.textContent == selectedPointName) {
            item.parentElement.classList.toggle('selected');
            item.nextElementSibling.classList.toggle('hidden');
        }
    });
}

// don't be so scared
// here we are generating points for every topic and append them to the open topic card layout
// this all can be in db
function showQuestions(topicName) {
    if (topicName == "Account and personal information") {
        var point1 = document.createElement('li');
        var h4 = document.createElement('h4')
        h4.appendChild(document.createTextNode("How to change or delete my account information?"));
        var p = document.createElement('p')
        p.appendChild(document.createTextNode("You can change or delete your account information in the Account tab. You must be authenticated for this. Click the 'Edit Profile' button and then you will be able change your skills stack, profile icon and description. Don't forget to save your changes."));
        p.classList.add('hidden');
        point1.appendChild(h4);
        point1.appendChild(p);

        var point2 = document.createElement('li');
        h4 = document.createElement('h4')
        h4.appendChild(document.createTextNode("Can I change my username and email?"));
        p = document.createElement('p')
        p.appendChild(document.createTextNode("Unfortunately, it is now impossible to change your email, name or surname associated with you from your Account Page, but you still can ask developers for this via reporting form below."));
        p.classList.add('hidden');
        point2.appendChild(h4);
        point2.appendChild(p);

        var point3 = document.createElement('li');
        h4 = document.createElement('h4')
        h4.appendChild(document.createTextNode("Which information is public and can be seen by other users?"));
        p = document.createElement('p')
        p.appendChild(document.createTextNode("Every registered user can see the projects you are a part of and all the public account information which are: your profile image, name, surname, email, skills and description."));
        p.classList.add('hidden');
        point3.appendChild(h4);
        point3.appendChild(p);

        openTopicPointsContainer.appendChild(point1);
        openTopicPointsContainer.appendChild(point2);
        openTopicPointsContainer.appendChild(point3);
    } else if (topicName == "Projects creation") {
        var point1 = document.createElement('li');
        var h4 = document.createElement('h4')
        h4.appendChild(document.createTextNode("How do I create a project?"));
        var p = document.createElement('p')
        p.appendChild(document.createTextNode("To create a project you must be a registered user. Then on the Account page you can find an area which says 'Here you can create your new project!'. Now name your idea, then give all the other information about your project and click the 'Create the project!' button."));
        p.classList.add('hidden');
        point1.appendChild(h4);
        point1.appendChild(p);

        var point2 = document.createElement('li');
        h4 = document.createElement('h4')
        h4.appendChild(document.createTextNode("How many technologies can I choose?"));
        p = document.createElement('p')
        p.appendChild(document.createTextNode("You can select as many technologies as you need as long as it will be the truth about your project. If you have too many unrelated technologies chosen, other developers will not want to join your team so please be serious about it. You also will be able to change the technologies stack later."));
        p.classList.add('hidden');
        point2.appendChild(h4);
        point2.appendChild(p);

        var point3 = document.createElement('li');
        h4 = document.createElement('h4')
        h4.appendChild(document.createTextNode("Can I change the information about my project?"));
        p = document.createElement('p')
        p.appendChild(document.createTextNode("All the projects you've created or are a part of are listed on your Account page. If you are the owner of a project, you can open it later and change its status, technologies, description, delete team members and moderate the requests."));
        p.classList.add('hidden');
        point3.appendChild(h4);
        point3.appendChild(p);

        var point4 = document.createElement('li');
        h4 = document.createElement('h4')
        h4.appendChild(document.createTextNode("Can I make a project private?"));
        p = document.createElement('p')
        p.appendChild(document.createTextNode("Unfortunately, it is now impossible to create private projects but this feature will be available later. Now only the projects with status of 'draft' and 'completed' are not listed on the home page but everyone still can find it on your Public Account page or by id."));
        p.classList.add('hidden');
        point4.appendChild(h4);
        point4.appendChild(p);

        openTopicPointsContainer.appendChild(point1);
        openTopicPointsContainer.appendChild(point2);
        openTopicPointsContainer.appendChild(point3);
        openTopicPointsContainer.appendChild(point4);
    } else if (topicName == "Requests, teams and communication") {
        var point1 = document.createElement('li');
        var h4 = document.createElement('h4')
        h4.appendChild(document.createTextNode("What are requests and how do I make one?"));
        var p = document.createElement('p')
        p.appendChild(document.createTextNode("Every authenticated user can make a Request to become a project team member. When you find a project interesting for you, you can make a request by clicking 'Join request!' button on its Public page. Then the project owner will recieve, review your request and accept it if he wants."));
        p.classList.add('hidden');
        point1.appendChild(h4);
        point1.appendChild(p);

        var point2 = document.createElement('li');
        h4 = document.createElement('h4')
        h4.appendChild(document.createTextNode("Can I withdraw my request?"));
        p = document.createElement('p')
        p.appendChild(document.createTextNode("Yes, you can withdraw (delete) your request if it hasn't been accepted yet. To do that go to the Account page, scroll down to your requests, open one and click 'Delete the request' button. You will be able to request to the same project again later if you change your mind."));
        p.classList.add('hidden');
        point2.appendChild(h4);
        point2.appendChild(p);

        var point3 = document.createElement('li');
        h4 = document.createElement('h4')
        h4.appendChild(document.createTextNode("How many request can I create?"));
        p = document.createElement('p')
        p.appendChild(document.createTextNode("Every registered user can have only one valid Request per project. It means that you can make a Request to any project that is available but you cannot make another Request to the same project if you already have one."));
        p.classList.add('hidden');
        point3.appendChild(h4);
        point3.appendChild(p);

        var point4 = document.createElement('li');
        h4 = document.createElement('h4')
        h4.appendChild(document.createTextNode("Can I leave a project team?"));
        p = document.createElement('p')
        p.appendChild(document.createTextNode("Yes, you can leave a project if you are not its owner. Open the project window from your Accaount page, go down to the 'Danger zone' and click the 'Leave and delete' button. You'll be deleted from the project team and it will disappear from your dashboard. You still will be able to rejoin the project team later by requesting to its owner."));
        p.classList.add('hidden');
        point4.appendChild(h4);
        point4.appendChild(p);

        openTopicPointsContainer.appendChild(point1);
        openTopicPointsContainer.appendChild(point2);
        openTopicPointsContainer.appendChild(point3);
        openTopicPointsContainer.appendChild(point4);
    } else if (topicName == "Bans and projects deletion") {
        var point1 = document.createElement('li');
        var h4 = document.createElement('h4')
        h4.appendChild(document.createTextNode("I've been banned. Can I recover my account?"));
        var p = document.createElement('p')
        p.appendChild(document.createTextNode("If your account has been banned and you believe it was a mistake, you can submit the form below and select the 'Bans and projects deletion' topic option. Don't forget you can pin some screenshots, because sometimes it can help our team to understand the situation."));
        p.classList.add('hidden');
        point1.appendChild(h4);
        point1.appendChild(p);

        var point2 = document.createElement('li');
        h4 = document.createElement('h4')
        h4.appendChild(document.createTextNode("Can I recover my project if it was deleted?"));
        p = document.createElement('p')
        p.appendChild(document.createTextNode("As a rule, we delete projects due to their illegal or unethical naming and/or description. Such projects are unlikely to be recovered but if you still believe there was a mistake, submit a form below and ask to review the decision."));
        p.classList.add('hidden');
        point2.appendChild(h4);
        point2.appendChild(p);

        var point3 = document.createElement('li');
        h4 = document.createElement('h4')
        h4.appendChild(document.createTextNode("Can my project be deleted if the information about it is deceptive?"));
        p = document.createElement('p')
        p.appendChild(document.createTextNode("We do not delete the projects that show obviously false or impossible information about their thechologies, complexity or deadlines but such projects are not popular among users."));
        p.classList.add('hidden');
        point3.appendChild(h4);
        point3.appendChild(p);

        openTopicPointsContainer.appendChild(point1);
        openTopicPointsContainer.appendChild(point2);
        openTopicPointsContainer.appendChild(point3);
    }

    Array.from(openTopicPointsContainer.children).forEach((point) => {
        point.addEventListener("click", function () {
            showAnswer(point.querySelector('h4').textContent);
        });
    });
}