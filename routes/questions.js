var express = require('express');
var fs = require('fs');
var busboy = require('connect-busboy');
var router = express.Router({mergeParams : true});

/* GET all questions for the exam */
router.get('/', function(req, res, next) {
    var examId = req.params.exam_id
    res.send('Returning all files for exam ' + examId);
});

/* POST upload question for the exam */
router.post('/', function(req, res, next) {
    var examId = req.params.exam_id;
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 
        fstream = fs.createWriteStream(__dirname + '/../files/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            res.redirect('back');
        });
    });
});

/* GET question for the exam */
router.get('/:question_id', function(req, res, next) {
    var questionId = req.params.question_id;
    var examId = req.params.exam_id;
    res.send('Returning question ' + questionId + ' for exam ' + examId);
});

module.exports = router;