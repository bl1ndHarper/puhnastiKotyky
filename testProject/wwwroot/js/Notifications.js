const connection = new signalR.HubConnectionBuilder()
    .withUrl("/NotificationsHub") 
    .build();
const container = document.querySelector(".notifications__notification-items-container");
const noItemsText = document.getElementById("notifications__no-notifications-message");

connection.on("ReceiveNotification", function (title, message, id, sentAt) {

    createNotification(title = title, text = message, id = id, date = sentAt, isNew = true);
    markAllNotificationsAsRead();
});

connection.start()
    .then(function () {
        console.log("Connection to SignalR hub established");
    })
    .catch(function (err) {
        console.error(err.toString());
    });

function markAllNotificationsAsRead() {
    var notificationItems = document.querySelectorAll('.notifications__notification-item-new');
    var notificationIds = [];

    notificationItems.forEach(function (item) {
        var notificationId = item.getAttribute('data-notification-id');
        notificationIds.push(parseInt(notificationId));
    });

    if (notificationIds.length > 0) {
        var ids = notificationIds.join(',');
    } else {
        ids = 'empty';
    }

    $.ajax({
        url: '/Notifications/MarkAllAsRead',
        type: 'POST',
        data: { notificationIds: ids },
        success: function (data) {
            if (data.success) {
                console.log('All notifications marked as read.');
            } else {
                console.error('Failed to mark notifications as read.');
            }
        },
        error: function () {
            console.error('Error occurred while marking notifications as read.');
        }
    });
}

$(document).ready(function () {
    markAllNotificationsAsRead();
});

// use this to show new notifications count
const newCounter = document.querySelector(".notifications__header div p");
var countNewNotifications = document.querySelectorAll('.notifications__notification-item-new').length;
newCounter.textContent = countNewNotifications + " new";

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
function createNotification(title, text, id, date, isNew) {
    var notificationItem = document.createElement('div');
    notificationItem.classList.add('notifications__notification-item');
    notificationItem.setAttribute('data-notification-id', id);

    if (isNew) {
        notificationItem.classList.add('notifications__notification-item-new');
        incrementNewCounter();
    }

    var header = document.createElement('div');
    header.classList.add('notifications__notification-item-header');

    var headerTitle = document.createElement('h3');
    headerTitle.textContent = title;

    /* var closeButton = document.createElement('button');
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
    }); */

    header.appendChild(headerTitle);
    // header.appendChild(closeButton);

    var textParagraph = document.createElement('p');
    textParagraph.innerHTML = text;

    /* var button;
    if (buttonText) {
        button = document.createElement('button');
        button.classList.add('button');
        button.textContent = buttonText;
    } */

    var formattedDate = new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    formattedDate = formattedDate.replace(/\//g, '.');
    var sentAt = document.createElement('p');
    sentAt.textContent = formattedDate;

    notificationItem.appendChild(header);
    notificationItem.appendChild(textParagraph);
    notificationItem.appendChild(sentAt);

    /* if (button) {
        notificationItem.appendChild(button);
    }*/

    container.insertBefore(notificationItem, container.firstChild);
    if (noItemsText && !noItemsText.classList.contains("hidden")) {
        noItemsText.classList.add("hidden");
    }
}

 /* newCounter.parentElement.onclick = function () {
    createNotification(title = "test", text = "test notification body text.", buttonText = "", isNew = true);
}

 createNotification(title = "Plan your team work",
 text = "You’ve just changed your first project’s status to “in development” and we have something to show you. Try out our team plan so you can use kanban board and other agile features to optimize the work processes in your team.",
 buttonText = "Learn more", isNew = false);

 createNotification(title = "You have new requests",
    text = "Some new requests to your project ProjectName have appeared since your last visit. Don’t loose your chance to widen your team. It is always easier to manage hard issues with a bigger team.",
    buttonText = "To the project", isNew = true);

createNotification(title = "Your request has been accepted!",
    text = "Congratulations! The owner of project ProjectName has accepted your request. Now you are a part of the project’s team! You have the access to all functions that the team can use. Contact the owner and start working!",
    buttonText = "To the request", isNew = true); */