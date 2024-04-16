var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const {authenticateToken, baseUrl} = require('../middleware/index');
const moment = require('moment');
// require('../models/CuaHang')
// const CuaHang = mongoose.model("cuaHang");

router.get('/', authenticateToken, async function(req, res, next) {
  const account = {
    id: req.userId,
    diaChi:req.diaChi,
    username:req.username,
    email:req.email,
    sdt:req.sdt
  }
  const today = moment().format('DD-MM-YYYY');
  const year = today.split('-')[2];

  const daGiao = 'Đã giao';
  const daHuy = 'Đã hủy';
  const dangXuLy = 'Đang xử lý';

  const doanhThuTrongNam = await axios.get(`${baseUrl}thongke/thongke/${year}/${account.id}`);
  const doanhThuDangXuLy = await axios.get(`${baseUrl}thongke/thongKeTongTien/${dangXuLy}/${account.id}/${today}`);
  const doanhThuDaHuy = await axios.get(`${baseUrl}thongke/thongKeTongTien/${daHuy}/${account.id}/${today}`);
  const doanhThuDaGiao = await axios.get(`${baseUrl}thongke/thongKeTongTien/${daGiao}/${account.id}/${today}`);

  const soLuongDaGiao = await axios.get(`${baseUrl}thongke/soLuongHoaDon/${daGiao}/${account.id}/${today}`);
  const soLuongDaHuy = await axios.get(`${baseUrl}thongke/soLuongHoaDon/${daHuy}/${account.id}/${today}`);
  const soLuongKhachHang = await axios.get(`${baseUrl}thongke/soLuongKhachHang/${account.id}/${today}`);
  const soLuongSanPham = await axios.get(`${baseUrl}thongke/soLuongSanPham/${account.id}/${today}`);

  res.render('thongKe', {
    title: 'Express',
    baseUrl,
    account: account,
    soLuongDaGiao: soLuongDaGiao.data,
    soLuongDaHuy: soLuongDaHuy.data,
    soLuongKhachHang: soLuongKhachHang.data,
    soLuongSanPham: soLuongSanPham.data,
    doanhThuTrongNam: JSON.stringify(doanhThuTrongNam.data),
    doanhThuDaGiao: doanhThuDaGiao.data,
    doanhThuDaHuy: doanhThuDaHuy.data,
    doanhThuDangXuLy: doanhThuDangXuLy.data
  });
});

module.exports = router;