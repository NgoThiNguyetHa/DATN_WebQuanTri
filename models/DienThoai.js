const mongoose = require('mongoose');

const DienThoaiSchema = mongoose.Schema({
    tenDienThoai: {type: String},
    kichThuoc: {type:String},
    congNgheManHinh : {type: String},
    camera : {type: String},
    cpu : {type : String},
    pin: {type :String},
    heDieuHanh :{type:String},
    doPhanGiai: {type:String},
    namSanXuat:{type:String},
    thoiGianBaoHanh: {type: String},
    moTaThem:{type : String},
    maHangSX: {type: mongoose.Schema.Types.ObjectId, ref: 'hangSanXuat'},
    hinhAnh:{type:String},
    maUuDai: {type: mongoose.Schema.Types.ObjectId, ref: 'uudai' , default: null },
    maCuaHang: {type: mongoose.Schema.Types.ObjectId, ref: 'cuaHang'}
});
module.exports = mongoose.model('dienthoai', DienThoaiSchema);