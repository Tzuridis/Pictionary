var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var usercount = 0;

io.on('connection', function (socket) {
    usercount++;
    console.log('Client connected - Users connected:', usercount);
    io.emit('usercount', 'Users Connected:' + usercount);

    socket.on('draw', function (position) {
        console.log('Drawing:', position);
        io.emit('draw', position);
    });

    socket.on('onKeyDown', function (guessBox) {
        console.log('User Guess:', guessBox);
        io.emit('onKeyDown', guessBox);
    });

    socket.on('reset', function(){
        io.emit('reset');
    });

    socket.on('disconnect', function () {
        usercount--;
        console.log('Client disconnected - Users connected:', usercount);
        io.emit('usercount', 'Users Connected:' + usercount);
    });
});

server.listen(process.env.PORT || 8080);