const mongoose = require('mongoose');

const DungLuongSchema = mongoose.Schema({
    boNho:{type: Number},
});
module.exports = mongoose.model('dungluong', DungLuongSchema);