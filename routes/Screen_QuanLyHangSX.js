var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const axios = require("axios");
const {baseUrl, authenticateToken} = require("../middleware");

// require('../models/CuaHang')
// const CuaHang = mongoose.model("cuaHang");

router.get('/', authenticateToken, async function (req, res, next) {
  try {
    const account = {
      id: req.userId,
      diaChi:req.diaChi,
      username:req.username,
      email:req.email,
      sdt:req.sdt
    }
    // Gọi API để lấy danh sách hóa đơn dựa trên mã cửa hàng
    const hangSX = await axios.get(`${baseUrl}hangsanxuats/getHangSanXuat`);
    const mau = await axios.get(`${baseUrl}maus/getMau`);
    const dungLuong = await axios.get(`${baseUrl}dungluongs/getDungLuong`);
    const ram = await axios.get(`${baseUrl}rams/getRam`);

    res.render('quanLyHangSanXuat',
        {
          title: 'Express',
          hangsanxuats: hangSX.data,
          maus: mau.data,
          dungluongs: dungLuong.data,
          rams: ram.data,
          account: account
        });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

router.get('/searchThongSo', authenticateToken, async function (req, res, next) {
  try {
    const account = {
      id: req.userId,
      diaChi:req.diaChi,
      username:req.username,
      email:req.email,
      sdt:req.sdt
    }
    const {tenMau, tenHang, boNho, RAM} = req.query;
    // Gọi API để lấy danh sách hóa đơn dựa trên mã cửa hàng
    const hangSX = await axios.get(`${baseUrl}hangsanxuats/searchHangSanXuat?tenHang=${tenHang}`);
    const mau = await axios.get(`${baseUrl}maus/searchMau?tenMau=${tenMau}`);
    const dungLuong = await axios.get(`${baseUrl}dungluongs/searchDungLuong?boNho=${boNho}`);
    const ram = await axios.get(`${baseUrl}rams/searchRAM?RAM=${RAM}`);

    res.render('quanLyHangSanXuat',
        {
          title: 'Express',
          hangsanxuats: hangSX.data,
          maus: mau.data,
          dungluongs: dungLuong.data,
          rams: ram.data,
          account: account
        });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});
module.exports = router;