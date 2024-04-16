var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../models/GioHang')

const GioHang = mongoose.model("gioHang")
 

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST Mau. */

router.post('/addGioHang', function(req, res, next) {
    const gioHang = new GioHang({
    soLuong: req.body.soLuong,
    tongTien: req.body.tongTien,
    maKhachHang: req.body.maKhachHang
  })
  gioHang.save()
  .then(data => {
    // console.log(data)
    res.send(data)
  }).catch(err => {
    console.log
  })
});

/* GET loaidichvu listing. */
router.get('/getGioHang', async (req,res) => {
  try {
    const gioHang = await GioHang.find();
    res.json(gioHang);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.delete('/deleteGioHang/:id', async (req,res) => {
  try{
    const data =  await GioHang.findByIdAndDelete(req.params.id)
    if(!data){
      return res.status(404).json({message: "delete failed"})
    }else{
      return res.status(200).json({message: "delete successful"})
    }
  }catch(err){
    return res.status(500).json({message: err.message})

  }
})


router.put("/updateGioHang/:id", async (req, res ) => {
  try{
    const data = await GioHang.findByIdAndUpdate(req.params.id, req.body, {new: true})
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
