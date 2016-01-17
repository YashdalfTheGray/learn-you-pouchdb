// Import in some modules for us to use to create this server.
// The one of interest here is express which is a node.js HTTP
// server that is extremely configurable. Logging is provided by
// morgan and body-parser is something that express uses to parse
// the body of an incoming HTTP request so we can get at the data
// that was attached to the request. 
var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    PouchDb = require('pouchdb'),
    chalk = require('chalk');

// Open or create our pouchdb playground database. 
var db = new PouchDb('http://localhost:5984/playground');

// create an express app, this basically sets up an unconfigured
// HTTP server.
var app = express();

// Setup some logging so that we can see requests that are coming
// to the server. 
app.use(morgan(':remote-addr - ' +
    chalk.cyan('[:date] ') +
    chalk.green('":method :url ') +
    chalk.gray('HTTP/:http-version" ') +
    chalk.yellow(':status ') +
    ':res[content-length] ' +
    chalk.gray('":referrer" ":user-agent" ') +
    'time=:response-time ms'
));

// Tell express to use the json version of body parser. Any requests
// with a body will now be parsed as JSON.
app.use(bodyParser.json());

// Setting up the API routes here, it basically starts with an HTTP
// verb that you want to watch for like GET, POST, PUT, etc. and a
// path that you would want to watch that verb at like /api/info. 
// To actually get data from this route, you would run an HTTP GET 
// on the URL http://localhost:8000/api/info. After the path, you 
// have  a function that gets a request and a response. The request
// is the incoming data and the response is what you'll send out. 
app.get('/api/info', function(req, res) {
    db.info().then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(500).json(error);
    });
});

// Get all the documents in the database. 
app.get('/api/docs', function(req, res) {
    db.allDocs({ include_docs: true }).then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(500).json(error);
    });
});

// Get a specific document in the database. 
app.get('/api/docs/:id', function(req, res) {
    db.get(req.params.id).then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(500).json(error);
    });
});

// Create a new document in the database and auto generate an id
// for it. 
app.post('/api/docs', function(req, res) {
    db.post(req.body).then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(500).json(error);
    });
});

// Create a new document in the database with the given _id. 
app.put('/api/docs', function(req, res) {
    if (!req.body._id) {
        res.status(400).json({
            status: 'error',
            message: 'To create a document, an _id needs to be supplied. '
        });
    }
    else {
        db.put(req.body).then(function(result) {
            res.status(200).json(result);
        }).catch(function(error) {
            res.status(500).json(error);
        });
    }
});

// Update a document in the database based on the _id and the _rev
// passed in to the request in the body. 
app.put('/api/docs/', function(req, res) {
    if (!req.body._id || !req.body._rev) {
        res.status(400).json({
            status: 'error',
            message: 'Either the _id or the _rev field was not found in the request.'
        });
    }
    else {
        db.put(req.body).then(function(result) {
            res.status(200).json(result);
        }).catch(function(error) {
            res.status(500).json(error);
        });
    }
});

// Delete a document from the database.
app.delete('/api/docs', function(req, res) {
    if (!req.body._id || !req.body._rev) {
        res.status(400).json({
            status: 'error',
            message: 'Either the _id or the _rev field was not found in the request.'
        });
    }
    else {
        db.remove(req.body).then(function(result) {
            res.status(200).json(result);
        }).catch(function(error) {
            res.status(500).json(error);
        });
    }
});

// Tell express to listen on port 8000. 
app.listen(8000);