var express = require('express');
var fs = require('fs');
var busboy = require('connect-busboy');
var router = express.Router({mergeParams : true});
var Exam = require('../models/exam');
var Response = require('../models/response');
var Answer = require('../models/answer');

/* GET all responses */
router.get('/', function(req, res, next) {
    Exam.findById(req.params.exam_id).populate('responses').exec(function(err, exam){
        if (err) {
            console.error(err);
            res.send(err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(exam.responses));
        }
    });
});

/* POST create a new response */
router.post('/', function(req, res, next) {
    Exam.findById(req.params.exam_id, function(err, exam) {
        if (err) console.error(err);
        var response = new Response({ user: req.currentUser });
        response.save(function(err) {
            if(err) {
                console.error(err);
                res.send(err);
            } else {
                exam.responses.push(response);
                exam.save(function(err){
                    if(err) {
                        console.error(err);
                        res.send(err);
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify(response));
                    }
                });
            }
        });
    });
});

/* GET a response */
router.get('/:resp_id', function(req, res, next) {
    Exam.findById(req.params.exam_id, function(err, exam) {
        if (err) console.error(err);
        exam.responses.forEach(function(respId, index) {
            if(respId == req.params.resp_id){
                Response.findById(respId, function(err, response) {
                    if (err) console.error(err);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(response));
                });
            }
        });
    });
});

/* DELETE a response */
router.delete('/:resp_id', function(req, res, next) {
    Exam.findById(req.params.exam_id, function(err, exam) {
        if (err) {
            console.error(err);
            res.send(err);
        }
        exam.responses.forEach(function(respId, index) {
            if(respId == req.params.resp_id){
                Response.findByIdAndRemove(respId, function(err, response) {
                    if (err) console.error(err);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({ success: true }));
                });
            }
        });
    });
});

/* GET the file for the next question in the exam */
router.get('/:resp_id/currentQuestion', function(req, res, next) {
    Exam.findById(req.params.exam_id).populate('questions').exec(function(err, exam) {
        if(err) {
            console.error(err);
            res.send(err);
        } else if(exam) {
            console.log(exam.responses.length);
            exam.responses.forEach(function(resp, index) {
                if(resp == req.params.resp_id) {
                    Response.findById(resp, function(err, response) {
                        if(err) {
                            console.log(err);
                            res.send(err);
                        } else if(response) {
                            // TODO: Actually get the number
                            exam.findQuestionByNumber(exam, response.onNumber + 1, function(err, question) {
                                if(err) {
                                    console.error(err);
                                    res.send(err);
                                } else if(question) {
                                    res.sendFile(__dirname.replace('routes', '') + 'uploads/' + question.file);
                                } else {
                                    res.send(JSON.stringify({ done: true }));
                                }
                            });
                        } else {
                            res.status(404);
                            res.send(JSON.stringify({ message: 'Could not find the response'}))
                        }
                    });
                }
            });
        } else {
            res.send(JSON.stringify({ message: "Invalid exam ID" }))
        }
    });
});

/* POST submit the response */
router.post('/:resp_id/submit', function(req, res, next) {
    Exam.findById(req.params.exam_id, function(err, exam) {
        if (err) {
            console.error(err);
            res.send(err);
        }
        exam.responses.forEach(function(respId, index) {
            if(respId == req.params.resp_id){
                Response.findById(respId, function(err, response) {
                    if (err) {
                        console.error(err);
                        res.send(err);
                    }
                    response.submitted = true;
                    response.save();
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({ success: true }));
                });
            }
        });
    });
});

module.exports = router;