var sessions = require('./session'),
    root = require('./root');

var io = require('socket.io').listen(12345);
console.log('Listening on port 12345...');
 
// TODO: Authentication

io.sockets.on('connection', function (socket) {
    socket.on('version', root.version);
    socket.on('getAll', sessions.findAll);
    socket.on('get', sessions.findById);
    socket.on('create', sessions.create);
    socket.on('destroy', sessions.destroy);
    socket.on('update', sessions.update);
});
