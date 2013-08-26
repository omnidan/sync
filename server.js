var express = require('express'),
    sessions = require('./session'),
    root = require('./root');
 
var app = express();

app.use(express.bodyParser());

// TODO: Authentication

app.get('/', root.root);
app.get('/version', root.version);
app.get('/sessions/:id', sessions.findById);
app.get('/sessions', sessions.findAll);
app.post('/sessions', sessions.create);
app.put('/sessions', sessions.update);

app.listen(12345);
console.log('Listening on port 12345...');
