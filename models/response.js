var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var responseSchema = new Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' },
  answers: [{ type: mongoose.Schema.ObjectId, ref: 'Answer' }],
  submitted: { type: Boolean, default: false },
  onNumber: { type: Number, default: 0 },
  created_at: Date,
  updated_at: Date
});

responseSchema.pre('save', function(next) {
  var currentDate = new Date();
  
  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

var Response = mongoose.model('Response', responseSchema);

module.exports = Response;