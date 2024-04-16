var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../models/Mau')

const Mau = mongoose.model("mau")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* POST Mau. */

router.post('/addMau', function(req, res, next) {
    const mau = new Mau({
    tenMau: req.body.tenMau,
  })
  // console.log("zzzz", req.body.tenMau)
  mau.save()
  .then(data => {
    // console.log(data)
    res.send(data)
  }).catch(err => {
    console.log
  })
});

/* GET loaidichvu listing. */
router.get('/getMau', async (req,res) => {
  try {
    const mau = await Mau.find();
    res.json(mau);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.delete('/deleteMau/:id', async (req,res) => {
  try{
    const data =  await Mau.findByIdAndDelete(req.params.id)
    if(!data){
      return res.status(404).json({message: "delete failed"})
    }else{
      return res.status(200).json({message: "delete successful"})
    }
  }catch(err){
    return res.status(500).json({message: err.message})

  }
})


router.put("/updateMau/:id", async (req, res ) => {
  try{
    const data = await Mau.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!data){
      return res.status(404).json({message: "update failed"})

    }else{
      return res.status(200).json({message: "update successful"})

    }
  }catch(err){
    console.log(err)
    return res.status(500).json({message: err.message})
  }
})

router.get('/searchMau', async (req,res) => {
  try {
    const { tenMau } = req.query;
    const mau = await Mau.find({ tenMau: { $regex: tenMau, $options: 'i' } });

    res.json(mau);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;
