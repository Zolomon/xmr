var express = require('express'),
    jayson = require('jayson'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),

    routes = require('./routes/index'),
    users = require('./routes/users'),
    course = require('./routes/course'),
    tag = require('./routes/tag'),
    random = require('./routes/random'),
    problem = require('./routes/problem'),
    exam = require('./routes/exam'),
    
    app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path_join(__dirname, 'dist/')));

app.use('/', routes);
app.use('/users', users);
app.use('/course', course);
app.use('/tag', tag);
app.use('/random', random);
app.use('/problem', problem);
app.use('/exam', exam);

var options = {
    rcp: {
        port: 3000,
        hostname: 'localhost'
    },
    webServer: {
        port: 6006
    }
}

var client = jayson.client.tcp(options.rcp);

app.get('/', function(req, res) {
    client.request('add', [1, 1], function(err, error, response) {
        if (err) throw err;
        else {
            console.log(response);
            res.send(''+response);
        }
    });
});

app.get('/courses', function(req, res) {
    client.request('getAllCourses', [], function(err, error, response) {
        if (err) throw err;
        else {
            console.log(response);
            res.send(response);
        }
    });
});

app.get('/courses/:id', function(req, res) {
    client.request('getCourse', [req.params.id], function(err, error, response) {
        if(err)throw err;
        else {
            console.log(response);
            res.send(response);
        }
    });
});

console.log('Backend has started: ' + options.webServer.port);

app.listen(options.webServer.port);
