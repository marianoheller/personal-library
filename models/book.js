var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

var bookSchema = new Schema({
  title: { type: String, required: true },
  comments: { type: Array, default: [] }
});


bookSchema.post('save', function(doc) {
  console.log('%s has been saved', doc._id);
});


var Book = mongoose.model('Book', bookSchema);

module.exports = Book;