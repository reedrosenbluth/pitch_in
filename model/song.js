var mongoose = require('mongoose');

exports.song = function song(name, callback) {
    var Song = mongoose.model('Song');
    Song.find({'name': name}, function (err, song) {
        callback("",song);
    })
}
