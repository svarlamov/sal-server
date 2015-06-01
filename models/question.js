var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Exam = require('./exam');

var questionSchema = new Schema({
  number: Number,
  file: String
});

questionSchema.pre('save', function(next) {
  // TODO: Actually set the number of the question
  this.number = 1;
    
  var currentDate = new Date();
  
  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

questionSchema.methods.pushToExam = function(question, examId) {
    Exam.findById(examId, function(err, exam) {
        if(err) {
            console.error(err);
            return;
        } else {
            exam.questions.push(question._id);
            exam.save();
        }
    })
}

var Question = mongoose.model('Question', questionSchema);

module.exports = Question;