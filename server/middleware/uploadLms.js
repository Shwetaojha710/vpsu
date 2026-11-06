// LMS-only upload: allows lecture videos + documents without changing CMS upload rules

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const safeName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, safeName);
  }
});

function fileFilter(req, file, cb) {
  const ok =
    /\.(pdf|jpg|jpeg|png|webp|gif|doc|docx|ppt|pptx|mp4|webm|mov|mkv|avi)$/i.test(
      file.originalname
    );
  if (ok) cb(null, true);
  else cb(new Error('File type not allowed for LMS content'));
}

const uploadLms = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 200 * 1024 * 1024 } // 200 MB for lecture videos
});

module.exports = uploadLms;
