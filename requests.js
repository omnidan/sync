var database = require('./database');

var collection;
var db = database.createDB('sync', function(err, _collection) {
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

exports.version = function(data) {
    return {type: 'result', data: {name: 'TouchLay Sync', version: '0.0.1'}};
};

exports.findById = function(data) {
    if (!collection) {
        return {type: 'result', data: {}};
    }
    
    database.findOneById(collection, req.params.id, function(err, item) {
        return {type: 'result', data: item};
    });
    
    return {type: 'result'};
};

exports.findAll = function(data) {
    if (!collection) {
        return {type: 'result', data: []};
    }
    
    collection.find().toArray(function(err, items) {
        return {type: 'result', data: items};
    });
    
    return {type: 'result', data: []};
};

exports.create = function(data) {
    if (data.data) {
        collection.insert({data: data.data}, {safe: true}, function(err, records) {
            if (err) {
                console.log('Errors while inserting document: ' + JSON.stringify(err));
                return {type: 'message', data: {success: false, errors: err, message: 'Failed to create new session.'}};
            } else {
                console.log('Inserted record: ' + JSON.stringify(records[0]));
                return {type: 'message', data: {success: true, message: 'Successfully created new session.'}};
            }
        });
    }
    
    return {type: 'message', data: {success: false, message: 'No data.'}};
};

exports.update = function(data) {
    if (!data.id) {
        return {type: 'message', data: {success: false, message: 'No ID.'}};
    }
    
    if (data.data) {
        collection.update({_id: database.ObjectID(data.id)}, {data: data.data}, {safe: true}, function(err) {
            if (err) {
                console.log('Errors while updating document: ' + JSON.stringify(err));
                return {type: 'message', data: {success: false, errors: err, message: 'Failed to update session (does it exist?).'}};
            } else {
                console.log('Updated record "' + data.id + '".');
                return {type: 'message', data: {success: true, message: 'Successfully updated session.'}};
            }
        });
    }
    
    return {type: 'message', data: {success: false, message: 'No data.'}};
};

exports.destroy = function(data) {
    if (!data.id) {
        return {type: 'message', data: {success: false, message: 'No ID.'}};
    }
    
    collection.remove({_id: database.ObjectID(data.id)}, {w: 1}, function(err, removedDocs) {
        if (err) {
            console.log('Errors while removing document: ' + JSON.stringify(err));
            return {type: 'message', data: {success: false, errors: err, message: 'Failed to destroy session (does it exist?).'}};
        } else {
            console.log('Removed record "' + data.id + '".');
            return {type: 'message', data: {success: true, message: 'Successfully destroyed session.'}};
        }
    });
    
    return {type: 'message', data: {success: false, message: 'Unknown error.'}};
};
