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

    // Gọi API để lấy danh sách uuDai dựa trên mã cửa hàng
    const response = await axios.get(`${baseUrl}uudais/getUuDai/${account.id}`);
    // Dữ liệu hóa đơn từ API
    const uuDaiList = response.data;

    res.render('quanLyUuDai', { title: 'Express', data: uuDaiList, account: account });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

router.get('/searchUuDaiByDiscount', authenticateToken, async function(req, res, next) {
  try {
    const account = {
      id: req.userId,
      diaChi:req.diaChi,
      username:req.username,
      email:req.email,
      sdt:req.sdt
    }
    const maxDiscount = req.query.maxDiscount;
    const trangThai = req.query.trangThai;
    const response = await axios.get(`${baseUrl}uudais/searchUuDaiByDiscount/${account.id}?minDiscount=0&maxDiscount=${maxDiscount}&trangThai=${trangThai}`);
    const uuDaiList = response.data;

    res.render('quanLyUuDai', { title: 'Express', data: uuDaiList, account: account });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

module.exports = router;