var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../models/DienThoai')
require('../models/HangSanXuat')
const axios = require('axios');
const {authenticateToken, baseUrl} = require('../middleware/index');
const {getStorage, ref, uploadBytesResumable, getDownloadURL} = require("firebase/storage");
const {firebaseApp} = require("../middleware/firebaseConfig");
const {v4: uuidv4} = require("uuid");
const {upload} = require("../middleware/multer");


const DienThoai = mongoose.model("dienthoai")

/* GET DienThoai listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/addDienThoai', async function (req, res, next) {

  try {
    const dienthoai = new DienThoai({
      tenDienThoai: req.body.tenDienThoai,
      kichThuoc: req.body.kichThuoc,
      congNgheManHinh: req.body.congNgheManHinh,
      camera: req.body.camera,
      cpu: req.body.cpu,
      pin: req.body.pin,
      heDieuHanh: req.body.heDieuHanh,
      doPhanGiai: req.body.doPhanGiai,
      namSanXuat: req.body.namSanXuat,
      thoiGianBaoHanh: req.body.thoiGianBaoHanh,
      moTaThem: req.body.moTaThem,
      maHangSX: req.body.maHangSX,
      hinhAnh: req.body.hinhAnh,
      maUuDai: req.body.maUuDai,
      maCuaHang: req.body.maCuaHang,
    })

    const savedDienThoai = await dienthoai.save(); // Lưu đối tượng
    const populatedDienThoai = await DienThoai.findById(savedDienThoai._id)
        .populate("maCuaHang")
        .populate("maHangSX")
        .populate({path: 'maUuDai', populate: 'maCuaHang'});

    // console.log(populatedDienThoai);
    res.send(populatedDienThoai);
  } catch (err) {
    console.log(err);
    res.status(500).send(err); // Trả về lỗi nếu có lỗi xảy ra
  }
});

// router.get("/getDienThoaiByID/:id", async (req, res) => {
//   try {
//     const data = await DienThoai.findById(req.params.id, req.body, {new: true})
//     res.json(data)
//   } catch (err) {
//     return res.status(500).json({message: err.message})
//   }
// })


router.get('/getDienThoai', async (req, res) => {
  try {
    const dienThoai = await DienThoai.find()
        .populate({path: 'maUuDai', populate: 'maCuaHang'})
        .populate('maHangSX')
        .populate('maCuaHang')
    res.json(dienThoai);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
})


router.delete('/deleteDienThoai/:id', async (req, res) => {
  try {
    const data = await DienThoai.findByIdAndDelete(req.params.id)
    if (!data) {
      return res.status(404).json({message: "delete failed"})
    } else {
      return res.status(200).json({message: "delete successful"})
    }
  } catch (err) {
    return res.status(500).json({message: err.message})

  }
})


router.put("/updateDienThoai/:id", async (req, res) => {
  try {
    const data = await DienThoai.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if (!data) {
      return res.status(404).json({message: "update failed"})

    } else {
      return res.status(200).json({message: "update successful"})

    }
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
})
router.put("/updateMaUuDaiDienThoai/:id", async (req, res) => {
  try {
    const dienThoaiId = req.params.id;
    const newMaUuDai = req.body._id;


    const existingDienThoai = await DienThoai.findById(dienThoaiId);
    if (!existingDienThoai) {
      return res.status(404).json({message: "Điện thoại không tồn tại"});
    }

    existingDienThoai.maUuDai = newMaUuDai;
    const updatedDienThoai = await existingDienThoai.save();
    const dienThoai = await DienThoai.findById(updatedDienThoai._id)
        .populate("maCuaHang")
        .populate("maHangSX")
        .populate({path: 'maUuDai', populate: 'maCuaHang'});

    res.status(200).json(dienThoai);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// router.get("/getDienthoaiTheoHangSanXuat/:id", async (req, res) => {
//   try {
//     const idHangSanXuat = req.params.id;
//     const dienThoai = await DienThoai.find({maHangSX: idHangSanXuat})
//         .populate('maHangSX', '_id')
//         .populate('maHangSX')
//     res.json(dienThoai)
//   } catch (error) {
//     return res.status(500).json({message: error.message})
//   }
// })
//get theo maCuaHang
router.get("/getDienthoaiTheoCuaHang/:id", async (req, res) => {
  try {
    const idCuaHang = req.params.id;
    const dienThoai = await DienThoai.find({maCuaHang: idCuaHang})
        .populate("maCuaHang")
        .populate("maHangSX")
        .populate({path: 'maUuDai', populate: 'maCuaHang'})
    res.json(dienThoai)
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
})


router.put("/updateUuDaiDienThoai/:id", async (req, res) => {
  try {
    const data = await DienThoai.findByIdAndUpdate(req.params.id, {maUuDai: req.body.maUuDai}, {new: true})
    if (!data) {
      return res.status(404).json({message: "update failed", data})
    } else {
      return res.status(200).json({message: "update successful", data})
    }
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
})

router.get("/getDienThoaiByID/:id", async (req, res) => {
  try {
    const data = await DienThoai.find({_id: req.params.id})
        .populate({path: 'maUuDai', populate: 'maCuaHang'})
        .populate('maHangSX')
        .populate('maCuaHang')
    res.json(data)
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
})

//lấy danh sách điện thoại và chi tiết điện thoại theo điện thoại
router.get('/getDienThoaiVaChiTiet/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Lấy danh sách điện thoại từ API
    const dienThoaiList = await axios.get(`${baseUrl}dienthoais/getDienthoaiTheoCuaHang/${userId}`);
    const dienThoaiData = dienThoaiList.data;

    // Kết hợp dữ liệu chi tiết điện thoại cho từng điện thoại
    const dienThoaiVaChiTiet = await Promise.all(dienThoaiData.map(async (dienThoai) => {
      const maDienThoai = dienThoai._id; // Lấy mã điện thoại để truy vấn chi tiết
      const chiTietList = await axios.get(`${baseUrl}chitietdienthoais/getChiTietTheoDienThoai/${maDienThoai}`);
      const chiTietData = chiTietList.data;
      return {...dienThoai, chiTiet: chiTietData};
    }));

    res.json(dienThoaiVaChiTiet);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

router.get('/searchPhones/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const {tenDienThoai, tenHang, boNho, RAM, tenMau, giaTien} = req.query;

    const response = await axios.get(`${baseUrl}dienthoais/getDienThoaiVaChiTiet/${userId}`);
    let phones = response.data;

    if (tenDienThoai) {
      phones = phones.filter(phone =>
          phone.tenDienThoai.toLowerCase().includes(tenDienThoai.toLowerCase())
      );
    }
    if (tenHang) {
      phones = phones.filter(phone =>
          phone.maHangSX.tenHang.toLowerCase().includes(tenHang.toLowerCase())
      );
    }

    phones.forEach(phone => {
      if (phone.chiTiet && phone.chiTiet.length > 0) {
        phone.chiTiet = phone.chiTiet.filter(detail =>
            (!tenMau || (detail.maMau && detail.maMau.tenMau.toLowerCase().includes(tenMau.toLowerCase()))) &&
            (!boNho || (detail.maDungLuong && detail.maDungLuong.boNho.toString().toLowerCase().includes(boNho.toString().toLowerCase()))) &&
            (!RAM || (detail.maRam && detail.maRam.RAM.toString().toLowerCase().includes(RAM.toString().toLowerCase()))) &&
            (!giaTien || (detail.giaTien && detail.giaTien.toString().toLowerCase().includes(giaTien.toString().toLowerCase())))
        );
      }
    });

    phones = phones.filter(phone => phone.chiTiet && phone.chiTiet.length > 0);

    res.json(phones);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

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

router.post('/addDienThoaiFirebase', upload, async (req, res, next) => {
  try {
    const file = {
      type: req.file.mimetype,
      buffer: req.file.buffer
    }
    const buildImage = await uploadImage(file,'single');

    const dienThoai = new DienThoai({
      tenDienThoai: req.body.tenDienThoai,
      kichThuoc: req.body.kichThuoc,
      congNgheManHinh: req.body.congNgheManHinh,
      camera: req.body.camera,
      cpu: req.body.cpu,
      pin: req.body.pin,
      heDieuHanh: req.body.heDieuHanh,
      doPhanGiai: req.body.doPhanGiai,
      namSanXuat: req.body.namSanXuat,
      thoiGianBaoHanh: req.body.thoiGianBaoHanh,
      moTaThem: req.body.moTaThem,
      maHangSX: req.body.maHangSX,
      maUuDai: req.body.maUuDai ? req.body.maUuDai : null,
      maCuaHang: req.body.maCuaHang,
      hinhAnh: buildImage,
    });

    const savedDienThoai = await dienThoai.save();
    res.status(201).json(savedDienThoai);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.put("/updateDienThoaiFirebase/:id", upload, async (req, res ) => {
  try{
    const id = req.params.id;

    let hinhAnhURL = '';
    if (req.file) {
      const file = {
        type: req.file.mimetype,
        buffer: req.file.buffer
      }
      hinhAnhURL = await uploadImage(file,'single');
    }

    const updatedDienThoai = {};
    if (req.body.tenDienThoai) updatedDienThoai.tenDienThoai = req.body.tenDienThoai;
    if (req.body.kichThuoc) updatedDienThoai.kichThuoc = req.body.kichThuoc;
    if (req.body.congNgheManHinh) updatedDienThoai.congNgheManHinh = req.body.congNgheManHinh;
    if (req.body.camera) updatedDienThoai.camera = req.body.camera;
    if (req.body.cpu) updatedDienThoai.cpu = req.body.cpu;
    if (req.body.pin) updatedDienThoai.pin = req.body.pin;
    if (req.body.heDieuHanh) updatedDienThoai.heDieuHanh = req.body.heDieuHanh;
    if (req.body.doPhanGiai) updatedDienThoai.doPhanGiai = req.body.doPhanGiai;
    if (req.body.namSanXuat) updatedDienThoai.namSanXuat = req.body.namSanXuat;
    if (req.body.thoiGianBaoHanh) updatedDienThoai.thoiGianBaoHanh = req.body.thoiGianBaoHanh;
    if (req.body.moTaThem) updatedDienThoai.moTaThem = req.body.moTaThem;
    if (req.body.maHangSX) updatedDienThoai.maHangSX = req.body.maHangSX;
    if (req.body.maUuDai) updatedDienThoai.maUuDai = req.body.maUuDai;
    if (req.body.maCuaHang) updatedDienThoai.maCuaHang = req.body.maCuaHang;
    if (hinhAnhURL) updatedDienThoai.hinhAnh = hinhAnhURL;

    const data = await DienThoai.findByIdAndUpdate(id, updatedDienThoai, { new: true });

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
