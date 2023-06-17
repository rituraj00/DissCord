const USERS = [];

const moment = require('moment');

function FormatMessage(user, content){
    return {
        content,
        user,
        timestamp: moment().format('h:mm a')
    }
}

function AddUser(id, username, chatroom){
    let user_details = {id, username, chatroom};
    USERS.push(user_details);
    return user_details;
}

function GetUser(id){
    return USERS.find(u => u.id === id)
}

function RemovedUser(id){
    let idx = USERS.findIndex(user => user.id === id);

    if(idx != -1){
        let removedUser = USERS.splice(idx,1)[0];
        return removedUser;
    }

}

function GetRoomMembers(chatroom){
    return USERS.filter(u => u.chatroom === chatroom);
}

module.exports = {FormatMessage, AddUser, GetUser, RemovedUser, GetRoomMembers};