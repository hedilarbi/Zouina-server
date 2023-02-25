const Image = require("../models/Image");
const fs = require("fs");
const path = require("path");

const uploadImage = async (req, res) => {
  const data = req.files;
  console.log(req.files.firebaseUrls);
  res.json({ message: "aaa" });
};

const RImage = async (req, res) => {
  const imagepath =
    "uploads//file-1673520151032-pexels-engin-akyurt-3065209.jpg";
  res.sendFile(imagepath);
};

module.exports = { uploadImage, RImage };
