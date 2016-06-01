/*eslint no-console: 0*/
/*eslint-env node*/
require('console-stamp')(console, {pattern: 'yyyy-mm-dd HH:MM:ss.l'});
var express = require('express'),
    //jayson = require('jayson'),
    //path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config/config.json')[env],
    index = require('./routes/index'),
    helmet = require('helmet'),

    app = express();

//app.use(logger('[:mydate] :method :url :status :res[content-length] - :remote-addr - :response-time ms'));
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('public'));

app.use('/', index);

console.log('Backend has started: ' + config.webserver.port);

app.listen(config.webserver.port);
