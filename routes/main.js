'use strict';
var fs = require('fs');
var express = require('express');

module.exports = function (logger) {
	var app = express();
	
	// displays the page where people can auction and bid for the asset
	app.get('/auction', async function (req, res) {
		fs.readFile("web/html/view.html", function (error, pgResp) {
			if (error) {
				res.writeHead(404);
				res.write('Contents you are looking are Not Found');
			} else {
				res.writeHead(200, { 'Content-Type': 'text/html' });
				res.write(pgResp);
			}
			res.end();
		});
	});

	// a page where registration of asset is done
	app.get('/', async function (req, res) {
		fs.readFile("web/html/index.html", function (error, pgResp) {
			if (error) {
				res.writeHead(404);
				res.write('Contents you are looking are Not Found');
			} else {
				res.writeHead(200, { 'Content-Type': 'text/html' });
				res.write(pgResp);
			}
			res.end();
		});
	});


	return app;
};
