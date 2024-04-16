var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../models/HoaDon')
require('../models/ChiTietHoaDon')

const ChiTietHoaDon = mongoose.model("chiTietHoaDon")
const HoaDon = mongoose.model("hoaDon")


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* POST Mau. */

router.post('/addHoaDon', async function (req, res, next) {
  const hoaDon = new HoaDon({
    tongTien: req.body.tongTien,
    ngayTao: req.body.ngayTao,
    trangThaiNhanHang: req.body.trangThaiNhanHang,
    phuongThucThanhToan: req.body.phuongThucThanhToan,
    maDiaChiNhanHang: req.body.maDiaChiNhanHang,
    maKhachHang: req.body.maKhachHang,
    maCuaHang: req.body.maCuaHang,
  })
  const saved = await hoaDon.save();
  const data = await HoaDon.findById(saved._id)
      .populate("maKhachHang")
      .populate({path: "maDiaChiNhanHang", populate: {path: "maKhachHang", model: "khachhang"}})
      .populate("maCuaHang")
  res.send(data)
});

/* GET loaidichvu listing. */
router.get('/getHoaDon/:id', async (req, res) => {
  try {
    const hoaDon = await HoaDon.findById(req.params.id)
        .populate("maKhachHang")
        .populate({path: "maDiaChiNhanHang", populate: {path: "maKhachHang", model: "khachhang"}})
        .populate("maCuaHang")
    const chiTiet = await ChiTietHoaDon.find({maHoaDon: req.params.id})
        .populate({
          path: "maHoaDon",
          populate: [
            {
              path: "maDiaChiNhanHang",
              model: "diaChiNhanHang",
              populate: {path: "maKhachHang", model: "khachhang"}
            },
            {path: "maKhachHang", model: "khachhang"},
            {path: "maCuaHang", model: "cuaHang"},
          ]
        })
        .populate({
          path: "maChiTietDienThoai",
          populate: [
            {
              path: "maDienThoai",
              model:"dienthoai",
              populate: [
                {path: 'maCuaHang', model: 'cuaHang'},
                {path: 'maUuDai', model: 'uudai', populate: 'maCuaHang'},
                {path: 'maHangSX', model: 'hangSanXuat'}
              ]
            },
            {path: "maMau", model:"mau"},
            {path: "maDungLuong", model:"dungluong"},
            {path: "maRam", model:"ram"}
          ]
        });
    res.json({hoaDon, chiTiet});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})

router.get('/getHoaDonTheoTrangThai/:trangThaiNhanHang', async (req, res) => {
  try {
    const trangThaiNhanHang = req.params.trangThaiNhanHang;
    // const hoaDon = await HoaDon.find({ trangThaiNhanHang });
    const hoaDon = await HoaDon.find({trangThaiNhanHang})
        .populate("maKhachHang")
        .populate({path: "maDiaChiNhanHang", populate: {path: "maKhachHang", model: "khachhang"}})
        .populate("maCuaHang")
    res.json(hoaDon);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

//lấy hóa đơn theo mã cửa hàng
router.get('/getHoaDonTheoTrangThai/:trangThaiNhanHang/:maCuaHang', async (req, res) => {
  try {
    const trangThaiNhanHang = req.params.trangThaiNhanHang;
    const maCuaHang = req.params.maCuaHang;
    const hoaDon = await HoaDon.find({trangThaiNhanHang, maCuaHang})
        .populate("maKhachHang")
        .populate({path: "maDiaChiNhanHang", populate: {path: "maKhachHang", model: "khachhang"}})
        .populate("maCuaHang")
    res.json(hoaDon);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});
// lấy hóa đơn theo mã khách hàng
router.get('/getHoaDonTheoTrangThai-KH/:trangThaiNhanHang/:maKhachHang', async (req, res) => {
  try {
    const trangThaiNhanHang = req.params.trangThaiNhanHang;
    const maKhachHang = req.params.maKhachHang;
//    console.log(trangThaiNhanHang, " / ", maKhachHang)
    const hoaDon = await HoaDon.find({trangThaiNhanHang, maKhachHang})
        .populate("maKhachHang")
        .populate({path: "maDiaChiNhanHang", populate: {path: "maKhachHang", model: "khachhang"}})
        .populate("maCuaHang")
    res.json(hoaDon);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});
router.get('/getHoaDonTheoChiTiet', async (req, res) => {
  try {
    const hoaDon = await HoaDon.find()
        .populate("maKhachHang")
        .populate({path: "maDiaChiNhanHang", populate: {path: "maKhachHang", model: "khachhang"}})
        .populate("maCuaHang")
    res.json(hoaDon);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

router.delete('/deleteHoaDon/:id', async (req, res) => {
  try {
    const data = await HoaDon.findByIdAndDelete(req.params.id)
    if (!data) {
      return res.status(404).json({message: "delete failed"})
    } else {
      return res.status(200).json({message: "delete successful"})
    }
  } catch (err) {
    return res.status(500).json({message: err.message})

  }
})


router.put("/updateHoaDon/:id", async (req, res) => {
  try {
    const { trangThaiNhanHang } = req.body;
    const updatedHoaDon = await HoaDon.findByIdAndUpdate(
        req.params.id,
        { trangThaiNhanHang },
        { new: true }
    );
    if (!updatedHoaDon) {
      return res.status(404).json({message: "update failed"})

    } else {
      return res.status(200).json({message: "update successful"})

    }
  } catch (err) {
    console.log("errr: ", err)
    return res.status(500).json({message: err.message})
  }
})

router.get('/getHoaDonTheoCuaHang/:maCuaHang', async (req, res) => {
  try {
    const maCuaHang = req.params.maCuaHang;
    const hoaDon = await HoaDon.find({maCuaHang})
        .populate("maKhachHang")
        .populate({path: "maDiaChiNhanHang", populate: {path: "maKhachHang", model: "khachhang"}})
        .populate("maCuaHang")
    res.json(hoaDon);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

router.get('/searchHoaDon/:maCuaHang', async (req, res) => {
  try {
    const maCuaHang = req.params.maCuaHang;
    const { tenNguoiNhan, tongTien, trangThaiNhanHang, ngayTao, username } = req.query;

    let hoaDon = await HoaDon.find({maCuaHang})
        .populate("maKhachHang")
        .populate({path: "maDiaChiNhanHang", populate: {path: "maKhachHang", model: "khachhang"}})
        .populate("maCuaHang")

    hoaDon = hoaDon.filter(hd => {
      return (!tenNguoiNhan || hd.maDiaChiNhanHang.tenNguoiNhan.toLowerCase().includes(tenNguoiNhan.toLowerCase())) &&
          (!tongTien || hd.tongTien.toString() === tongTien) &&
          (!trangThaiNhanHang || hd.trangThaiNhanHang === trangThaiNhanHang) &&
          (!ngayTao || hd.ngayTao === ngayTao) &&
          (!username || hd.maKhachHang.username.toLowerCase().includes(username.toLowerCase()));
    });

    res.json(hoaDon);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

module.exports = router;
