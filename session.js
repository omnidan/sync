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

exports.findById = function(req, res) {
    if (!collection) {
        res.jsonp({});
        return;
    }
    
    database.findOneById(collection, req.params.id, function(err, item) {
        res.jsonp(item);
    });
};

exports.findAll = function(req, res) {
    if (!collection) {
        res.jsonp([]);
        return;
    }
    
    collection.find().toArray(function(err, items) {
        res.jsonp(items);
    });
};

exports.create = function(req, res) {
    if (req.body.data) {
        collection.insert({data: req.body.data}, {safe: true}, function(err, records) {
            if (err) {
                console.log('Errors while inserting document: ' + JSON.stringify(err));
                res.jsonp({success: false, errors: err, message: 'Failed to create new session.'})
            } else {
                console.log('Inserted record: ' + JSON.stringify(records[0]));
                res.jsonp({success: true, message: 'Successfully created new session.'})
            }
        });
    } else {
        res.jsonp({success: false, message: 'No data.'})
    }
};

exports.update = function(req, res) {
    if (!req.body.id) {
        res.jsonp({success: false, message: 'No ID.'})
        return;
    }
    
    if (req.body.data) {
        collection.update({_id: database.ObjectID(req.body.id)}, {data: req.body.data}, {safe: true}, function(err) {
            if (err) {
                console.log('Errors while updating document: ' + JSON.stringify(err));
                res.jsonp({success: false, errors: err, message: 'Failed to update session (does it exist?).'})
            } else {
                console.log('Updated record "' + req.body.id + '".');
                res.jsonp({success: true, message: 'Successfully updated session.'})
            }
        });
    } else {
        res.jsonp({success: false, message: 'No data.'})
    }
};

exports.destroy = function(req, res) {
    if (!req.body.id) {
        res.jsonp({success: false, message: 'No ID.'})
        return;
    }
    
    collection.remove({_id: database.ObjectID(req.body.id)}, {w: 1}, function(err, removedDocs) {
        if (err) {
            console.log('Errors while removing document: ' + JSON.stringify(err));
            res.jsonp({success: false, errors: err, message: 'Failed to destroy session (does it exist?).'})
        } else {
            console.log('Removed record "' + req.body.id + '".');
            res.jsonp({success: true, message: 'Successfully destroyed session.'})
        }
    });
};
