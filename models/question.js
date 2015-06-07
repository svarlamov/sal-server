var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Exam = require('./exam');

var questionSchema = new Schema({
  number: { type: Number, required: true },
  file: { type: String, required: true }
});

questionSchema.pre('save', function(next) {
  var currentDate = new Date();
  
  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

questionSchema.pre('remove', function(next) {
    // Delete the file, because since the question is gone the file is unreferenced
    fs.unlink(__dirname.replace('models', '') + 'uploads/' + this.file);
});

questionSchema.methods.pushAndNumber = function(question, examId) {
    var Exam = require('./exam');
    Exam.findById(examId, function(err, exam) {
        if(err) {
            console.error(err);
            return;
        } else {
            question.number = exam.questions.length + 1;
            question.save();
            exam.questions.push(question._id);
            exam.save();
        }
    });
}

var Question = mongoose.model('Question', questionSchema);

module.exports = Question;