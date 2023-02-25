const {
  getAvailableProfessionals,
  updateProfessional,
  getProfessionalByID,
  updateSchedual,
  professionalSetupProProfile,
  updateAvailability,
  updateGallery,
} = require("../controllers/professionals");
const multer = require("multer");
const express = require("express");
const {
  uploadImagesToFirebase,
  deleteImagesFromFirebase,
} = require("../firebase");
const { optimizeImages } = require("../middlewares/imageOptimizor");

const router = express.Router();
const Multer = multer({
  storage: multer.memoryStorage(),
  limits: 2 * 1024 * 1024,
});

router.get("/available", getAvailableProfessionals);
router.patch("/update/:id", updateProfessional);
router.get("/:id", getProfessionalByID);
router.put("/update/schedual/:id", updateSchedual);
router.put(
  "/update/profile/:id",
  Multer.array("files"),
  optimizeImages,
  uploadImagesToFirebase,
  professionalSetupProProfile
);
router.put(
  "/update/gallery/:id",
  Multer.array("files"),
  deleteImagesFromFirebase,
  optimizeImages,
  uploadImagesToFirebase,
  updateGallery
);

router.put("/update/availability/:id", updateAvailability);
module.exports = router;
