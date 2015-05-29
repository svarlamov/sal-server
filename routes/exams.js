var express = require('express');
var router = express.Router();
var Exam = require('../models/exam');

/* GET render exam creation screen */
router.get('/create', function(req, res, next) {
    res.render('create_exam', {});
});

/* POST creates a new exam */
router.post('/', function(req, res, next) {
    var exam = new Exam();
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