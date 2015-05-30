var express = require('express');
var router = express.Router();
var Exam = require('../models/exam');

router.get('/', function(req, res, next) {
    Exam.find({ user: req.currentUser._id }, '_id name created_at', function(err, exams) {
        if(err) {
            console.error(err);
            res.send(err);
        } else {
            if(exams) {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(exams));
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({}));
            }
        }
    });
});

/* POST creates a new exam */
router.post('/', function(req, res, next) {
    if(!req.body.name) {
        res.status(400);
        res.send({ error: "Your request must contain a name in the body" });
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