var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Session = require('../models/session');

/* GET all questions for the exam */
router.post('/', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    console.log("before query");
    User.findOne({ email: email }, 'email auth_provider', function(err, user) {
        console.log("First line of user find callback");
        if (err) {
            console.log("error");
            console.error(err);
            res.send(err);
        } else {
            if(!user) {
                console.log("This is a new user");
                // Create a new user
                // TODO: Do dynamic authprovider selection
                var newUser = new User({ email: email, auth_provider: 'cranbrook'});
                newUser.authenticate(email, password, function(err, session){
                    if (err) {
                        console.error(err);
                        res.send(err);
                    } else {
                        if (!session){
                            // The user is unauthorized
                            res.status(401);
                            res.send(JSON.stringify({ auth: false }));
                        } else {
                            // Authentication Succeeded
                            // Save the user, since we know he's legit
                            newUser.save();
                            res.setHeader('Content-Type', 'application/json');
                            var authObj = { auth: true, session: session._id };
                            res.send(JSON.stringify(authObj));
                        }
                    }
                });
            } else {
                console.log("This user already exists");
                //log in an existing user
                user.authenticate(email, password, function(err, session){
                    if (err) {
                        console.error(err);
                        res.send(err);
                    } else {
                        if (!session){
                            // The user is unauthorized
                            res.status(401);
                            res.send(JSON.stringify({ auth: false }));
                        } else {
                            // Authentication Succeeded
                            res.setHeader('Content-Type', 'application/json');
                            var authObj = { auth: true, session: session._id };
                            res.send(JSON.stringify(authObj));
                        }
                    }
                });
            }
        }
    });
});

module.exports = router;