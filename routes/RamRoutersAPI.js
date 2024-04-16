var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../models/Ram')

const Ram = mongoose.model("ram")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST Mau. */

router.post('/addRam', function(req, res, next) {
    const ram = new Ram({
    RAM: req.body.RAM,
  })
  ram.save()
  .then(data => {
    // console.log(data)
    res.send(data)
  }).catch(err => {
    console.log
  })
});
 

/* GET loaidichvu listing. */
router.get('/getRam', async (req,res) => {
  try {
    const ram = await Ram.find();
    res.json(ram);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.delete('/deleteRam/:id', async (req,res) => {
  try{
    const data =  await Ram.findByIdAndDelete(req.params.id)
    if(!data){
      return res.status(404).json({message: "delete failed"})
    }else{
      return res.status(200).json({message: "delete successful"})
    }
  }catch(err){
    return res.status(500).json({message: err.message})

  }
})


router.put("/updateRam/:id", async (req, res ) => {
  try{
    const data = await Ram.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!data){
      return res.status(404).json({message: "update failed"})

    }else{
      return res.status(200).json({message: "update successful"})

    }
  }catch(err){
    return res.status(500).json({message: err.message})
  }
})

router.get('/searchRAM', async (req,res) => {
  try {
    const { RAM } = req.query;
    let ram = await Ram.find();
    if (RAM){
      ram = await Ram.find({ RAM: Number(RAM) });
    }
    res.json(ram);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})
module.exports = router;
