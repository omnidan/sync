var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ObjectID = require('mongodb').ObjectID,
    db;

var mongoClient = new MongoClient(new Server('localhost', 27017));

exports.createDB = function(collection, callback) {
    mongoClient.open(function(err, mongoClient) {
        db = mongoClient.db('sync');
        db.collection(collection, {strict:true}, callback);
    });
};

exports.findOneById = function(collection, id, callback) {
    collection.findOne({'_id': ObjectID(id)}, callback);
};

exports.createCollection = function(collection, callback) {
    mongoClient.db('sync').createCollection(collection, callback);
};

exports.ObjectID = ObjectID;
