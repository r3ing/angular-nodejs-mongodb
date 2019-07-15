'use strict'

var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var song = require('../models/song');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res) {
    var id = req.params.id;

    Song.findById(id).populate({
        path: 'album'
    }).exec((err, song) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la peticion'
            });
        } else {
            if (!song) {
                res.status(404).send({
                    message: 'La cancion no existe !!'
                });
            } else {
                res.send({
                    song
                });
            }
        }
    });
}

function getSongs(req, res) {

    var albumId = req.params.album;

    if (!albumId) {
        var find = Song.find().sort('number');
    } else {
        var find = Song.find({ album: albumId }).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
            }
        }).exec((err, songs) => {
            if (err) {
                res.status(500).send({
                    message: 'Error en la peticion'
                });
            } else {
                if (!songs) {
                    res.status(404).send({message: 'No hay canciones !!'});
                } else {
                    res.send({songs});
                }
            }
        });
}

function saveSong(req, res) {
    var song = new Song();

    song.number = req.body.number;
    song.name = req.body.name;
    song.duration = req.body.duration;
    song.file = 'null';
    song.album = req.body.album;

    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({
                message: 'Error al guardar la cancion'
            });
        } else {
            res.send({
                song: songStored
            });
        }
    });
}

function updateSong(req, res) {

    var id = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(id, update, (err, songUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'Error al actualizar la cancion'
            });
        }

        if (!songUpdated) {
            res.status(404).send({
                message: 'No se ha podido actualizar la cancion'
            });
        } else {
            res.send({
                song: songUpdated
            });
        }
    });
}

function deleteSong(req, res) {

    var id = req.params.id;

    Song.findByIdAndRemove(id, (err, songRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error al eliminar la cancion' });
        } else { 
            if (!songRemoved) { 
                res.status(404).send({
                    message: 'No se pudo eliminar cancion'
                });
            } else {
                res.send({song: songRemoved});
            }
        }
    });
}

function uploadFile(req, res) {
    var songId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.file.path;
        var file_name = file_path.split('\\')[2];
        var file_ext = file_name.split('.')[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            song.findByIdAndUpdate(songId, {
                file: file_name
            }, (err, songUpdated) => {
                if (!songUpdated) {
                    res.status(404).send({
                        message: 'No se ha podido actualizar el songa'
                    });
                } else {
                    res.send({
                        song: songUpdated
                    });
                }
            });
        } else {
            res.status(500).send({
                message: 'Extension del archivo no valida'
            });
        }
    } else {
        res.status(200).send({
            message: 'No has subido ninguna imagen'
        });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/songs/' + imageFile;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send('No exixste la imagen...');
        }
    });
}


module.exports = {
    getSong,
    getSongs,
    saveSong,
    updateSong,
    deleteSong,
    uploadFile,
    getImageFile
};