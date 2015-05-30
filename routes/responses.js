var express = require('express');
var fs = require('fs');
var busboy = require('connect-busboy');
var router = express.Router({mergeParams : true});
var Exam = require('../models/exam');
var Response = require('../models/response');

/* GET all responses */
router.get('/', function(req, res, next) {
    Exam.findById(req.params.exam_id, function(err, exam){
        if (err) {
            console.error(err);
            res.send(err);
        } else {
            /*
            var responses = [exam.responses.length];
            exam.responses.forEach(function(resp, index){
                Response.findById(resp, function(err, res){
                    if (err) console.error(err);
                    responses[index] = res;
                });
            });
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(responses));
            */
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(exam.populate('responses').responses));
        }
    })
});

/* POST create a new response */
router.post('/', function(req, res, next) {
    Exam.findById(req.params.exam_id, function(err, exam) {
        if (err) console.error(err);
        var response = new Response({ name: req.param('name'), email: req.param('email') });
        response.save(function(err) {
            if(err) {
                console.error(err);
                res.send(err);
            } else {
                exam.responses.push(response);
                exam.save(function(err){if(err) console.error(err);});
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(response));
            }
        });
    });
});

/* GET a response */
router.get('/:resp_id', function(req, res, next) {
    Exam.findById(req.params.exam_id, function(err, exam) {
        if (err) console.error(err);
        exam.responses.forEach(function(respId, index) {
            console.log("respId = " + respId + ", and resp_id = " + req.params.resp_id);
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

module.exports = router;