const mongoose = require('mongoose');

const GioHangSchema = mongoose.Schema({
    soLuong:{type: Number},
    tongTien:{type: Number},
    maKhachHang:{type: mongoose.Schema.Types.ObjectId, ref: 'khachhang'},
});
module.exports = mongoose.model('gioHang', GioHangSchema);