var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const {authenticateToken, baseUrl} = require('../middleware/index');

require('../models/CuaHang')
const CuaHang = mongoose.model("cuaHang");

router.get('/', authenticateToken, function(req, res, next) {
  const account = {
    id: req.userId,
    diaChi:req.diaChi,
    username:req.username,
    email:req.email,
    sdt:req.sdt
  }

  res.render('doiMatKhau', { title: 'Express', baseUrl, account: account, message: "" });
});

router.put('/updateAccount', function(req, res, next) {
  res.render('doiMatKhau', { title: 'Express' });
});

router.post('/changePassword/:oldPassword/:newPassword/:rePassword', authenticateToken, async function(req, res, next) {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword, rePassword } = req.params;

    if (!oldPassword || !newPassword || !rePassword) {
      return res.status(400).json({ message: "Nhập đủ thông tin" });
    }

    if (newPassword !== rePassword) {
      return res.status(400).json({ message: "Mật khẩu nhập lại không khớp" });
    }

    const user = await CuaHang.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    if (oldPassword !== user.password) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    }

    user.password = newPassword;
    const updatedUser = await user.save();
    return res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;