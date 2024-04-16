var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../models/KhachHang')
require("../models/ChiTietHoaDon");
require("../models/ChiTietDienThoai");
require('../models/GioHang')

const KhachHang = mongoose.model("khachhang");
const HoaDon = mongoose.model("hoaDon");
const GioHang = mongoose.model("gioHang")
const bcrypt = require('bcryptjs');
// const ChiTietDienThoai = mongoose.model("chitietdienthoai");
router.post('/addKhachHang', async (req, res, next) => {
  try {
    const {username, password, diaChi, email, sdt} = req.body;
    const newKhachHang = new KhachHang({
      username: username,
      password: password,
      email: email,
      diaChi: diaChi,
      sdt: sdt
    });
    if (!username || !password || !email || !sdt) {
      const errorMessage = "Vui lòng nhập đủ thông tin";
      return res.status(201).json({
        errorMessage: errorMessage,
        data: newKhachHang,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      const errorMessage = "Email không hợp lệ";
      return res.status(201).json({
        errorMessage: errorMessage,
        data: newKhachHang,
      });
    }
    const successMessage = "Successfully!";
    const saveKH = await newKhachHang.save();
    //tạo giỏ hàng cho KH
    const gioHang = new GioHang({
      soLuong: 0,
      tongTien: 0,
      maKhachHang: saveKH._id
    })
    gioHang.save()
    return res.status(201).json({
      successMessage: successMessage,
      data: saveKH,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/getAllKhachHang', async (req, res) => {
  try {
    const khachHang = await KhachHang.find();
    res.json(khachHang);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})


router.post('/dangNhapKhachHang', async (req, res) => {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      return res.status(400).json({errorMessage: 'Vui lòng nhập email và mật khẩu.'});
    }

    const khachHang = await KhachHang.findOne({email});

    if (!khachHang) {
      return res.status(401).json({errorMessage: 'Email không tồn tại.'});
    }

    if (password !== khachHang.password) {
      return res.status(401).json({errorMessage: 'Mật khẩu không đúng.'});
    }

    return res.status(200).json({successMessage: 'Đăng nhập thành công.', khachHang});
  } catch (error) {
    console.error(error);
    res.status(500).json({errorMessage: 'Lỗi server.'});
  }
});

router.get("/getKhachHangTheoCuaHang/:id", async (req, res) => {
  try {
    const idCuaHang = req.params.id;
    const hoaDons = await HoaDon.find({maCuaHang: idCuaHang})
        .populate('maCuaHang', '_id')
        .populate('maKhachHang')

    // Tạo một Set để lưu trữ các mã khách hàng duy nhất
    const maKhachHangs = new Set();

    // Lặp qua các hóa đơn để thêm mã khách hàng vào Set
    hoaDons.forEach(hoaDon => {
      maKhachHangs.add(hoaDon.maKhachHang._id.toString());
    });

    // Chuyển Set thành mảng và lấy thông tin khách hàng tương ứng
    const khachHangs = Array.from(maKhachHangs).map(maKhachHangId => {
      return hoaDons.find(hoaDon => hoaDon.maKhachHang._id.toString() === maKhachHangId).maKhachHang;
    });

    return res.json(khachHangs);
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
})
router.put('/doiMatKhau', async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ errorMessage: 'Vui lòng nhập đủ thông tin.' });
    }

    const khachHang = await KhachHang.findOne({ email });
    if (!khachHang) {
      return res.status(404).json({ errorMessage: 'Không tìm thấy khách hàng.' });
    }

    if (oldPassword !== khachHang.password) {
      return res.status(401).json({ errorMessage: 'Mật khẩu cũ không đúng.' });
    }

    // Cập nhật mật khẩu mới vào database
    khachHang.password = newPassword;
    await khachHang.save();

    return res.status(200).json(khachHang);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errorMessage: 'Lỗi server.' });
  }
});

router.post('/editKhachHang/:id', async (req, res, next) => {
  try {
    const { username, password, diaChi, email, sdt } = req.body;
    const khachHangId = req.params.id;

    if (!username || !password || !email || !sdt) {
      const errorMessage = "Vui lòng nhập đủ thông tin";
      return res.status(400).json({
        errorMessage: errorMessage,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorMessage = "Email không hợp lệ";
      return res.status(400).json({
        errorMessage: errorMessage,
      });
    }

    const updatedKhachHang = await KhachHang.findByIdAndUpdate(khachHangId, {
      username: username,
      password: password,
      email: email,
      diaChi: diaChi,
      sdt: sdt
    }, { new: true });

    if (!updatedKhachHang) {
      const errorMessage = "Không tìm thấy thông tin khách hàng";
      return res.status(404).json({
        errorMessage: errorMessage,
      });
    }

    const successMessage = "Cập nhật thông tin khách hàng thành công";
    return res.status(200).json(updatedKhachHang);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: "Lỗi server" });
  }
});

module.exports = router;
