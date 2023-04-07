require('dotenv').config();
const express = require('express');
const sequelize = require('./bd');
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./milddleware/ErrorHandlingMiddleware');

const http = require("http");
const WebSocket = require( "ws");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

const webSocketServer = new WebSocket.Server({noServer: true});



webSocketServer.on('connection', ws => {
    ws.on('message', function (message) {
        message = JSON.parse(message);
        if (message.event === 'connection') {
          ws.id = message.id;
        } else if (message.event === 'message') {
          broadcastMessage(message, message.recipient)
        }
      });

});

server.on('upgrade', (request, socket, head) => {
    webSocketServer.handleUpgrade(request, socket, head, (ws) => {
        webSocketServer.emit('connection', ws, request)
    })
})

function broadcastMessage(message, id) {
    webSocketServer.clients.forEach(client => {
        if(client.id === id) {
            client.send(JSON.stringify(message));
        }
    });
  }

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.use(errorHandler);
const start = async () => {
    try{
        await sequelize.authenticate(); // Подключение к базе данных
        await sequelize.sync() // Сверяет состояние базы данных со схемой в базе данных
        server.listen(PORT, () => console.log('server working' + PORT));
    } catch(e) {
        console.log(e)
    }
}
start()

