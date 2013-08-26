var database = require('./database');

var collection;
var db = database.createDB('sessions', function(err, _collection) {
    if (err) {
        console.log('Errors while loading collection: ');
        console.log(err);
        console.log('Attempting to create collection...');
        database.createCollection('session', function(err, col) {
            if (err) {
                console.log('Error!');
                console.log(err);
            } else {
                console.log('Success!');
                collection = col;
            }
        });
    } else collection = _collection;
});

exports.findById = function(data) {
    if (!collection) {
        io.sockets.emit('message', {});
        return;
    }
    
    database.findOneById(collection, req.params.id, function(err, item) {
        io.sockets.emit('message', item);
    });
};

exports.findAll = function(data) {
    if (!collection) {
        io.sockets.emit('message', []);
        return;
    }
    
    collection.find().toArray(function(err, items) {
        io.sockets.emit('message', items);
    });
};

exports.create = function(data) {
    if (req.body.data) {
        collection.insert({data: req.body.data}, {safe: true}, function(err, records) {
            if (err) {
                console.log('Errors while inserting document: ' + JSON.stringify(err));
                io.sockets.emit('message', {success: false, errors: err, message: 'Failed to create new session.'});
            } else {
                console.log('Inserted record: ' + JSON.stringify(records[0]));
                io.sockets.emit('message', {success: true, message: 'Successfully created new session.'});
            }
        });
    } else {
        io.sockets.emit('message', {success: false, message: 'No data.'});
    }
};

exports.update = function(data) {
    id = req.params.id;
    if (!req.params.id) {
        id = req.body.id;
        if (!req.body.id) {
            io.sockets.emit('message', {success: false, message: 'No ID.'});
            return;
        }
    }
    
    if (req.body.data) {
        collection.update({_id: database.ObjectID(id)}, {data: req.body.data}, {safe: true}, function(err) {
            if (err) {
                console.log('Errors while updating document: ' + JSON.stringify(err));
                io.sockets.emit('message', {success: false, errors: err, message: 'Failed to update session (does it exist?).'});
            } else {
                console.log('Updated record "' + id + '".');
                io.sockets.emit('message', {success: true, message: 'Successfully updated session.'});
            }
        });
    } else {
        io.sockets.emit('message', {success: false, message: 'No data.'});
    }
};

exports.destroy = function(data) {
    id = req.params.id;
    if (!req.params.id) {
        id = req.body.id;
        if (!req.body.id) {
            io.sockets.emit('message', {success: false, message: 'No ID.'});
            return;
        }
    }
    
    collection.remove({_id: database.ObjectID(id)}, {w: 1}, function(err, removedDocs) {
        if (err) {
            console.log('Errors while removing document: ' + JSON.stringify(err));
            io.sockets.emit('message', {success: false, errors: err, message: 'Failed to destroy session (does it exist?).'});
        } else {
            console.log('Removed record "' + id + '".');
            io.sockets.emit('message', {success: true, message: 'Successfully destroyed session.'});
        }
    });
};
