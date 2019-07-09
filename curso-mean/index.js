'use strict'

var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/curso_mean', (err, res) => { 
    if (err) {
        throw err;
    } else { 
        console.log('Connection DB is sucessful....');
    }
});