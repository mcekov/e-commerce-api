const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minLength: 3,
    maxLength: 50,
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    minLength: 10,
    maxLength: 150,
  },
  image: {
    type: String,
    required: [true, 'Please provide image'],
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
  },
  company: {
    type: String,
    required: [true, 'Please provide company'],
  },
  colors: {
    type: Array,
    required: [true, 'Please provide colors'],
  },
  featured: {
    type: String,
  },
  freeShipping: {
    type: Boolean,
  },
  inventory: {
    type: Number,
  },
  averageRating: {
    type: Number,
  },
  user: {
    type: String,
    required: [true, 'Please provide user id'],
  },
});

UserSchema.set('timestamps', true);

module.exports = mongoose.model('Product', ProductSchema);
