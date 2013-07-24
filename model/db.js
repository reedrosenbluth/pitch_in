var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var songSchema = new Schema({
    title: String,
    artist: String,
    url: String,
    playlistId: String
});

 var playlistSchema = new Schema({
     name: String
 });

var userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    accounts: []
});

mongoose.model('Song', songSchema);
mongoose.model('User', userSchema);
mongoose.model('Playlist', playlistSchema);

var uristring = 
    process.env.MONGOLAB_URI || 
    process.env.MONGOHQ_URL || 
    'mongodb://localhost/pitch_in';

mongoose.connect(uristring, function (err, res) {
    if (err) { 
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});
