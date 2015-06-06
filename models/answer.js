var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new Schema({
  number: { type: Number, required: true },
  file: { type: String, required: true },
  created_at: Date,
  updated_at: Date
});

answerSchema.pre('save', function(next) {
  var currentDate = new Date();
  
  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

var Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;