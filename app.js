var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
const cron = require('node-cron');
const axios = require('axios');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mauRouter = require('./routes/MauRoutersAPI');
var ramRouter = require('./routes/RamRoutersAPI');
var dungLuongRouter = require('./routes/DungLuongRoutersAPI')
var dienThoaiRouter = require('./routes/DienThoaiRoutersAPI')
var uuDaiRouter = require('./routes/UuDaiRoutersAPI')
var HangSanXuatAPI = require('./routes/HangSanXuatAPI');
var CuaHangAPI = require('./routes/CuaHangAPI');
var DiaChiNhanHangAPI = require('./routes/DiaChiNhanHangAPI');
var HoaDonAPI = require('./routes/HoaDonAPI');
var ChiTietHoaDonAPI = require('./routes/ChiTietHoaDonAPI');
var GioHangAPI = require('./routes/GioHangAPI');
var ChiTietGioHangAPI = require('./routes/ChiTietGioHangAPI');
var khachHangAPI = require('./routes/KhachHangAPI');
var chiTietDienThoaiRouter = require('./routes/ChiTietDienThoaiApi')
var danhGiaRouter = require('./routes/DanhGiaApi')
var thongKe = require('./routes/ThongKeAPI')

// screen
var dangNhapScreen = require('./routes/Screen_DangNhap')
var quanLyDienThoaiScreen = require('./routes/Screen_QuanLyDienThoai')
var cuaHangLienKetScreen = require('./routes/Screen_CuaHangLienKet')
var doiMatKhauScreen = require('./routes/Screen_DoiMatKhau')
var quanLyDonHangScreen = require('./routes/Screen_QuanLyDonHang')
var quanLyHangSXScreen = require('./routes/Screen_QuanLyHangSX')
var quanLyUuDaiScreen = require('./routes/Screen_QuanLyUuDai')
var thongKeScreen = require('./routes/Screen_ThongKe')
var quanLyDanhGiaScreen = require('./routes/Screen_QuanLyDanhGia')


const mongoose = require('mongoose');
const { error } = require('console');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/maus', mauRouter);
app.use('/rams',ramRouter)
app.use('/dungluongs',dungLuongRouter)
app.use('/dienthoais',dienThoaiRouter)
app.use('/uudais',uuDaiRouter)
app.use('/hangsanxuats' , HangSanXuatAPI) // Hãng sản xuất
app.use('/cuahangs' , CuaHangAPI) // Cửa hàng
app.use('/diachinhanhangs', DiaChiNhanHangAPI) //Địa chỉ nhận hàng
app.use('/hoadons' , HoaDonAPI) // Hóa đơn
app.use('/chitiethoadons', ChiTietHoaDonAPI) //Chi tiết hóa đơn
app.use('/giohangs', GioHangAPI) //Giỏ hàng
app.use('/chitietgiohangs', ChiTietGioHangAPI) //Chi tiết giỏ hàng
app.use('/khachhangs',khachHangAPI)
app.use('/chitietdienthoais',chiTietDienThoaiRouter)
app.use('/danhgias',danhGiaRouter)
app.use('/thongke',thongKe)

//screen
app.use('/dangNhapW', dangNhapScreen)
app.use('/quanLyDienThoaiW', quanLyDienThoaiScreen)
app.use('/quanLyDonHangW', quanLyDonHangScreen)
app.use('/cuaHangLienKetW', cuaHangLienKetScreen)
app.use('/doiMatKhauW', doiMatKhauScreen)
app.use('/quanLyHangSanXuatW', quanLyHangSXScreen)
app.use('/thongKeW', thongKeScreen)
app.use('/quanLyUuDaiW', quanLyUuDaiScreen)
app.use('/quanLyDanhGiaW', quanLyDanhGiaScreen)

// parse application/json
app.use(bodyParser.json())


//connection database mongoodb
const mongoURL= 'mongodb+srv://hoanglong180903:tVppUteM4IrqkvDv@cluster0.2gdloo3.mongodb.net/MyNodejsApp'
mongoose.connect(mongoURL)
.then(() => {
  console.log("connection successfully")
})
.catch((error) => {
  console.log("Error connecting to database")
});

// Lập lịch chạy hằng ngày vào lúc 00:01 để cập nhật trạng thái của voucher
cron.schedule('0 0 * * *', async () => {
  try {
    // Gọi API cập nhật trạng thái voucher
    const response = await axios.put('http://localhost:8686/uudais/updateExpiredStatus');

  } catch (error) {
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
const port = process.env.PORT || 8686;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
