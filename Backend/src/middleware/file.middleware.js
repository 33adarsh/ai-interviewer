import multer from "multer";
import os from "os";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir())
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage });

// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: {
//         fileSize: 3 * 1024 * 1024 // 3MB
//     }
// })

export default upload;