import express from 'express'
import cors from 'cors'

import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

const app = express()
const http = createServer(app)
const io = new Server(http, {
   cors: {
      origin: 'http://localhost:3006', // client side web address
      credentials: true
   }
})

const characters : { [id: string]: { color: string, top: number, left: number } } = {};

io.on("connection", function(socket: Socket) {
   console.log('A new player has connected')

   socket.on("character-joined", function(data) {
      characters[data.id] = data.newChar
      io.emit("client-character-joined", characters);
      console.log('Joined player:', data.newChar, '\n')
   });
   socket.on("update-character", function(data) {
      characters[data.id].top = data.top
      characters[data.id].left = data.left
      io.emit("client-character-joined", characters);
      console.log('Updated characters:', characters)
   })
   socket.on("remove-character", function (characterId) {
      let deletedCharacter = characters[characterId]
      delete characters[characterId]
      io.emit("client-character-joined", characters);
      console.log('Character left: ', deletedCharacter, '\n')
   })

});

http.listen(8001, function() {
   console.log("listening on *:8001");
});

app.disable('x-powered-by')
app.use(cors())

