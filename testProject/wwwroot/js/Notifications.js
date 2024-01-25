const connection = new signalR.HubConnectionBuilder()
    .withUrl("/NotificationsHub") 
    .build();

connection.on("ReceiveNotification", function (title, message) {

    console.log(message);
    createNotification(title = title,
        text = message, buttonText = "To the request", isNew = true);
});

connection.start()
    .then(function () {
        console.log("Connection to SignalR hub established");
    })
    .catch(function (err) {
        console.error(err.toString());
    });

const container = document.querySelector(".notifications__notification-items-container");
// when user open the page they see all the new notifications so they are not new anymore
Array.from(container.children).forEach(notifItem => {
    notifItem.classList.remove("notifications__notification-item-new");
});

// show "no notifications" header-message if there are no any
const noItemsText = container.querySelector("h1");
if (container.children.length == 0) {
    noItemsText.classList.remove("hidden");
}

// use this to show new notifications count
const newCounter = document.querySelector(".notifications__header div p");
// don't show new notifications counter if there are no any new
if (container.querySelector(".notifications__notification-item-new") == null) {
    newCounter.textContent = '';
}

// if parameter is true or not given, incrementation works
// if parameter is false, decrementation works
function incrementNewCounter(increment) {
    if (newCounter.length == 0) {
        var number = 1;
    } else {
        var number = newCounter.innerHTML.split(' ')[0];
    }

    if (increment == true || increment == null) {
        number++;
    } else {
        number--;
    }

    if (number == 0) {
        newCounter.textContent = '';
    } else {
        newCounter.textContent = number + " new";
    }
}

// use this to create and show notifications
function createNotification(title, text, buttonText, isNew) {
    var notificationItem = document.createElement('div');
    notificationItem.classList.add('notifications__notification-item');

    if (isNew) {
        notificationItem.classList.add('notifications__notification-item-new');
    }

    var header = document.createElement('div');
    header.classList.add('notifications__notification-item-header');

    var headerTitle = document.createElement('h3');
    headerTitle.textContent = title;

    var closeButton = document.createElement('button');
    closeButton.classList.add('modal__close-button');

    var crossLine1 = document.createElement('i');
    crossLine1.classList.add('cross-line');

    var crossLine2 = document.createElement('i');
    crossLine2.classList.add('cross-line');

    closeButton.appendChild(crossLine1);
    closeButton.appendChild(crossLine2);
    closeButton.addEventListener('click', function () {
        container.removeChild(notificationItem);
        if (isNew && notificationItem.classList.contains('notifications__notification-item-new')) {
            incrementNewCounter(false);
        }
        if (container.children.length == 1) {
            noItemsText.classList.remove("hidden");
        }
    });

    header.appendChild(headerTitle);
    header.appendChild(closeButton);

    var textParagraph = document.createElement('p');
    textParagraph.textContent = text;

    var button;
    if (buttonText) {
        button = document.createElement('button');
        button.classList.add('button');
        button.textContent = buttonText;
    }

    notificationItem.appendChild(header);
    notificationItem.appendChild(textParagraph);

    if (button) {
        notificationItem.appendChild(button);
    }

    container.insertBefore(notificationItem, container.firstChild);
    if (!noItemsText.classList.contains("hidden")) {
        noItemsText.classList.add("hidden");
    }

    if (isNew == true) {
        incrementNewCounter()
    }
}

newCounter.parentElement.onclick = function () {
    createNotification(title = "test", text = "test notification body text.", buttonText = "", isNew = true);
}

/* createNotification(title = "Plan your team work",
    text = "You’ve just changed your first project’s status to “in development” and we have something to show you. Try out our team plan so you can use kanban board and other agile features to optimize the work processes in your team.",
    buttonText = "Learn more", isNew = false);

createNotification(title = "You have new requests",
    text = "Some new requests to your project ProjectName have appeared since your last visit. Don’t loose your chance to widen your team. It is always easier to manage hard issues with a bigger team.",
    buttonText = "To the project", isNew = true);

createNotification(title = "Your request has been accepted!",
    text = "Congratulations! The owner of project ProjectName has accepted your request. Now you are a part of the project’s team! You have the access to all functions that the team can use. Contact the owner and start working!",
    buttonText = "To the request", isNew = true); */