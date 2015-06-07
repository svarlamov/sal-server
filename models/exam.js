var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Question = require('./question');
var Response = require('./response');

var examSchema = new Schema({
    name: String,
    password: String,
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    questions: [{ type: mongoose.Schema.ObjectId, ref: 'Question' }],
    responses: [{ type: mongoose.Schema.ObjectId, ref: 'Response' }],
    created_at: Date,
    updated_at: Date
});

examSchema.pre('save', function(next) {
    var currentDate = new Date();
  
    this.updated_at = currentDate;

    if (!this.created_at)
        this.created_at = currentDate;
    next();
});

examSchema.pre('remove', function(next) {
    this.questions.forEach(function(questionId, index) {
        Question.findById(questionId, function(err, question) {
            if(err) {
                // TODO: Do something with the error. This is a weird place to have one...
                console.error(err);
            } else {
                question.remove();
            }
        });
    });
    
    this.responses.forEach(function(responseId, index) {
        Response.findById(responseId, function(err, response) {
            if(err) {
                // TODO: Do something with the error. This is a weird place to have one...
                console.error(err);
            } else {
                response.remove();
            }
        });
    });
    
    next();
});

examSchema.methods.findQuestionByNumber = function(exam, number, callback) {
    if(exam.questions.length < number) {
        console.log("There are no more questions");
        callback(null, null);
        return;
    }
    var calledAlready = false;
    exam.questions.forEach(function(question, index) {
        console.log(question);
        if(question.number === number) {
            console.log("We have equality!");
            Question.findById(question._id, function(err, q) {
                if(!calledAlready) {
                    calledAlready = true;
                    callback(err, q);
                }
            });
        }
    });
}

var Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;