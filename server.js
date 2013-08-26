var io = require('socket.io').listen(12345);
console.log('Listening on port 12345...');

var requests = require('./requests');
 
// TODO: Authentication

function bind(socket, key, func) {
    socket.on(key, function(data) {
        func(data, function(_data) { io.sockets.emit('message', _data); });
    });
}

io.sockets.on('connection', function (socket) {
    bind(socket, 'version', requests.version);
    bind(socket, 'getAll', requests.findAll);
    bind(socket, 'get', requests.findById);
    bind(socket, 'create', requests.create);
    bind(socket, 'destroy', requests.destroy);
    bind(socket, 'update', requests.update);
});
