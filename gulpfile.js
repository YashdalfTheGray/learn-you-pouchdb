// include some modules to use with gulp.
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    nodemon = require('gulp-nodemon'),
    chalk = require('chalk'),
    del = require('del'),
    file = require('gulp-file'),
    os = require('os'),
    exec = require('child_process').exec;

// this splits up a passed in command into the command name and arguments.
var commandBuilder = function(command) {
    "use strict";

    var cmd = {};
    var cmdArr = command.split(' ');
    cmd.exec = cmdArr.shift();
    cmd.args = cmdArr;
    return cmd;
};

// this runs a command passed into it by passing it to the shell/terminal.
var runCommand = function(command, description, cb) {
    "use strict";

    if (typeof command.exec === 'undefined') {
        command = commandBuilder(command);
    }

    var child = exec(command.exec, command.args);
    child.stdout.on('data', function(data) {
        process.stdout.write(data);
    });
    child.stderr.on('data', function(data) {
        process.stdout.write(chalk.red(data));
    });
    child.on('error', function(error) {
        console.log(error);
    });

    return child;
};

// define the default gulp task. Running 'gulp' will
// run the default task which, in this case, will show 
// the usage. 
gulp.task('default', ['usage']);

// leave documentation about what the other tasks 
// declared in the gulpfile do. 
gulp.task('usage', function() {
    "use strict";

    var usageLines = [
        '',
        '',
        chalk.green('usage'),
        '\tdisplay this help page.',
        '',
        '',
        chalk.green('init'),
        '\tinitializes the db directory for PouchDB.',
        '',
        chalk.green('start:nodeserver'),
        '\tstarts the node server at port 8000.',
        '',
        chalk.green('start:pouchdb'),
        '\tstarts the pouchdb server at port 5984.',
        '',
        chalk.green('clean:modules'),
        '\tdeletes the npm_modules directory.',
        '\t' + chalk.magenta('NOTE:') + ' ' + chalk.green('npm install') +
        ' will be required before running anything else.',
        '',
        chalk.green('clean:db'),
        '\tdeletes the db directory, deleting the database and logs',
        '\t' + chalk.magenta('NOTE:') + ' pouchdb server cannot ' + 
        'be running when this command is run.',
        '\t' + chalk.magenta('NOTE:') + ' ' + chalk.green('gulp init') +
        ' will be required before running the pouchdb server.',
        ''
    ];

    gutil.log(usageLines.join(os.EOL));
});

gulp.task('init', function() {
    "use strict";
    return file('log.txt', '')
        .pipe(gulp.dest('db'));
});

gulp.task('start:nodeserver', function() {
    "use strict";
    nodemon({ 
        script: 'src/server.js',
        watch: 'src/server.js' 
    });
});

gulp.task('start:pouchdb', function(cb) {
    "use strict";
    var command = 'pouchdb-server c';
    runCommand(command, 'PouchDB server', cb);
    gutil.log('PouchDB server is now ' + chalk.green('running') + ' on port ' + chalk.cyan('5984') + '. ');
});

gulp.task('clean:modules', function() {
    return del('node_modules');
});

gulp.task('clean:db', function() {
    return del('db');
});