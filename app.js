var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var mongoose = require('mongoose');
var lessMiddleware = require('less-middleware');
var User = require('./models/user');
var Session = require('./models/session');

var routes = require('./routes/index');
var exams = require('./routes/exams');
var responses = require('./routes/responses');
var questions = require('./routes/questions');
var answers = require('./routes/answers');
var loginCtrlr = require('./routes/login')

var app = express();
mongoose.connection.on('error', function(err) {
    console.error('MongoDB error: %s', err);
});
mongoose.connect('mongodb://localhost/sal_development');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(busboy());
app.use(cookieParser());
app.use(lessMiddleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
// If a session was supplied, set the current user
app.use('/api', function(req, res, next) {
    if(req.body.session){
        Session.findById(req.body.session, function(err, ses) {
            if (err) {
                console.error(err);
                res.send(err);
            } else {
                // If we found a session
                if(ses) {
                    User.findById(ses.user, function(err, user) {
                        if (err) {
                            console.error(err);
                            res.send(err);
                        } else {
                            req['currentUser'] = user;
                            req['sessionId'] = ses._id;
                            console.log("The current user is " + req.currentUser.email);
                            next();
                        }
                    });
                } else {
                    req['currentUser'] = null;
                    next();
                }
            }
        });
    }
});

// Index
app.use('/', routes);
// API Login
app.use('/api/v1/login', loginCtrlr);
// Exams
app.use('/api/v1/exams', exams);
// Questions
app.use('/api/v1/exams/:exam_id/questions', questions);
// Responses
app.use('/api/v1/exams/:exam_id/responses', responses);
// Answers
app.use('/api/v1/exams/:exam_id/responses/:response_id/answers', answers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
