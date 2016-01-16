var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    PouchDb = require('pouchdb'),
    chalk = require('chalk');

var db = new PouchDb('http://localhost:5984/playground');

var app = express();

app.use(morgan(':remote-addr - ' +
    chalk.cyan('[:date] ') +
    chalk.green('":method :url ') +
    chalk.gray('HTTP/:http-version" ') +
    chalk.yellow(':status ') +
    ':res[content-length] ' +
    chalk.gray('":referrer" ":user-agent" ') +
    'time=:response-time ms'
));
app.use(bodyParser.json());

app.get('/api/info', function(req, res) {
    db.info().then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(500).json(error);
    });
});

app.listen(8000);