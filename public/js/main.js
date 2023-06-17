// import Client_Utils from './client_utils.js'

const chat_form = document.getElementById("chat-form");
const chat_messages = document.querySelector('.chat-messages');
const room = document.getElementById('room-name');
const user_list = document.getElementById('users');
const socket = io();


const { username, room: chatroom } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

// const client_utils = new Client_Utils();

// const {username, room: chat_room} = client_utils.GetQueryParameters();

socket.emit('user-joined', { username, chatroom });

socket.on('chatroom-members', ({ chatroom, users }) => {
    OutputRoomName(chatroom);
    OutputUsers(users);
})

socket.on('message', message => {
    OutputMessage(message);
    chat_messages.scrollTop = chat_messages.scrollHeight;
});

// Sending message
chat_form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message_div = e.target.elements.msg;
    const msg = message_div.value;

    socket.emit('chat-message', msg);

    message_div.value = '';
    message_div.focus();
})

function OutputMessage(message) {
    const message_div = document.createElement('div');
    message_div.classList.add('message');
    message_div.innerHTML = `
        <p class="meta">${message.user} <span>${message.timestamp}</span></p>
        <p class="text">
            ${message.content}
        </p>`;
    document.querySelector('.chat-messages').appendChild(message_div);
}

function OutputRoomName(chatroom) {
    room.innerText = chatroom;
}

function OutputUsers(users) {
    user_list.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
