const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
  },
});
