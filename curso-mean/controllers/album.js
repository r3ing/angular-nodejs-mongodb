'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');



function getAlbum(req, res) {

    var id = req.params.id;

    Album.findById(id).populate({path: 'artist'}).exec((err, album) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la peticion'
            });
        } else {
            if (!album) {
                res.status(404).send({
                    message: 'El album no existe'
                });
            } else {
                res.send({
                    album
                });
            }
        }
    });
}

function getAlbums(req, res) {

    var artistId = req.params.artist;

    if (!artistId) {
        var find = Album.find().sort('title'); 
    } else { 
        var find = Album.findById({ artist: artistId }).sort('year');
    }

    find.populate({ path: 'artist' }).exec((err, albums) => { 
        if (err) {
            res.status(500).send({
                message: 'Error en la peticion'
            });
        } else {
            if (!albums) {
                res.status(404).send({
                    message: 'No hay albums !!'
                });
            } else {
                res.send({albums});
            }
        }
    });   
}

function saveAlbum(req, res) {
    var album = new Album();

    album.title = req.body.title;
    album.description = req.body.description;
    album.year = req.body.year;
    album.image = 'null';//req.body.image;
    album.artist = req.body.artist;

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({
                message: 'Error al guardar el album'
            });
        } else {
            res.send({
                album: albumStored
            });
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums
};