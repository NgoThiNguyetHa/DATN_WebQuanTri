var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../models/HoaDon')

const HoaDon = mongoose.model("hoaDon")
require('../models/ChiTietHoaDon')

const ChiTietHoaDon = mongoose.model("chiTietHoaDon")
 

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/addChiTietHoaDon', async function(req, res, next) {
  try {
    const chiTietHoaDonList = req.body;
    
    if (!Array.isArray(chiTietHoaDonList)) {
      return res.status(400).send({ message: 'Mảng chi tiết hóa đơn không hợp lệ' });
    }

    const savedChiTietHoaDonList = [];
    for (const item of chiTietHoaDonList) {
      const chiTietHoaDon = new ChiTietHoaDon({
        soLuong: item.soLuong,
        giaTien: item.giaTien,
        maHoaDon: item.maHoaDon,
        maChiTietDienThoai: item.maChiTietDienThoai,
      });
      await chiTietHoaDon.save();
      savedChiTietHoaDonList.push(chiTietHoaDon);
    }
    
    const populatedChiTietHoaDonList = await ChiTietHoaDon.populate(savedChiTietHoaDonList, [
      {
        path: "maHoaDon",
        populate: [
          { path: "maDiaChiNhanHang", model: "diaChiNhanHang", populate: { path: "maKhachHang", model: "khachhang" } },
          { path: "maKhachHang", model: "khachhang" },
          { path: "maCuaHang", model: "cuaHang" },
        ],
      },
      {
        path: "maChiTietDienThoai",
        populate: [
          {
            path: "maDienThoai",
            model: "dienthoai",
            populate: [
              { path: 'maCuaHang', model: 'cuaHang' },
              { path: 'maUuDai', model: 'uudai', populate: 'maCuaHang' },
              { path: 'maHangSX', model: 'hangSanXuat' }
            ],
          },
          { path: "maMau", model: "mau" },
          { path: "maDungLuong", model: "dungluong" },
          { path: "maRam", model: "ram" },
        ],
      },
    ]);

    res.status(200).send(populatedChiTietHoaDonList);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Đã xảy ra lỗi khi thêm chi tiết hóa đơn' });
  }
});

/* GET loaidichvu listing. */
router.get('/getChiTietHoaDon', async (req,res) => {
  try {
    const chiTietHoaDon = await ChiTietHoaDon.find().populate("maHoaDon").populate("maChiTietDienThoai");
    res.json(chiTietHoaDon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.delete('/deleteChiTietHoaDon/:id', async (req,res) => {
  try{
    const data =  await ChiTietHoaDon.findByIdAndDelete(req.params.id)
    if(!data){
      return res.status(404).json({message: "delete failed"})
    }else{
      return res.status(200).json({message: "delete successful"})
    }
  }catch(err){
    return res.status(500).json({message: err.message})

  }
})


router.put("/updateChiTietHoaDon/:id", async (req, res ) => {
  try{
    const data = await ChiTietHoaDon.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!data){
      return res.status(404).json({message: "update failed"})

    }else{
      return res.status(200).json({message: "update successful"})

    }
  }catch(err){
    return res.status(500).json({message: err.message})
  }
})

// get chi tiết hóa đơn theo id hóa đơn
router.get('/getChiTietHoaDonTheoHoaDon/:id', async (req,res) => {
  try {
    const chiTietHoaDon = await ChiTietHoaDon.find({maHoaDon: req.params.id})
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
    res.json(chiTietHoaDon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
router.get('/getChiTietHoaDonTheoLichSuMuaHang/:maKhachHang', async (req, res) => {
  try {
    const trangThaiNhanHang = "Đã giao";
    const maKhachHang = req.params.maKhachHang;
    const hoaDon = await HoaDon.find({trangThaiNhanHang, maKhachHang})
        .populate("maKhachHang")
        .populate({path: "maDiaChiNhanHang", populate: {path: "maKhachHang", model: "khachhang"}})
        .populate("maCuaHang")
    // console.log("hoaDon: ", hoaDon)
    const maHoaDonList = hoaDon.map(hoaDon => hoaDon._id);
    // console.log("mahoaDon: ", maHoaDonList)
    const chiTietHoaDonList = await ChiTietHoaDon.find({maHoaDon: {$in: maHoaDonList}})

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
              model: "dienthoai",
              populate: [
                {path: 'maCuaHang', model: 'cuaHang'},
                {path: 'maUuDai', model: 'uudai', populate: 'maCuaHang'},
                {path: 'maHangSX', model: 'hangSanXuat'}
              ]
            },
            {path: "maMau", model: "mau"},
            {path: "maDungLuong", model: "dungluong"},
            {path: "maRam", model: "ram"}
          ]
        });
        // console.log("zzzz" , chiTietHoaDonList);
    res.json(chiTietHoaDonList);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});
module.exports = router;
