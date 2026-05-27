const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

function makeStorage(folder) {
  const dest = path.join(__dirname, '..', 'public', 'uploads', folder);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename:    (req, file, cb) => {
      const ext  = path.extname(file.originalname).toLowerCase();
      cb(null, `${folder}_${Date.now()}${ext}`);
    }
  });
}

function imageFilter(req, file, cb) {
  const ok = /jpeg|jpg|png|gif|webp/.test(file.mimetype);
  cb(ok ? null : new Error('Only image files allowed'), ok);
}

function docFilter(req, file, cb) {
  const ok = /jpeg|jpg|png|gif|webp|pdf/.test(file.mimetype);
  cb(ok ? null : new Error('Only images or PDF allowed'), ok);
}

exports.galleryUpload = multer({
  storage: makeStorage('gallery'),
  limits:  { fileSize: 8 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single('photo');

exports.committeeUpload = multer({
  storage: makeStorage('committee'),
  limits:  { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single('photo');

exports.memberUpload = multer({
  storage: makeStorage('members'),
  limits:  { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
}).single('photo');

exports.certificateUpload = multer({
  storage: makeStorage('certificates'),
  limits:  { fileSize: 10 * 1024 * 1024 },
  fileFilter: docFilter,
}).single('certificate');

/* Combined: member photo + certificate in one request */
exports.memberFields = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const folder = file.fieldname === 'certificate' ? 'certificates' : 'members';
      const dest   = path.join(__dirname, '..', 'public', 'uploads', folder);
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${file.fieldname}_${Date.now()}${ext}`);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: docFilter,
}).fields([
  { name: 'photo',       maxCount: 1 },
  { name: 'certificate', maxCount: 1 },
]);
