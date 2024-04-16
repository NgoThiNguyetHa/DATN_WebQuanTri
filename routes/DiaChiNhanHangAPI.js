var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../models/DiaChiNhanHang')

const DiaChiNhanHang = mongoose.model("diaChiNhanHang")
 

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST Mau. */
router.post('/addDiaChiNhanHang',async function(req, res, next) {
    try {
      const diaChiNhanHang = new DiaChiNhanHang({
        maKhachHang: req.body.maKhachHang,
        sdt: req.body.sdt,
        tenNguoiNhan: req.body.tenNguoiNhan,
        diaChi: req.body.diaChi
      });
      const savedDiaChiNhanHang = await diaChiNhanHang.save(); // Lưu đối tượng
      const populatedDiaChiNhanHang= await DiaChiNhanHang.findById(savedDiaChiNhanHang._id)
      .populate('maKhachHang', '_id')
      .populate('maKhachHang');
      res.send(populatedDiaChiNhanHang);
    } catch (error) {
      console.log(err);
    res.status(500).send(err);
    }
});

/* GET theo khách hàng listing. */
router.get('/getDiaChiNhanHang/:id', async (req,res) => {
  try {
    //const diaChiNhanHang = await DiaChiNhanHang.find();
    const idKhachHang = req.params.id;
    const diaChi = await DiaChiNhanHang.find({ maKhachHang: idKhachHang })
        .populate('maKhachHang', '_id')
        .populate('maKhachHang');
    res.json(diaChi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.delete('/deleteDiaChiNhanHang/:id', async (req,res) => {
  try{
    const data =  await DiaChiNhanHang.findByIdAndDelete(req.params.id)
    if(!data){
      return res.status(404).json({message: "delete failed"})
    }else{
      return res.status(200).json({message: "delete successful"})
    }
  }catch(err){
    return res.status(500).json({message: err.message})

  }
})


router.put("/updateDiaChiNhanHang/:id", async (req, res ) => {
  try{
    const data = await DiaChiNhanHang.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!data){
      return res.status(404).json({message: "update failed"})

    }else{
      return res.status(200).json({message: "update successful"})

    }
  }catch(err){
    return res.status(500).json({message: err.message})
  }
})

module.exports = router;
