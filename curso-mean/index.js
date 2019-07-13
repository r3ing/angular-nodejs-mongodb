'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3977;

mongoose.connect('mongodb://localhost:27017/curso_mean', { useNewUrlParser: true }, (err, res) => {
    if (err) {
        throw err;
    } else {
        app.listen(port, function () {
            console.log('Server app running in port ' + port + '....');
        });
        console.log('Connection DB is sucessful....');
    }
});