const path = require("path")
const express = require("express")
const http = require('http')
const socketio = require('socket.io')
const utils = require('./utils/server_utils')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const BotName = 'SSB-Cord';

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// user connects
io.on('connection', socket => {
    socket.on('user-joined', ({ username, chatroom }) => {
        const user = utils.AddUser(socket.id, username, chatroom)
        socket.join(user.chatroom)
        io.to(user.chatroom).emit('chatroom-members', {
            chatroom: user.chatroom,
            users: utils.GetRoomMembers(user.chatroom)
        })
        socket.emit('message', utils.FormatMessage(BotName, `Welcome ${user.username} to SSB Cord!`))

        socket.broadcast.to(user.chatroom).emit('message', utils.FormatMessage(BotName, `${user.username} has joined the chat`))

    })


    socket.on('chat-message', (message) => {
        const user = utils.GetUser(socket.id)

        io.to(user.chatroom).emit('message', utils.FormatMessage(user.username, message));
    })

    socket.on('disconnect', () => {
        const user = utils.RemovedUser(socket.id)

        if (user) {
            io.to(user.chatroom).emit('message', utils.FormatMessage(BotName, `${user.username} has left the room`))

            io.to(user.chatroom).emit('chatroom-members', {
                chatroom: user.chatroom,
                users: utils.GetRoomMembers(user.chatroom)
            })
        }
    });


})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))