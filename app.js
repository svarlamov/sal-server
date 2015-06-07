var express = require('express');
var path = require('path');
var url = require('url');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var busboy = require('connect-busboy');
var mongoose = require('mongoose');
var lessMiddleware = require('less-middleware');
var User = require('./models/user');
var Session = require('./models/session');

var routes = require('./routes/index');
var exams = require('./routes/exams');
var responses = require('./routes/responses');
var questions = require('./routes/questions');
var answers = require('./routes/answers');
var loginCtrlr = require('./routes/login');
var logoutCtrlr = require('./routes/logout');

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
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '500mb' }));
app.use(cookieParser());
app.use(lessMiddleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
// If a session was supplied, set the current user
app.use('/api/v1', function(req, res, next) {
    var path = url.parse(req.url).pathname;
    if(path == '/login'){
        var sessionId = req.body.session;
        if(!sessionId) {
            sessionId = req.query.session;
        }
        if(!sessionId){
            sessionId = req.params.session;
        }
        if(mongoose.Types.ObjectId.isValid(sessionId)){
            Session.findById(sessionId).populate('user').exec(function(err, ses) {
                if (ses) {
                    req['currentUser'] = ses.user;
                    req['sessionId'] = ses._id;
                    res.setHeader('Content-Type', 'application/json');
                    var authObj = { auth: true, session: req.sessionId };
                    res.send(JSON.stringify(authObj));
                    console.log("The current user is, " + req.currentUser);
                    return;
                }
            });
        } else {
            next();
        }
    } else {
        var sessionId = req.body.session;
        if(!sessionId) {
            sessionId = req.query.session;
        }
        if(!sessionId){
            sessionId = req.params.session;
        }
        if(mongoose.Types.ObjectId.isValid(sessionId)){
            Session.findById(sessionId).populate('user').exec(function(err, ses) {
                if (err) {
                    console.error(err);
                    res.status(500);
                    res.send(err);
                } else if (ses) {
                    req['currentUser'] = ses.user;
                    req['sessionId'] = ses._id;
                    console.log("The current user is, " + req.currentUser.email);
                    next();
                } else {
                    failObj = { auth: false, error: sessionId + " session is invalid" };
                    res.status(401);
                    res.send(failObj);
                }
            });
        } else {
            failObj = { auth: false, error: "You must provide a valid session id" };
            res.status(401);
            res.send(failObj)
        }
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
app.use('/api/v1/exams/:exam_id/responses/:resp_id/answers', answers);
// API Logout
app.use('/api/v1/logout', logoutCtrlr);

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
  console.log(err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
