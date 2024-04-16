var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const {authenticateToken, baseUrl} = require('../middleware/index');

// require('../models/CuaHang')
// const CuaHang = mongoose.model("cuaHang");

router.get('/', authenticateToken, async function(req, res, next) {
  try {
    const account = {
      id: req.userId,
      diaChi:req.diaChi,
      username:req.username,
      email:req.email,
      sdt:req.sdt
    }

    // Gọi API để lấy danh sách hóa đơn dựa trên mã cửa hàng
    const response = await axios.get(`${baseUrl}hoadons/getHoaDonTheoCuaHang/${account.id}`);

    // // Dữ liệu hóa đơn từ API
    const hoaDonList = response.data;
    // console.log("hoadon: ", hoaDonList)

    res.render('quanLyDonHang', { title: 'Express', data: hoaDonList, account: account });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

router.get('/searchHoaDon', authenticateToken, async function(req, res, next) {
  try {
    const account = {
      id: req.userId,
      diaChi:req.diaChi,
      username:req.username,
      email:req.email,
      sdt:req.sdt
    }

    function formatDate(inputDate) {
      const dateObj = new Date(inputDate);

      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();

      return `${day}-${month}-${year}`;
    }

    const queryParams = new URLSearchParams({
      tenNguoiNhan: req.query.tenNguoiNhan,
      tongTien: req.query.tongTien,
      trangThaiNhanHang: req.query.trangThaiNhanHang,
      ngayTao: req.query.ngayTao ? formatDate(req.query.ngayTao) : "",
      username: req.query.username
    });

    const response = await axios.get(`${baseUrl}hoadons/searchHoaDon/${account.id}?${queryParams}`);
    const list = response.data;

    res.render('quanLyDonHang', { title: 'Express', data: list, account: account });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});
module.exports = router;