var express = require('express');
var router = express.Router();
var Exam = require('../models/exam');
var Response = require('../models/response');
var User = require('../models/user');
var Answer = require('../models/answer');

/* GET all of a user's exams */
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
        res.send({ message: "Your request must contain a name in the body of the request" });
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
    Exam.findById(req.params.exam_id).lean().populate('questions responses').exec(function(err, exam) {
        Response.populate(exam.responses, {
            path: 'user',
            select: 'email',
            model: User
        }, function(err, populatedResps) {
            if(err) {
                console.error(err);
                res.send(err);
            } else {
                Response.populate(populatedResps, {
                    path: 'answers',
                    model: Answer
                }, function(err, morePopulusResps) {
                    console.log(morePopulusResps);
                    res.setHeader('Content-Type', 'application/json');
                    var newObj = exam;
                    newObj.responses = morePopulusResps;
                    res.send(JSON.stringify(newObj));
                });
            }
        });
        
    });
});

/* GET question count */
router.get('/:exam_id/questionCount', function(req, res, next) {
    Exam.findById(req.params.exam_id, function(err, exam) {
        if(err) {
            console.error(err);
            res.send(err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ count: exam.questions.length }));
        }
    });
});

/* DELETE an exam */
router.delete('/:exam_id', function(req, res, next) {
    Exam.findById(req.params.exam_id, function(err, exam) {
        if(err) {
            console.error(err);
            res.send(err);
        } else {
            exam.remove();
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ deleted: true }));
        }
    });
});

module.exports = router;