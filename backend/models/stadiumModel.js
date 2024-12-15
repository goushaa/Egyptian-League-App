const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const stadiumSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  rows: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  rowSeats: {
    type: Number,
    required: true,
    min: 5,
    max: 10,
  },
}, {
  collection: 'stadiums',
  timestamps: true,
});

const Stadium = model('Stadium', stadiumSchema);

module.exports = Stadium;
