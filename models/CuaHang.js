const mongoose = require('mongoose');

const CuaHangSchema = mongoose.Schema({
    diaChi:{type: String},
    username:{type: String},
    password:{type: String},
    email:{type: String},
    sdt:{type: String},
    phanQuyen:{type: String},
    trangThai:{type: String}

    
});
module.exports = mongoose.model('cuaHang', CuaHangSchema);