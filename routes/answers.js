var express = require('express');
var fs = require('fs');
var busboy = require('connect-busboy');
var Exam = require('../models/exam');
var Response = require('../models/response');
var Answer = require('../models/answer');
var router = express.Router({mergeParams : true});

/* GET all answers */
router.get('/', function(req, res, next) {
    Exam.findById(req.params.exam_id, function(err, exam) {
        if (err) {
            console.error(err);
            res.send(err);
        } else {
            Response.findById(req.params.resp_id, function(err, response) {
                if (err) {
                    console.error(err);
                    res.send(err);
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(exam.populate('responses').responses.answers));
                }
            });
        }
    });
});

/* POST create a new answer */
router.post('/', function(req, res, next) {
    Exam.findById(req.params.exam_id, function(err, exam) {
        if (err) {
            console.error(err);
            res.send(err);
        } else {
            Response.findById(req.params.resp_id, function(err, response) {
                if (err) {
                    console.error(err);
                    res.send(err);
                } else {
                    var fstream;
                    req.pipe(req.busboy);
                    req.busboy.on('file', function (fieldname, file, filename) {
                        console.log("Uploading: " + filename); 
                        fstream = fs.createWriteStream(__dirname + '/files/' + filename);
                        file.pipe(fstream);
                        fstream.on('close', function () {
                            var answer = new Answer({ number: req.param('number'), file: pathToFile });
                            answer.save(function(err) {
                                if (err) {
                                    console.error(err);
                                    res.send(err);
                                } else {
                                    res.setHeader('Content-Type', 'application/json');
                                    res.send(JSON.stringify(answer));
                                }
                            });
                        });
                    });
                }
            });
        }
    });
});

/* GET an answer */
router.get('/:answer_id', function(req, res, next) {
    Exam.findById(req.params.exam_id, function(err, exam) {
        if (err) console.error(err);
        exam.responses.forEach(function(respId, index) {
            if(respId == req.params.resp_id){
                Response.findById(respId, function(err, response) {
                    if (err) console.error(err);
                    response.answers.forEach(function(ansId, index) {
                        if(ansId == req.parmams.answer_id) {
                            Answer.findById(ansId, function(err, answer) {
                                res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify(answer));
                            });
                        }
                    });
                });
            }
        });
    });
});

module.exports = router;