import express from 'express';
import http from 'http';
import Socket from 'socket.io';


let app = express(),
    server = http.createServer(app),
    io = Socket.listen(server),
    reviewers = new Map();


function broadcastChanges(event, data) {
    data.reviewers.forEach(name => {
        if (reviewers.has(name)) {
            reviewers.get(name).emit(event, data);
        }
    });
}

io.sockets
    .on('connection', (socket) => {
        socket.on('login', (data) => {
            console.log(`${data.name} connected.`);
            reviewers.set(data.name, socket);
        });
        socket.on('candidate:new', (data) => broadcastChanges('candidate:new', data));
        socket.on('candidate:update', (data) => broadcastChanges('candidate:update', data));
        socket.on('candidate:commented', (data) => broadcastChanges('candidate:commented', data));
    });



server.listen(24772, '0.0.0.0', () => {
    console.log('listening on 24772');
});
