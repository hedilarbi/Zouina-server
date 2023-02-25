const {
  getClientByID,

  getClients,
} = require("../controllers/clients");

const express = require("express");

const router = express.Router();

router.get("/", getClients);

router.get("/:id", getClientByID);

module.exports = router;
