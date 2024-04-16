const mongoose = require('mongoose');

const KhachHangSchema = mongoose.Schema({
    diaChi:{type: String},
    username:{type: String},
    password:{type: String},
    email:{type: String},
    sdt:{type: String},
});
module.exports = mongoose.model('khachhang', KhachHangSchema);
