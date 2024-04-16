const mongoose = require('mongoose');

const RamSchema = mongoose.Schema({
    RAM:{type: Number},
});
module.exports = mongoose.model('ram', RamSchema);