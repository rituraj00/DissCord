const path = require("path")
const express = require("express")
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// user connects
io.on('connection', socket => {
    console.log("New client connected...");

    socket.emit('message','Welcome to SSB Cord!')

    socket.broadcast.emit('message','A user has joined the chat')

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat')
    });

})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))