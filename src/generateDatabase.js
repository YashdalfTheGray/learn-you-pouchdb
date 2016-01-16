// include pouchdb driver for node, the filesystem module,
// a promise library called bluebird and lodash in the file.
// also, add chalk to add a bit of color. 
var PouchDb = require('pouchdb')
    fs = require('fs'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    chalk = require('chalk');

// create a new database on the pouchdb-server instance,
// I'm calling mine playground, could be anything. 
var db = new PouchDb('http://localhost:5984/playground');

// synchronously parse the sample data file into a large JSON array. 
var sampleData = JSON.parse(fs.readFileSync('./src/sampleData.json', 'utf-8'));

// each .then() block is one step in an asynchronous process.
//     1) get all the documents in the database right now.
//     2) use the .id and .value.rev properties to delete all the docs.
//     3) after they are deleted, put the new ones in using db.bulkDocs(). 
//     4) print some messages about the process. 
//     if error, print the error to the console. 
db.allDocs().then(function(result) {
    var docDeletePromiseArray = [];
    _.forEach(result.rows, function(doc) {
        docDeletePromiseArray.push(db.remove(doc.id, doc.value.rev));
    });
    return Promise.all(docDeletePromiseArray);
}).then(function(result) {
    console.log(chalk.cyan(result.length) + ' documents were ' + chalk.red('dropped') + ' from the playground database.');
    return db.bulkDocs(sampleData);
}).then(function(result) {
    console.log(chalk.cyan(result.length) + ' documents were ' + chalk.green('inserted') + ' into the playground database.');
}).catch(function(error) {
    console.log(error);
});