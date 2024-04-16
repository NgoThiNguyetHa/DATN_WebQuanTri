var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../models/UuDai')
require('../models/DienThoai')
const DienThoai = mongoose.model("dienthoai")

const UuDai = mongoose.model("uudai")


router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/addUuDai',async function (req, res, next) {
  try {
    const uudai = new UuDai({
      giamGia: req.body.giamGia,
      thoiGian: req.body.thoiGian,
      trangThai: req.body.trangThai,
      maCuaHang: req.body.maCuaHang,
    });

    const savedUuDai = await uudai.save();
    const populatedUuDai = await UuDai.findById(savedUuDai._id).populate("maCuaHang");

    // console.log(populatedUuDai);
    res.send(populatedUuDai);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get('/getUuDai/:id', async (req, res) => {
  try {
    const idCuaHang = req.params.id;
    const uudai = await UuDai.find({maCuaHang: idCuaHang}).populate("maCuaHang");
    res.json(uudai);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})


router.delete('/deleteUuDai/:id', async (req, res) => {
  try {
    const data = await UuDai.findByIdAndDelete(req.params.id)
    if (!data) {
      return res.status(404).json({message: "delete failed"})
    } else {
      return res.status(200).json({message: "delete successful"})
    }
  } catch (err) {
    return res.status(500).json({message: err.message})

  }
})


router.put("/updateUuDai/:id", async (req, res) => {
  try {
    const data = await UuDai.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if (!data) {
      return res.status(404).json({message: "update failed"})

    } else {
      return res.status(200).json({message: "update successful"})

    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: err.message})
  }
})

router.put('/updateExpiredStatus', async (req, res) => {
  try {
    const currentDate = new Date();
    const expiredVouchers = await UuDai.aggregate([
      {
        $addFields: {
          ngayHetHanDate: {
            $dateFromString: {
              dateString: "$thoiGian",
              format: "%d-%m-%Y"
            }
          }
        }
      },
      {
        $match: {
          $and: [
            { trangThai: "Hoạt động" },
            { ngayHetHanDate: { $lt: currentDate } }
          ]
        }
      }
    ])
    for (const voucher of expiredVouchers) {
      await UuDai.findByIdAndUpdate(voucher._id, { trangThai: 'Không hoạt động' }, {new: true});
      const productsWithExpiredVoucher = await DienThoai.find({ maUuDai: voucher._id });

      // Cập nhật lại trường uuDai cho các sản phẩm đó
      for (const product of productsWithExpiredVoucher) {
        await DienThoai.findByIdAndUpdate(product._id, { maUuDai: null }, { new: true });
      }
    }

    res.status(200).json({ message: 'Cập nhật trạng thái voucher thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/getUuDai-Active/:id', async (req, res) => {
  try {
    const idCuaHang = req.params.id;
    const uudai = await UuDai.find({maCuaHang: idCuaHang, trangThai: "Hoạt động"}).populate("maCuaHang");
    res.json(uudai);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})

router.get('/searchUuDaiByDiscount/:id', async (req, res) => {
  try {
    const idCuaHang = req.params.id
    const { minDiscount, maxDiscount, trangThai } = req.query;

    const uudai = await UuDai.find({
      giamGia: { $gte: parseFloat(minDiscount), $lte: parseFloat(maxDiscount) },
      maCuaHang: idCuaHang,
      trangThai: trangThai
    }).populate("maCuaHang");

    res.json(uudai);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;
