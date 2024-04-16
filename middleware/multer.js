const multer = require('multer');
const path = require('path')
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000},
  fileFilter: async function(req, file, cb){
    checkFileType(file, cb)
  }
}).single("hinhAnh")

const checkFileType = (file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  if (mimeType && extName){
    return cb(null, true)
  }else {
    cb("Error")
  }
}


module.exports = {upload};