'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistShema = Schema({
    name: String,
    description: String,    
    image: String
});

module.exports = mongoose.model('Artist', ArtistShema);