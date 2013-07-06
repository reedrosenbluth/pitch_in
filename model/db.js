var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var songSchema = new Schema({
    title: String,
    artist: String,
    url: String
});

// var playlistSchema = new Schema({
//     name: String,
//     songs: [Schema.Types.ObjectId]
// });

mongoose.model('Song', songSchema);
// mongoose.model('Playlist', playlistSchema);

mongoose.connect('mongodb://localhost/pitch_in');
