
/**
 * Module dependencies.
 */

var express = require('express')
  , db = require('./model/db')
  , passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , glue = require('passport-glue')
  , mongoose = require('mongoose')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'my secret' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));
app.locals.pretty = true;

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


var userSchema = glue.userSchema;
userSchema.plugin(glue.twitter_oauth1a_plugin);
userSchema.plugin(glue.persistent_sessions_plugin);
mongoose.model('User', userSchema);
var User = mongoose.model('User');

passport.use(new TwitterStrategy({
      consumerKey: '5FIHaX8cYm0oYZRtEFSNw',
      consumerSecret: 'JI6xGoxPtC7zcZfT1g9sHhDuVVxPt6aVSejhKyNJE',
      callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
    },
    function (token, tokenSecret, profile, done) {
      User.findOrCreateTwitterUser(token, tokenSecret, profile, done);
    }
));

passport.serializeUser(function (user, done) {
    User.serializeUser(user, done);
});

passport.deserializeUser(function (obj, done) {
    User.deserializeUser(obj, done);
});

app.get('/', routes.index);
app.get('/playlist/:id', routes.playlist);
app.get('/login', routes.login);
app.get('/users', user.list);
app.get('/destroy/:id', routes.destroy);
app.post('/add', routes.add);
app.post('/create', routes.create);

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
