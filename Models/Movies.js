const mongoose = require('mongoose');

const MoviesSchema = mongoose.Schema({
  show_id: {
    type: String,
  },
  type: String,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
});

module.exports = mongoose.model('Movies', MoviesSchema);
