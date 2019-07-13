'use strict'

var express = require('express');
var body_parser = require('body-parser');

var app = express();

// cargar routes
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');

app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

// configurar cabeceras http

// rutas base
app.use('/api', [user_routes, artist_routes, album_routes]);

module.exports = app;