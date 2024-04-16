var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
require('../models/CuaHang')

const CuaHang = mongoose.model("cuaHang");
 

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST Mau. */

router.post('/addCuaHang', function(req, res, next) {
    const cuaHang = new CuaHang({
    diaChi: req.body.diaChi,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    sdt: req.body.sdt,
    phanQuyen: req.body.phanQuyen,
    trangThai: req.body.trangThai,
  })
  cuaHang.save()
  .then(data => {
    // console.log(data)
    res.send(data)
  }).catch(err => {
    console.log
  })
});

/* lấy danh sách cửa hàng trừ tài khoản đăng nhập */
router.get('/getCuaHang/:id', async (req,res) => {
  try {
    const idToExclude = req.params.id;
    const cuaHang = await CuaHang.find({ _id: { $ne: idToExclude } });
    res.json(cuaHang);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.delete('/deleteCuaHang/:id', async (req,res) => {
  try{
    const data =  await CuaHang.findByIdAndDelete(req.params.id)
    if(!data){
      return res.status(404).json({message: "delete failed"})
    }else{
      return res.status(200).json({message: "delete successful"})
    }
  }catch(err){
    return res.status(500).json({message: err.message})

  }
})


router.put("/updateCuaHang/:id", async (req, res ) => {
  // try{
  //   const data = await CuaHang.findByIdAndUpdate(req.params.id, req.body, {new: true})
  //   if(!data){
  //     return res.status(404).json({message: "update failed"})
  //
  //   }else{
  //     return res.status(200).json({message: "update successful"})
  //
  //   }
  // }catch(err){
  //   return res.status(500).json({message: err.message})
  // }
  const allowedUpdates = ['diaChi', 'username', 'password', 'email', 'sdt', 'phanQuyen', 'trangThai'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const cuaHang = await CuaHang.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!cuaHang) {
      return res.status(404).send({ message: "Cua hang not found" });
    }

    res.status(200).send({ message: "Update successful", cuaHang });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
})

router.post('/dangNhapCuaHang', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ successMessage: 'Vui lòng nhập email và mật khẩu.' });
        }

        const cuaHang = await CuaHang.findOne({ email });

        if (!cuaHang) {
            return res.status(401).json({ successMessage: 'Email không tồn tại.' });
        }
        
    

        if (password !== cuaHang.password) {
            return res.status(401).json({ successMessage: 'Mật khẩu không đúng.' });
        }

        return res.status(200).json({ successMessage: 'Đăng nhập thành công.', cuaHang });
    } catch (error) {
        console.error(error);
        res.status(500).json({ successMessage: 'Lỗi server.' });
    }
});

router.post("/doiMatKhauCuaHang/:id", async (req, res ) => {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword, rePassword } = req.body;

    if (!oldPassword || !newPassword || !rePassword) {
      return res.status(400).json({ message: "Nhập đủ thông tin" });
    }

    if (newPassword !== rePassword) {
      return res.status(400).json({ message: "Mật khẩu nhập lại không khớp" });
    }

    const user = await CuaHang.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    if (oldPassword !== user.password) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    }

    // Mã hóa mật khẩu mới và cập nhật vào người dùng
    user.password = newPassword;
    const updatedUser = await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công"});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

router.get('/searchCuaHang/:id', async (req, res) => {
  try {
    const { diaChi, username, email, sdt, trangThai } = req.query;

    // Tạo object chứa các điều kiện tìm kiếm
    const searchConditions = {};
    if (diaChi) searchConditions.diaChi = { $regex: new RegExp(diaChi, 'i') }; // Tìm kiếm không phân biệt chữ hoa chữ thường
    if (username) searchConditions.username = { $regex: new RegExp(username, 'i') };
    if (email) searchConditions.email = { $regex: new RegExp(email, 'i') };
    if (sdt) searchConditions.sdt = { $regex: new RegExp(sdt, 'i') };
    if (trangThai) searchConditions.trangThai = trangThai;
    searchConditions._id = { $ne: req.params.id }
    // Tìm kiếm cửa hàng dựa trên các điều kiện
    const foundStores = await CuaHang.find(searchConditions);
    res.json(foundStores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;
