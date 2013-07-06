
/*
 * GET home page.
 */

var mongoose = require('mongoose');
var Song = mongoose.model('Song');

exports.index = function(req, res){
	Song.find( function ( err, songs, count ){
		res.render('index', {
			title: 'Pitch In',
			songs: songs
		});
	});
};

exports.create = function(req, res){
	new Song({
		title: req.body.title,
		artist: req.body.artist,
		url: req.body.url
	}).save(function(err, song, count){
		res.redirect('/');
	});
};

exports.destroy = function(req, res) {
    Song.findById(req.params.id, function(err, song) {
        song.remove(function(err, song) {
            res.redirect('/');
        });
    });
};
