const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const logger = require('morgan');
const debug = require('debug')('meanApp:server');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const http = require('http');
const app = express();
const dbURL = require('./server/models/database');
const api = require('./server/routes/api');
const member = require('./server/routes/member');
const sendJSONresponse = require('./server/lib/response');
require('./server/auth/passport')(passport);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cookieParser());
/*app.use(cookieSession({
  name:'local',
  keys:['@#$!c561efopApokpeoF'],
  maxAge:24*60*60*1000*7
}));*/
app.use(passport.initialize());
app.use(passport.session());
app.use(function(err, req, res, next) {
  if(err.name == 'UnauthorizedError') {
    sendJSONresponse(res, 401, {message: err.name + ':' +err.message});
  }
});

app.use('/api', api);
app.use('/member', member);

//connect database
/*mongoose.connect(dbURL);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('database connect success!');
});*/

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Server config
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost:${port}`));
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
