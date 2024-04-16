const mongoose = require('mongoose');

const HoaDonSchema = mongoose.Schema({
    tongTien:{type: String},
    ngayTao:{type: String},
    trangThaiNhanHang:{type: String},
    phuongThucThanhToan:{type: String},
    maDiaChiNhanHang:{type: mongoose.Schema.Types.ObjectId, ref: 'diaChiNhanHang' , default: null},
    maKhachHang:{type: mongoose.Schema.Types.ObjectId, ref: 'khachhang'},
    maCuaHang:{type: mongoose.Schema.Types.ObjectId, ref: 'cuaHang'}
});
module.exports = mongoose.model('hoaDon', HoaDonSchema);