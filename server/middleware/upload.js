// this file saves uploaded pdf / images into the uploads folder

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    // unique name so two files never overwrite each other
    const safeName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, safeName);
  }
});

function fileFilter(req, file, cb) {
  const ok = /\.(pdf|jpg|jpeg|png|webp|gif)$/i.test(file.originalname);
  if (ok) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and image files are allowed'));
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

module.exports = upload;
