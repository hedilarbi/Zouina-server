const express = require("express");
const { uploadImagesToFirebase } = require("../firebase");
const { uploadImage, RImage } = require("../controllers/images");
const multer = require("multer");
const router = express.Router();
const Multer = multer({
  storage: multer.memoryStorage(),
  limits: 1024 * 1024,
});
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
//   },
// });

router.post(
  "/upload",
  Multer.array("files"),
  uploadImagesToFirebase,
  uploadImage
);
router.get("/:image", RImage);

module.exports = router;
