    const mongoose = require('mongoose');

const MauSchema = mongoose.Schema({
    tenMau:{type: String},
});
module.exports = mongoose.model('mau', MauSchema);