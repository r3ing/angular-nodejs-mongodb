'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongShema = Schema({
    numero: Number,
    name: String,
    duration: String,
    file: String,
    album: {
        type: Schema.ObjectId,
        ref: 'Album'
    }
});

module.exports = mongoose.model('Song', SongShema);