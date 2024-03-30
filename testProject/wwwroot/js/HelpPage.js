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
var questionsArray = [];
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
    showQuestions(questionsArray, topicName);
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

fillQuestionsArray(questionsArray);
function fillQuestionsArray(array) {
    array.push(
        { topic: "Account and personal information", question: "How to change or delete my account information?", answear: "You can change or delete your account information in the Account tab. You must be authenticated for this. Click the 'Edit Profile' button and then you will be able change your skills stack, profile icon and description. Don't forget to save your changes." },
        { topic: "Account and personal information", question: "Can I change my username and email?", answear: "Unfortunately, it is now impossible to change your email, name or surname associated with you from your Account Page, but you still can ask developers for this via reporting form below." },
        { topic: "Account and personal information", question: "Which information is public and can be seen by other users?", answear: "Every registered user can see the projects you are a part of and all the public account information which are: your profile image, name, surname, email, skills and description." }
    );
    array.push(
        { topic: "Projects creation", question: "How do I create a project?", answear: "To create a project you must be a registered user. Then on the Account page you can find an area which says 'Here you can create your new project!'. Now name your idea, then give all the other information about your project and click the 'Create the project!' button." },
        { topic: "Projects creation", question: "How many technologies can I choose?", answear: "You can select as many technologies as you need as long as it will be the truth about your project. If you have too many unrelated technologies chosen, other developers will not want to join your team so please be serious about it. You also will be able to change the technologies stack later." },
        { topic: "Projects creation", question: "Can I change the information about my project?", answear: "All the projects you've created or are a part of are listed on your Account page. If you are the owner of a project, you can open it later and change its status, technologies, description, delete team members and moderate the requests." },
        { topic: "Projects creation", question: "Can I make a project private?", answear: "Unfortunately, it is now impossible to create private projects but this feature will be available later. Now only the projects with status of 'draft' and 'completed' are not listed on the home page but everyone still can find it on your Public Account page or by id." }
    );
    array.push(
        { topic: "Requests, teams and communication", question: "What are requests and how do I make one?", answear: "Every authenticated user can make a Request to become a project team member. When you find a project interesting for you, you can make a request by clicking 'Join request!' button on its Public page. Then the project owner will recieve, review your request and accept it if he wants." },
        { topic: "Requests, teams and communication", question: "Can I withdraw my request?", answear: "Yes, you can withdraw (delete) your request if it hasn't been accepted yet. To do that go to the Account page, scroll down to your requests, open one and click 'Delete the request' button. You will be able to request to the same project again later if you change your mind." },
        { topic: "Requests, teams and communication", question: "How many request can I create?", answear: "Every registered user can have only one valid Request per project. It means that you can make a Request to any project that is available but you cannot make another Request to the same project if you already have one." },
        { topic: "Requests, teams and communication", question: "Can I leave a project team?", answear: "Yes, you can leave a project if you are not its owner. Open the project window from your Account page, go down to the 'Danger zone' and click the 'Leave and delete' button. You'll be deleted from the project team and it will disappear from your dashboard. You still will be able to rejoin the project team later by requesting to its owner." }
    );
    array.push(
        { topic: "Bans and projects deletion", question: "I've been banned. Can I recover my account?", answear: "If your account has been banned and you believe it was a mistake, you can submit the form below and select the 'Bans and projects deletion' topic option. Don't forget you can pin some screenshots, because sometimes it can help our team to understand the situation." },
        { topic: "Bans and projects deletion", question: "Can I recover my project if it was deleted?", answear: "As a rule, we delete projects due to their illegal or unethical naming and/or description. Such projects are unlikely to be recovered but if you still believe there was a mistake, submit a form below and ask to review the decision." },
        { topic: "Bans and projects deletion", question: "Can my project be deleted if the information about it is deceptive?", answear: "We do not delete the projects that show obviously false or impossible information about their thechologies, complexity or deadlines but such projects are not popular among users." }
    );
}

function showQuestions(array, topicName) {
    array.forEach(function (elem) {
        if (elem.topic == topicName || topicName == "searched") {
            var point = document.createElement('li');
            var h4 = document.createElement('h4')
            h4.appendChild(document.createTextNode(elem.question));
            var p = document.createElement('p')
            p.appendChild(document.createTextNode(elem.answear));
            p.classList.add('hidden');
            point.appendChild(h4);
            point.appendChild(p);
            openTopicPointsContainer.appendChild(point);
        }
    });

    Array.from(openTopicPointsContainer.children).forEach((point) => {
        point.addEventListener("click", function () {
            showAnswer(point.querySelector('h4').textContent);
        });
    });
}

// search functionality
const searchInput = document.querySelector(".help-page__search input");
const searchButton = document.querySelector(".help-page__search button");
searchButton.addEventListener('click', function () {
    var searchQuery = searchInput.value;
    searchHelp(searchQuery);
});
searchInput.addEventListener('input', function () {
    if (searchInput.value.length >= 3) {
        searchButton.style.backgroundColor = "#bcead5";
        searchButton.disabled = false;
    } else {
        searchButton.style.backgroundColor = "lightgrey";
        searchButton.disabled = true;
    }
});
function searchHelp(query) {
    var foundHelpArray = [];
    questionsArray.forEach(function (item) {
        if (String(item.question).toLowerCase().includes(query.toLowerCase())) {
            foundHelpArray.push(item);
        }
    });
    showFoundHelp(foundHelpArray);
}
function showFoundHelp(array) {
    const openTopicCardTitle = openTopicCard.querySelector('.help-page__open-topic-header > .help-page__open-topic-header-h > h3');
    const openTopicCardIcon = openTopicCard.querySelector('.help-page__open-topic-header > .help-page__open-topic-header-h > i');
    openTopicPointsContainer.replaceChildren();
    if (array == "" || array == null) {
        openTopicCardTitle.textContent = "Nothing found. Please, try another query or submit a help form below."
    } else {
        openTopicCardTitle.textContent = "Take a look at what we've found";
        showQuestions(array, "searched");
    }
    openTopicCardIcon.classList.replace(openTopicCardIcon.classList[1], "fa-search");
    openTopicCard.classList.remove('hidden');
    topicsCards.classList.add('hidden');
}