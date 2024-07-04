const { model, Schema } = require('mongoose');

const songSchema = new Schema({
    name: String,
    url: String,
    createdAt: String
});

module.exports = model('Song', songSchema);