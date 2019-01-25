'use strict';
var express = require('express');
var http = require('http');
var app = express();
var cors = require('cors');
var winston = require('winston');
const bodyParser = require('body-parser');
var path = require('path');

//Utilize the configuration settings all over the module

//logger module to log messages with multi levels - @ynk(25-9-2018)
const logger = winston.createLogger({
	level: 'debug',
	transports: [
		new (winston.transports.Console)({ colorize: true, stderrLevels: ['error'] }),
	]
});

//Parse fabric_configuration.js file - @ynk(04-10-2018)
var host = 'localhost';
var port = 3001;

//Using all possible CORS methods like PUSH, GET, DELETE, PUT - @ynk(25-09-2018)
app.options('*', cors());
app.use(cors());

// Watches incoming message to verify all types of URL's or API's hitting to our server component - @ynk(25-09-2018)
app.use(function (req, res, next) {
	logger.debug('Watching for incoming message ....................');
	logger.debug('Requested Method: ' + req.method + ' URL: ', req.url);
	req.load = {};
	next();
});

app.use(bodyParser.json());

//Routes related to all initial configuration updates for starting a network
app.use('/', require('./routes/main.js')(logger));

app.use('/', require('./routes/api_routes.js')(logger));

app.use('/static', express.static(path.join(__dirname, 'web')))

//Error handling function for page not found   -@ynk(28-09-2018)
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//Sending back errors to UI in json format
app.use(function (err, req, res, next) {
	logger.debug('Errors -', req.url);
	var errorCode = err.status || 500;
	res.status(errorCode);
	req.load.error = { msg: err.stack, status: errorCode };
	if (req.load.error.status == 404) req.load.error.msg = 'file/path trying to fetch is not present';
	res.status(errorCode).json({ load: req.load });
});

//Server timeout scenarios and Address in USE Error handling - @ynk (25-09-2018)
var server = http.createServer(app).listen(port, function () { });
server.timeout = 240000;
console.log('Server starting and listening on the port :' + host + ':' + port + '');
process.on('uncaughtException', function (err) {
	logger.error('Caught exception: ', err.stack);
	if (err.stack.indexOf('EADDRINUSE') >= 0) {
		logger.error('There is a process running on ' + port + '!');
		process.exit();
	}
});
