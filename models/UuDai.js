const mongoose = require('mongoose');

const UuDaiSchema = mongoose.Schema({
  giamGia: {type: String},
  thoiGian: {type: String},
  trangThai: {type: String},
  maCuaHang: {type: mongoose.Schema.Types.ObjectId, ref: 'cuaHang'}
});
module.exports = mongoose.model('uudai', UuDaiSchema);