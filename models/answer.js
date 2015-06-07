var mongoose = require('mongoose');
var fs = require('fs');
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

answerSchema.pre('remove', function(next) {
    // Delete the file, because since the answer is gone the file is unreferenced
    var p = __dirname.replace('models', '') + 'uploads/' + this.file;
    fs.exists(p, function(exists) {
        if(exists) {
            fs.unlink(p);
            console.log("File with path, " + __dirname.replace('models', '') + 'uploads/' + this.file + ", has been removed");
            next();
        } else {
            next();
        }
    });
});

var Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;