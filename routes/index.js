
/*
 * GET home page.
 */

var mongoose = require('mongoose');
var Song = mongoose.model('Song');
var Playlist = mongoose.model('Playlist');

exports.index = function(req, res) {
    if (req.user) {
        console.log(req.user.auth_type_twitter.id);
        Playlist.find({ "users": { $in: [ req.user.auth_type_twitter.id ] } }, function(err, playlists, count) {
            res.render('index', {
                title: 'My Playlists',
                playlists: playlists,
                user: req.user
            });
        });
    }
    Playlist.find(function(err, playlists, count) {
        res.render('index', {
            title: 'Playlists',
            playlists: playlists,
            user: req.user
        });
    });
};

exports.playlist = function(req, res){
    Playlist.findOne({_id: req.params.id}, function(err, playlist) {
        var owner = false;
        if (req.user && req.user.auth_type_twitter.id == playlist.users[0]) {
            owner = true;
        }
        Song.find({'playlistId': playlist.id}, function(err, songs) {
            if (songs) {
                res.render('playlist', {
                    id: playlist.id,
                    title: playlist.name,
                    owner: owner,
                    playlist: playlist,
                    songs: songs,
                    user: req.user
                });
            } else {
                res.render('playlist', {
                    id: playlist.id,
                    title: playlist.name,
                    owner: owner,
                    playlist: playlist,
                    songs: '',
                    user: req.user
                });
            }
        });
    });
};

exports.create = function(req, res) {
    new Playlist({
        name: req.body.name,
        users: [req.user.auth_type_twitter.id]
    }).save(function(err, list, count){
        res.redirect('/');
    });
};

exports.add = function(req, res){
    new Song({
        title: req.body.title,
        artist: req.body.artist,
        url: req.body.url,
        playlistId: req.body.id
    }).save(function(err, song, count){
        console.log(song);
        res.redirect('/playlist/' + req.body.id);
    });
};

exports.destroy = function(req, res) {
    Song.findById(req.params.songId, function(err, song) {
        song.remove(function(err, song) {
            res.redirect('/playlist/' + req.params.id);
        });
    });
};

exports.login = function(req, res){
    res.render('login', { title: 'Login' });
};
