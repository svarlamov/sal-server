var express = require('express');
var router = express.Router();
var Exam = require('../models/exam');

/* POST creates a new exam */
router.post('/', function(req, res, next) {
    if(req.currentUser == null) {
        res.status(401);
        res.send("You must login to create an exam");
        return;
    }
    if(!req.body.name) {
        res.status(400);
        res.send("Your request must contain a name in the body");
        return;
    }
    var exam = new Exam({ user: req.currentUser._id, name: req.body.name });
    exam.save(function(err) {
        if(err) {
            console.error(err);
            res.send(err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(exam));
        }
    });
});

/* GET an exam */
router.get('/:exam_id', function(req, res, next) {
    Exam.findById(req.params.exam_id, function(err, exam) {
        if(err) {
            console.error(err);
            res.send(err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(exam));
        }
    });
});

module.exports = router;