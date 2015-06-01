var express = require('express');
var config = require('../config');
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
//var busboy = require('connect-busboy');
var router = express.Router({mergeParams : true});
var Question = require('../models/question');

/* GET all questions for the exam */
router.get('/', function(req, res, next) {
    var examId = req.params.exam_id
    res.send('Returning all files for exam ' + examId);
});

/* POST upload question for the exam */
router.post('/', function(req, res, next) {
    var examId = req.params.exam_id;
    upload(res, req.body, examId);
});

/* GET question for the exam */
router.get('/:question_id/file', function(req, res, next) {
    var questionId = req.params.question_id;
    var examId = req.params.exam_id;
    Question.findById(questionId, function(err, question) {
        if(err) {
            console.error(err);
            res.send(err);
        } else {
            console.log("Sending file to user");
            res.sendFile('../uploads/' + question.file);
        }
    });
});

function upload(response, files, examId) {
    var audioPath = null;
    var videoPath = null;

    // writing audio file to disk
    audioPath = _upload(response, files.audio);

    if (files.uploadOnlyAudio) {
        var newQuestion = new Question({ file: audioPath });
        newQuestion.save();
        console.log(newQuestion._id);
        newQuestion.pushToExam(newQuestion._id, examId)
        response.status(200);
        response.setHeader('Content-Type', 'application/json');
        response.send(newQuestion._id);
    }

    if (!files.uploadOnlyAudio) {
        // writing video file to disk
        videoPath = _upload(response, files.video);
        merge(response, files, audioPath, videoPath, examId);
    }
}


// this function merges wav/webm files
function merge(response, files, audioPath, videoPath, examId) {
    // detect the current operating system
    var isWin = !!process.platform.match( /^win/ );

    if (isWin) {
        ifWin(response, files, audioPath, videoPath, examId);
    } else {
        ifMac(response, files, audioPath, videoPath, examId);
    }
}

function _upload(response, file) {
    var fileRootName = file.name.split('.').shift(),
        fileExtension = file.name.split('.').pop(),
        filePathBase = config.upload_dir + '/',
        fileRootNameWithBase = filePathBase + fileRootName,
        filePath = fileRootNameWithBase + '.' + fileExtension,
        fileID = 2,
        fileBuffer;

    while (fs.existsSync(filePath)) {
        filePath = fileRootNameWithBase + '(' + fileID + ').' + fileExtension;
        fileID += 1;
    }

    file.contents = file.contents.split(',').pop();

    fileBuffer = new Buffer(file.contents, "base64");
    console.log(filePath);

    fs.writeFileSync(filePath, fileBuffer);
    
    return filePath;
}

function hasMediaType(type) {
    var isHasMediaType = false;
    ['audio/wav', 'audio/ogg', 'video/webm', 'video/mp4'].forEach(function(t) {
      if(t== type) isHasMediaType = true;
    });
    
    return isHasMediaType;
}

function ifWin(response, files, audioPath, videoPath) {
    // following command tries to merge wav/webm files using ffmpeg
    var merger = __dirname + '\\merger.bat';
    var audioFile = __dirname + '\\uploads\\' + files.audio.name;
    var videoFile = __dirname + '\\uploads\\' + files.video.name;
    var mergedFile = __dirname + '\\uploads\\' + files.audio.name.split('.')[0] + '-merged.webm';

    // if a "directory" has space in its name; below command will fail
    // e.g. "c:\\dir name\\uploads" will fail.
    // it must be like this: "c:\\dir-name\\uploads"
    var command = merger + ', ' + audioFile + " " + videoFile + " " + mergedFile + '';
    exec(command, function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
        } else {
            //response.status(200);
            //response.setHeader('Content-Type', 'application/json');
            //response.send(files.audio.name.split('.')[0] + '-merged.webm');
            // removing audio/video files
            fs.unlink(audioFile);
            fs.unlink(videoFile);
            // Return the name of the newly created file
            return files.audio.name.split('.')[0] + '-merged.webm';
        }
    });
}

function ifMac(response, files, audioPath, videoPath, examId) {
    // its probably *nix, assume ffmpeg is available
    //var audioFile = __dirname + '/uploads/' + files.audio.name;
    //var videoFile = __dirname + '/uploads/' + files.video.name;
    //var mergedFile = __dirname + '/uploads/' + files.audio.name.split('.')[0] + '-merged.webm';
    var actualDirname = __dirname.replace('/routes', '');
    var audioFile = actualDirname + '/uploads/' + files.audio.name;
    var videoFile = actualDirname + '/uploads/' + files.video.name;
    var mergedFile = actualDirname + '/uploads/' + files.audio.name.split('.')[0] + '-merged.webm';
    
    var util = require('util'),
        exec = require('child_process').exec;

    var command = "ffmpeg -i " + audioFile + " -i " + videoFile + " -map 0:0 -map 1:0 " + mergedFile;

    exec(command, function (error, stdout, stderr) {
        if (stdout) console.log(stdout);
        if (stderr) console.log(stderr);

        if (error) {
            console.log('exec error: ' + error);
            response.status(404);
            response.send();
        } else {
            var newQuestion = new Question({ file: files.audio.name.split('.')[0] + '-merged.webm' });
            newQuestion.save();
            console.log(newQuestion._id);
            newQuestion.pushToExam(newQuestion, examId);
            response.status(200);
            response.setHeader('Content-Type', 'application/json');
            response.send({ exam_id: examId, question_id: newQuestion._id });
            // removing audio/video files
            fs.unlink(audioFile);
            fs.unlink(videoFile);
        }

    });
}

module.exports = router;