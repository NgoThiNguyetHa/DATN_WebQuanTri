const mongoose = require('mongoose');

const ChiTietDienThoaiSchema = mongoose.Schema({
  soLuong: {type: Number},
  giaTien: {type: Number},
  maDienThoai: {type: mongoose.Schema.Types.ObjectId, ref: 'dienthoai'},
  maMau: {type: mongoose.Schema.Types.ObjectId, ref: 'mau'},
  maDungLuong: {type: mongoose.Schema.Types.ObjectId, ref: 'dungluong'},
  maRam: {type: mongoose.Schema.Types.ObjectId, ref: 'ram'},
  hinhAnh: {type: String},
});
module.exports = mongoose.model('chitietdienthoai', ChiTietDienThoaiSchema);