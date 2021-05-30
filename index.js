const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generate} = require('./src/utils/messageGenerate')

const {addUser,removeUser,readUser,readUsersRoom } =require('./src/utils/users')
// socketio() expects a server as an argument to be configured . If we use app =express() , it creates a server behind the
// scenes and we dont have access to the server.So we cannot pass it to socketio in that case.
// Hence a server is manually created using http.createServer() and then the express framework is passed on to it.
const server = http.createServer(app)
const io = socketio(server)
const port =3000
app.use(express.static(path.join(__dirname,'./public')))


io.on('connection',(socket)=>{

    socket.on('join',({username,roomname},callback)=>{
        const {error,user} = addUser({id:socket.id,username,roomname})
        if(error)
        {
            return callback(error)
        }

        socket.join(user.roomname)
        socket.emit('message',generate('Admin','Welcome'))
        socket.broadcast.to(user.roomname).emit('message',generate('Admin',`${user.username} has joined!`))
        io.to(user.roomname).emit('roomlist',{room:user.roomname,userlist:readUsersRoom(user.roomname)})
    })
    
    socket.on('sendMessage',(message,callback)=>{
        const filter = new Filter()
        if(filter.isProfane(message))
        {
            return callback('Profanity not allowed!')
        }
        const user=readUser(socket.id)

        socket.broadcast.to(user.roomname).emit('message',generate(user.username,message))
        callback()

    })

    socket.on('sendLocation',(location,callback)=>{
        const user=readUser(socket.id)
        socket.broadcast.to(user.roomname).emit('messageLocation',generate(user.username,`https://www.google.com/maps?q=${location.lat},${location.lon}`))
        callback()

    })

    socket.on('disconnect',(callback)=>{
        const {error,user} = removeUser(socket.id)
        if(error)
        {
            return console.log(error)
        }
        io.to(user.roomname).emit('message',generate('Admin',`${user.username} has left!`))
        io.to(user.roomname).emit('roomlist',{room:user.roomname,userlist:readUsersRoom(user.roomname)})

    })


})

server.listen(port,()=>{
    console.log('Server running on port '+port)
})