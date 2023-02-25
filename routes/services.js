const express = require("express");
const {
  createService,
  getServicesByCategory,
  getServices,
} = require("../controllers/services");

const router = express.Router();

router.post("/create", createService);
router.get("/all", getServices);
router.get("/:category", getServicesByCategory);

module.exports = router;
