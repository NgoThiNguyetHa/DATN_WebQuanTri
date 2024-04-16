var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const {authenticateToken, baseUrl} = require('../middleware/index');
// require('../models/CuaHang')
// const CuaHang = mongoose.model("cuaHang");

router.get('/', authenticateToken, async function(req, res, next) {
  try {
    // Nhận mã cửa hàng từ yêu cầu của client
    const account = {
      id: req.userId,
      diaChi:req.diaChi,
      username:req.username,
      email:req.email,
      sdt:req.sdt
    }

    // Gọi API để lấy danh sách hóa đơn dựa trên mã cửa hàng
    const response = await axios.get(`${baseUrl}dienthoais/getDienThoaiVaChiTiet/${account.id}`);

    // Dữ liệu hóa đơn từ API
    const dienThoais = response.data;

    res.render('quanLyDienThoai', { title: 'Express', data: dienThoais, account: account });

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

router.get('/searchDienThoai', authenticateToken, async function(req, res, next) {
  try {
    const account = {
      id: req.userId,
      diaChi:req.diaChi,
      username:req.username,
      email:req.email,
      sdt:req.sdt
    }

    const queryParams = new URLSearchParams({
      tenDienThoai: req.query.tenDienThoai,
      tenHang: req.query.tenHang,
      tenMau: req.query.tenMau,
      boNho: req.query.boNho,
      RAM: req.query.RAM,
      giaTien: req.query.giaTien
    });
    // console.log("formData: ",queryParams)
    const response = await axios.get(`${baseUrl}dienthoais/searchPhones/${account.id}?${queryParams}`);
    const list = response.data;

    res.render('quanLyDienThoai', { title: 'Express', data: list, account: account });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});
module.exports = router;