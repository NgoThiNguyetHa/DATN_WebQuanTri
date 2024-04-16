var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const {authenticateToken, baseUrl} = require('../middleware/index');

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
    const response = await axios.get(`${baseUrl}danhgias/getDanhGiaTheoCuaHang/${account.id}`);

    // Dữ liệu từ API
    const data = response.data;

    res.render('quanLyDanhGia', { title: 'Express', data, account: account });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

router.get('/searchDanhGia', authenticateToken, async function (req, res, next) {
  try {
    const account = {
      id: req.userId,
      diaChi:req.diaChi,
      username:req.username,
      email:req.email,
      sdt:req.sdt
    }
    const {tenKhachHang, sanPham, noiDung, diemDanhGia, ngayDanhGia} = req.query;
    const danhGias = await axios.get(`${baseUrl}danhgias/searchDanhGia/${account.id}?ngayDanhGia=${formatDate(ngayDanhGia)}&diemDanhGia=${diemDanhGia}&noiDung=${noiDung}&sanPham=${sanPham}&tenKhachHang=${tenKhachHang}`);

    res.render('quanLyDanhGia',
        {
          title: 'Express',
          data: danhGias.data,
          account: account
        });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

function formatDate(inputDate) {
  const dateObj = new Date(inputDate);

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();

  return `${day}-${month}-${year}`;
}
module.exports = router;