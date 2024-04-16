const mongoose = require('mongoose');

const DiaChiNhanHangSchema = mongoose.Schema({
    maKhachHang:{type: mongoose.Schema.Types.ObjectId, ref: 'khachhang'},
    sdt:{type: String},
    tenNguoiNhan:{type: String},
    diaChi:{type: String}
   
    
});
module.exports = mongoose.model('diaChiNhanHang', DiaChiNhanHangSchema);