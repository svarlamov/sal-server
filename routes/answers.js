var express = require('express');
var config = require('../config');
var useS3 = config.s3_enabled;
if(useS3) {
  var AWS = require('aws-sdk');
  AWS.config = new AWS.Config();
  AWS.config.accessKeyId = config.s3.key;
  AWS.config.secretAccessKey = config.s3.secret;
  var s3 = new AWS.S3();
  var BUCKET_NAME = config.s3.bucket;
  createBucket(BUCKET_NAME);
}
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
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
            Response.findById(req.params.resp_id).populate('answers').exec(function(err, response) {
                if (err) {
                    console.error(err);
                    res.send(err);
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(response.answers));
                }
            });
        }
    });
});

/* POST the answer to the current question */
router.post('/', function(req, res, next) {
    Exam.findById(req.params.exam_id, function(err, exam) {
        if (err) {
            console.error(err);
            res.send(err);
        } else {
            exam.responses.forEach(function(response, index) {
                if(response == req.params.resp_id) {
                    Response.findById(response, function(err, response) {
                        if (err) {
                            console.error(err);
                            res.send(err);
                        } else if(response) {
                            response.onNumber = response.onNumber + 1;
                            response.save();
                            upload(res, req.body, response);
                        } else {
                            res.status(404);
                            res.send(JSON.stringify({ message: "Response ID invalid" }));
                        }
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

/* GET the file for an answer */
router.get('/:answer_id/file', function(req, res, next) {
    Exam.findById(req.params.exam_id, function(err, exam) {
        if (err) console.error(err);
        exam.responses.forEach(function(respId, index) {
            if(respId == req.params.resp_id){
                Response.findById(respId, function(err, response) {
                    if (err) console.error(err);
                    response.answers.forEach(function(ansId, index) {
                        if(ansId == req.params.answer_id) {
                            Answer.findById(ansId, function(err, answer) {
                                if(err) {
                                    console.error(err);
                                    res.send(err);
                                } else if(answer) {
                                  if(answer.s3){
                                    // TODO: redir to aws signed url for file
                                    res.redirect('https://' + BUCKET_NAME + '.s3.amazonaws.com/' + answer.file);
                                  } else {
                                    res.sendFile(__dirname.replace('routes', '') + 'uploads/' + answer.file);
                                  }
                                } else {
                                    res.status(404);
                                    res.json({ ok: false, reason: 'Invalid Answer or Exam Id' });
                                }
                            });
                        }
                    });
                });
            }
        });
    });
});

function upload(response, files, resp) {
    var audioPath = null;
    var videoPath = null;

    // writing audio file to disk
    audioPath = _upload(response, files.audio);

    if (files.uploadOnlyAudio) {
      var newAnswer = new Answer({ file: audioPath, number: resp.onNumber, s3: useS3 });
      newAnswer.save();
      console.log(newAnswer._id);
      resp.answers.push(newAnswer._id);
      resp.save();
      // The file is already on the disk, but if you want to use S3, then upload and release from disk
      if(useS3) {
        uploadFileToS3(newAnswer.file, __dirname.replace('routes', '') + 'uploads/' + newAnswer.file, function() {
          fs.unlink(__dirname.replace('routes', '') + 'uploads/' + newAnswer.file);
          response.json({ answer_id: newAnswer._id });
        });
      } else {
        response.json({ answer_id: newAnswer._id });
      }
    }

    if (!files.uploadOnlyAudio) {
        // writing video file to disk
        videoPath = _upload(response, files.video);
        merge(response, files, audioPath, videoPath, resp);
    }
}


// this function merges wav/webm files
function merge(response, files, audioPath, videoPath, resp) {
    // detect the current operating system
    var isWin = !!process.platform.match( /^win/ );

    if (isWin) {
        ifWin(response, files, audioPath, videoPath, resp);
    } else {
        ifMac(response, files, audioPath, videoPath, resp);
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
      if(t == type) isHasMediaType = true;
    });

    return isHasMediaType;
}
/*
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
}*/

function ifMac(response, files, audioPath, videoPath, resp) {
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
          response.status(500);
          response.send();
        } else {
          var newAnswer = new Answer({ file: files.audio.name.split('.')[0] + '-merged.webm', number: resp.onNumber, s3: useS3 });
          newAnswer.save();
          console.log(newAnswer._id);
          resp.answers.push(newAnswer._id);
          resp.save();
          // The file is already on the disk, but if you want to use S3, then upload and release from disk
          if(useS3) {
            uploadFileToS3(newAnswer.file, __dirname.replace('routes', '') + 'uploads/' + newAnswer.file, function() {
              fs.unlink(__dirname.replace('routes', '') + 'uploads/' + newAnswer.file);
              response.json({ answer_id: newAnswer._id });
            });
          } else {
            response.json({ answer_id: newAnswer._id });
          }
          // removing audio/video files
          fs.unlink(audioFile);
          fs.unlink(videoFile);
        }
    });
}

function uploadFileToS3(remoteFilename, fileName, callback) {
  var fileBuffer = fs.readFileSync(fileName);
  var metaData = getContentTypeByFile(fileName);

  s3.putObject({
    ACL: 'public-read',
    Bucket: BUCKET_NAME,
    Key: remoteFilename,
    Body: fileBuffer,
    ContentType: metaData
  }, function(error, response) {
    console.log('uploaded file[' + fileName + '] to [' + remoteFilename + '] as [' + metaData + ']');
    console.log(arguments);
    callback(error, response);
  });
}


function getContentTypeByFile(fileName) {
  var rc = 'application/octet-stream';
  var fileNameLowerCase = fileName.toLowerCase();

  if (fileNameLowerCase.indexOf('.wav') >= 0) rc = 'audio/wav';
  else if (fileNameLowerCase.indexOf('.ogg') >= 0) rc = 'audio/ogg';
  else if (fileNameLowerCase.indexOf('.webm') >= 0) rc = 'video/webm';
  else if (fileNameLowerCase.indexOf('.mp4') >= 0) rc = 'video/mp4';

  return rc;
}


function createBucket(bucketName) {
  s3.createBucket({Bucket: bucketName}, function() {
    console.log('created the bucket[' + bucketName + ']');
  });
}

module.exports = router;
