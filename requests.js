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
    return {type: 'version', data: {name: 'TouchLay Sync', version: '0.0.1'}};
};

exports.findById = function(data) {
    if (!collection) {
        return {type: 'result', data: {}};
    }
    
    var result = {};
    database.findOneById(collection, req.params.id, function(err, item) {
        result = {type: 'result', data: item};
    });
    
    return result;
};

exports.findAll = function(data) {
    if (!collection) {
        return {type: 'results', data: []};
    }
    
    var result = {};
    collection.find().toArray(function(err, items) {
        result = {type: 'results', data: items};
    });
    
    return result;
};

exports.create = function(data) {
    if (data.data) {
        var result = {};
        collection.insert({data: data.data}, {safe: true}, function(err, records) {
            if (err) {
                console.log('Errors while inserting document: ' + JSON.stringify(err));
                result = {type: 'message', data: {success: false, errors: err, message: 'Failed to create new session.'}};
            } else {
                console.log('Inserted record: ' + JSON.stringify(records[0]));
                result = {type: 'message', data: {success: true, message: 'Successfully created new session.'}};
            }
        });
        return result;
    }
    
    return {type: 'message', data: {success: false, message: 'No data.'}};
};

exports.update = function(data) {
    if (!data.id) {
        return {type: 'message', data: {success: false, message: 'No ID.'}};
    }
    
    if (data.data) {
        var result = {};
        collection.update({_id: database.ObjectID(data.id)}, {data: data.data}, {safe: true}, function(err) {
            if (err) {
                console.log('Errors while updating document: ' + JSON.stringify(err));
                result = {type: 'message', data: {success: false, errors: err, message: 'Failed to update session (does it exist?).'}};
            } else {
                console.log('Updated record "' + data.id + '".');
                result = {type: 'message', data: {success: true, message: 'Successfully updated session.'}};
            }
        });
        return result;
    }
    
    return {type: 'message', data: {success: false, message: 'No data.'}};
};

exports.destroy = function(data) {
    if (!data.id) {
        return {type: 'message', data: {success: false, message: 'No ID.'}};
    }
    
    var result = {};
    collection.remove({_id: database.ObjectID(data.id)}, {w: 1}, function(err, removedDocs) {
        if (err) {
            console.log('Errors while removing document: ' + JSON.stringify(err));
            result = {type: 'message', data: {success: false, errors: err, message: 'Failed to destroy session (does it exist?).'}};
        } else {
            console.log('Removed record "' + data.id + '".');
            result = {type: 'message', data: {success: true, message: 'Successfully destroyed session.'}};
        }
    });
    
    return result;
};
