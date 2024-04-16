const mongoose = require('mongoose');

const ChiTietHoaDonSchema = mongoose.Schema({
    soLuong:{type: Number},
    giaTien:{type: String},
    maHoaDon:{type: mongoose.Schema.Types.ObjectId, ref: 'hoaDon'},
    maChiTietDienThoai:{type: mongoose.Schema.Types.ObjectId, ref: 'chitietdienthoai'}
});
module.exports = mongoose.model('chiTietHoaDon', ChiTietHoaDonSchema);