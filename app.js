
/**
 * Module dependencies.
 */

var express = require('express')
  , db = require('./model/db')
  , passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
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
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));
app.locals.pretty = true;

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/playlist/:id', routes.playlist);
app.get('/login', routes.login);
app.get('/users', user.list);
app.get('/destroy/:id', routes.destroy);
app.post('/add', routes.add);
app.post('/create', routes.create);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
