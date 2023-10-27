// scripts.js
let currentUser = null; // The ID of the current user
let chatUser = null; // The ID of the user we are chatting with
let baseUrl = 'http://localhost:8008';

document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();

    document.getElementById("send-button").addEventListener("click", sendMessage);
});

function fetchUsers() {
    fetch(baseUrl+'/get-users')
    .then(response => response.json())
    .then(users => {
        const usersList = document.getElementById("users");
        const userSelectDropdown = document.getElementById("current-user");

        usersList.innerHTML = '';
        userSelectDropdown.innerHTML = '<option value="" disabled selected>Select a user</option>';

        users.forEach(user => {
             // For chat list
    const listItem = document.createElement("li");

    // const userImage = document.createElement("img");
    // userImage.src = "path/to/placeholder/icon.png"; // Update this to the path of a user icon or profile image
    // listItem.appendChild(userImage);

    const userNameSpan = document.createElement("span");
    userNameSpan.textContent = user.userName;
    listItem.appendChild(userNameSpan);

    listItem.addEventListener("click", () => startChat(user.userId));
    usersList.appendChild(listItem);

            // For dropdown
            const optionItem = document.createElement("option");
            optionItem.textContent = user.userName;
            optionItem.value = user.userId;
            userSelectDropdown.appendChild(optionItem);
        });

        userSelectDropdown.addEventListener("change", (event) => {
            currentUser = event.target.value;
        });
    });
}


function startChat(userId) {
    chatUser = userId;
    document.getElementById("chat-with").textContent = `Chatting with user ${userId}`;
    fetchMessages(currentUser, chatUser);
}

function fetchMessages(senderId, receiverId) {
    fetch(baseUrl + `/get-msg-list/${senderId}/${receiverId}`)
    .then(response => response.json())
    .then(messages => {
        const messagesDiv = document.getElementById("chat-messages");
        messagesDiv.innerHTML = '';
        messages.forEach(msg => {
            const msgDiv = document.createElement("div");
            msgDiv.classList.add('message');
            
            // Check if the message sender is the current user
            if (msg.sender.userId === parseInt(currentUser)) {
                msgDiv.classList.add('sender');
            } else {
                msgDiv.classList.add('receiver');
            }

            msgDiv.textContent = `${msg.sender.userName}: ${msg.message}`;
            messagesDiv.appendChild(msgDiv);
        });
    });
}


function sendMessage() {
    const messageContent = document.getElementById("message-input").value;
    if (!messageContent || !chatUser || !currentUser) return;

    const message = {
        sender: { userId: parseInt(currentUser) },
        receiver: { userId: parseInt(chatUser) },
        message: messageContent
    };

    fetch(baseUrl+'/send-msg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
    .then(response => response.json())
    .then(messages => {
        document.getElementById("message-input").value = '';
        fetchMessages(currentUser, chatUser);
    });
}

