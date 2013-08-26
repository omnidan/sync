exports.version = function(data) {
    io.sockets.emit('message', {name: "TouchLay Sync", version: "0.0.1"});
}
