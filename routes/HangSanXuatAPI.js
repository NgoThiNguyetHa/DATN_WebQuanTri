var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../models/HangSanXuat')
require('dotenv').config;
const {firebaseApp} = require('../middleware/firebaseConfig')
const {getStorage, ref, uploadBytesResumable, getDownloadURL} = require('firebase/storage')
const { v4: uuidv4 } = require('uuid');
const {upload} = require("../middleware/multer");

const HangSanXuat = mongoose.model("hangSanXuat")

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST Mau. */

router.post('/addHangSanXuat', function(req, res, next) {
    const hangSanXuat = new HangSanXuat({
    tenHang: req.body.tenHang,
    hinhAnh: req.body.hinhAnh,
    // maCuaHang: req.body.maCuaHang,
  })
  hangSanXuat.save()
  .then(data => {
    // console.log(data)
    res.send(data)
  }).catch(err => {
    console.log
  })
});

/* GET loaidichvu listing. */
router.get('/getHangSanXuat', async (req,res) => {
  try {
    const hangSanXuat = await HangSanXuat.find();
    res.json(hangSanXuat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.get('/getHangSanXuatTheoCuaHang/:maCuaHang', async (req,res) => {
  try {
    const maCuaHang = req.params.maCuaHang;
    const hangSanXuat = await HangSanXuat.find({ maCuaHang });
    res.json(hangSanXuat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.delete('/deleteHangSanXuat/:id', async (req,res) => {
  try{
    const data =  await HangSanXuat.findByIdAndDelete(req.params.id)
    if(!data){
      return res.status(404).json({message: "delete failed"})
    }else{
      return res.status(200).json({message: "delete successful"})
    }
  }catch(err){
    return res.status(500).json({message: err.message})

  }
})


router.put("/updateHangSanXuat/:id", async (req, res ) => {
  try{
    const data = await HangSanXuat.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!data){
      return res.status(404).json({message: "update failed"})

    }else{
      return res.status(200).json({message: "update successful"})

    }
  }catch(err){
    return res.status(500).json({message: err.message})
  }
})

router.get('/searchHangSanXuat', async (req,res) => {
  try {
    const { tenHang } = req.query;
    const hangSanXuat = await HangSanXuat.find({ tenHang: { $regex: tenHang, $options: 'i' } });

    res.json(hangSanXuat);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

async function uploadImage(file, quantity) {
      const storageFB = getStorage(firebaseApp);
      const randomString = uuidv4();
      if (quantity === 'single') {
        const dateTime = Date.now();
        const fileName = `${dateTime}${randomString}`;
        const storageRef = ref(storageFB, fileName);
        const metadata = { contentType: file.type };
        await uploadBytesResumable(storageRef, file.buffer, metadata);
        const downloadURL = await getDownloadURL(ref(storageFB, fileName));
        return downloadURL
      }
}
router.post('/addHangSanXuatFirebase', upload, async (req, res, next) => {
  try {
    const file = {
      type: req.file.mimetype,
      buffer: req.file.buffer
    }
    const buildImage = await uploadImage(file,'single');

    const hangSanXuat = new HangSanXuat({
      tenHang: req.body.tenHang,
      hinhAnh: buildImage,
    });

    const savedHangSanXuat = await hangSanXuat.save();
    res.status(201).json(savedHangSanXuat);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.put("/updateHangSanXuatFirebase/:id", upload, async (req, res ) => {
  try{
    const id = req.params.id;
    const { tenHang } = req.body;

    let hinhAnhURL = '';
    if (req.file) {
      const file = {
        type: req.file.mimetype,
        buffer: req.file.buffer
      }
      hinhAnhURL = await uploadImage(file,'single');
    }

    const updatedHangSanXuat = {};
    if (tenHang) updatedHangSanXuat.tenHang = tenHang;
    if (hinhAnhURL) updatedHangSanXuat.hinhAnh = hinhAnhURL;

    const data = await HangSanXuat.findByIdAndUpdate(id, updatedHangSanXuat, { new: true });

    if (!data) {
      return res.status(404).json({ message: "update failed" });
    } else {
      return res.status(200).json({ message: "update successful", data });
    }
  }catch(err){
    return res.status(500).json({message: err.message})
  }
})
module.exports = router;
