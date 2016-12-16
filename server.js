var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var users = [];
var idOfPerson = null;


io.on('connection', function(socket){
	console.log('Connected');
	users.push(socket.id);
	idOfPerson = socket.id;

	io.emit('listOfUsers', users);
	socket.emit('personsId', idOfPerson);

	socket.on('draw', function(position){
		// var drawerId = users[0];
		if(users[0]===socket.id){
			socket.broadcast.emit('draw', position);
		} 
	});

	socket.on('guess', function(guess){
		socket.broadcast.emit('guess', guess)
	});

	socket.on('answered', function(answer){
		socket.broadcast.emit('answered', answer);
	});

	socket.on('disconnect', function() {
        console.log('A user has disconnected');
    });
});





server.listen(process.env.PORT || 8080);