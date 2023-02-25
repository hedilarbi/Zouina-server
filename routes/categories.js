const { getCategories, createCategory } = require("../controllers/categories");
const express = require("express");

const router = express.Router();

router.post("/create", createCategory);
router.get("/", getCategories);

module.exports = router;
