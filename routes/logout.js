var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Session = require('../models/session');

/* POST log the user out */
router.post('/', function(req, res, next) {
    if(!req.currentUser || !req.sessionId) {
        res.status(400);
        res.send(JSON.stringify({ success: false, message: 'You must be logged in, to log out' }));
        return;
    }
    Session.findById(req.sessionId, function(err, session) {
        if(err) {
            console.error(err);
            res.status(500);
            res.send(err);
        } else if(session) {
            session.remove();
            res.send(JSON.stringify({ success: true }));
        } else {
            res.status(404);
            res.send(JSON.stringify({ success: false, message: 'The session ID provided could not be found'}));
        }
    });
});

module.exports = router;