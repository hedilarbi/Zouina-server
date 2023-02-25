const {
  createUser,
  loginUser,
  getUserByToken,
  updatePassword,
  updateUser,
  updateUserProfile,
  updateAddress,
  logout,
} = require("../controllers/users");
const express = require("express");
const { uploadImageToFirebase } = require("../firebase");
const Multer = require("../middlewares/multer");
const { optimizeImage } = require("../middlewares/imageOptimizor");

const router = express.Router();

router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/", getUserByToken);
router.put(
  "/update/profile/:id",
  Multer.single("file"),
  optimizeImage,
  uploadImageToFirebase,
  updateUserProfile
);
router.put("/logout/:id", logout);
router.put("/update/password/:id", updatePassword);
router.put("/update/user/:id", updateUser);
router.put("/update/address/:id", updateAddress);

module.exports = router;
