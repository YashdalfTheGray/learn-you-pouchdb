# learn-you-pouchdb
Learning Pouchdb and pouchdb-server by creating a node API.

## Downloading the code
If git is available, clone the repository by running `git clone https://github.com/YashdalfTheGray/learn-you-pouchdb.git` in a terminal window. Otherwise download the code as a zip file from Github.

## Installing
Once the repository is cloned or downloaded, run `npm install` from inside the directory that the clone command created.

This will install all the dependencies that are required for this project.

Once that is done, run `gulp init`  to generate a directory for the Pouch database to be stored and a log file for pouchdb-server to use.

## Running
This project uses Gulp (a task automation framework) to initialize, run and clean the project. Running `gulp` in the terminal from the project directory will print a help message with all the available commands. Some useful commands are
* `gulp init` - create a directory and a log file for pouchdb-server.
* `gulp generate` - put some sample data in the playground database.
* `gulp start:{nodeserver|pouchdb}` - start the node.js server or the pouchdb-server instance.
* `gulp clean:{modules|db}` - this will purge either the `node_modules` directory or the `db` directory. `gulp clean:modules` emulates a clean build command for compiled languages and `gulp clean:db` emulates a drop all databases command for SQL-type databases.

This project has two runtime options, running just PouchDB and using the REST API to interface directly with the database or runing PouchDB + a Node.js middleware layer which exposes only a limited API to clients. 

### PouchDB only option
To get started, run `gulp generate` and then run `gulp start:pouchdb`. This will create some sample data and start the pouchdb-server instance listening on port 5984. 

Now something like [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop) can be used to interact with the database directly. Some sample commands:

| To...                                          | Run...                                               |
|------------------------------------------------|------------------------------------------------------|
| Retrieve all the documents from the database   | `GET http://localhost:5984/playground/_all_docs`     |
| Retrieve a specific document from the database | `GET http://localhost:5984/playground/{doc_id}`      |
| Create a document with an auto-generated id    | `POST http://localhost:5984/playground`              |
| Create a document with a specified id          | `PUT http://localhost:5984/playground/{your_doc_id}` |
| Update a document using the `_rev` field       | `PUT http://localhost:5984/playground/{doc_id}`      |
| Delete a document using the `_rev` field       | `DELETE http://localhost:5984/playground/{doc_id}`   |
| Create a new database on the server            | `PUT http://localhost:5984/{your_db_name}`           |
| Delete a database from the server              | `DELETE http://localhost:5984/{db_name}`             |

The full HTTP API with all the parameters and the return values is detailed in the [CouchDB REST API specs](http://docs.couchdb.org/en/1.6.1/api/index.html#api). PouchDB is a version of CouchDB that is designed to run well within a browser so it has much of the same HTTP API. 

### PouchDB and Node.js middleware option
To get started with this, run `gulp generate` and `gulp start:pouchdb`. Then, in another terminal window, run `gulp start:nodeserver`. This will create sample data, run pouchdb-server on port 5984 and run a node.js server on port 8000. 

Now Postman can be used to interface with the node.js server instead of the pouchdb-server directly. Interaction with the pouchdb-server is still possible (since it is running) but a middleware layer is a good idea to run custom logic on the data being committed to the database or augmenting the features offered by the database. 

Sample requests for the node server: 

| To...                                          | Run...                                               |
|------------------------------------------------|------------------------------------------------------|
| Get information about the database             | `GET http://localhost:8000/api/info`                 |
| Retrieve all the documents from the database   | `GET http://localhost:8000/api/docs`          |
| Retrieve a specific document from the database | `GET http://localhost:8000/api/docs/{doc_id}` |
| Create a document with an auto-generated id    | `POST http://localhost:8000/api/docs`         |
| Create a document with a specified id          | `PUT http://localhost:8000/api/docs`          |
| Update a document using the `_rev` field       | `PUT http://localhost:8000/api/docs`          |
| Delete a document using the `_rev` field       | `DELETE http://localhost:8000/api/docs`       |

The full node.js API for pouch can be found at the [PouchDB API Reference](http://pouchdb.com/api.html). 