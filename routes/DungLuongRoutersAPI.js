var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../models/DungLuong')

const DungLuong = mongoose.model("dungluong")
 

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST Mau. */

router.post('/addDungLuong', function(req, res, next) {
    const dungluong = new DungLuong({
    boNho: req.body.boNho,
  })
  // console.log(dungluong);
  dungluong.save()
  .then(data => {
    // console.log(data)
    res.send(data)
  }).catch(err => {
    console.log
  })
});

/* GET loaidichvu listing. */
router.get('/getDungLuong', async (req,res) => {
  try {
    const dungluong = await DungLuong.find();
    res.json(dungluong);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.delete('/deleteDungLuong/:id', async (req,res) => {
  try{
    const data =  await DungLuong.findByIdAndDelete(req.params.id)
    if(!data){
      return res.status(404).json({message: "delete failed"})
    }else{
      return res.status(200).json({message: "delete successful"})
    }
  }catch(err){
    return res.status(500).json({message: err.message})

  }
})


router.put("/updateDungLuong/:id", async (req, res ) => {
  try{
    const data = await DungLuong.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!data){
      return res.status(404).json({message: "update failed"})

    }else{
      return res.status(200).json({message: "update successful"})

    }
  }catch(err){
    return res.status(500).json({message: err.message})
  }
})

router.get('/searchDungLuong', async (req,res) => {
  try {
    const { boNho } = req.query;
    let dungLuong = await DungLuong.find();
    if (boNho){
      dungLuong = await DungLuong.find({ boNho: Number(boNho) });
    }
    res.json(dungLuong);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})
module.exports = router;
