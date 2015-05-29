var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var examSchema = new Schema({
    name: String,
    password: String,
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

var Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;