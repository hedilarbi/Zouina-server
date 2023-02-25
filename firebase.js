var admin = require("firebase-admin");

var serviceAccount = require("./firebase-key.json");

const BUCKET = "gs://zouina-9113e.appspot.com";
const BUCKET_NAME = "zouina-9113e.appspot.com";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET,
});

const bucket = admin.storage().bucket();

const uploadImageToFirebase = (req, res, next) => {
  if (!req.file) return next();
  const image = req.file;
  const imageName = Date.now() + "." + image.originalname.split(".").pop();

  const file = bucket.file(imageName);
  const stream = file.createWriteStream({
    metadata: {
      contentType: image.mimetype,
    },
  });

  stream.on("error", (e) => {
    console.log(e);
  });

  stream.on("finish", async () => {
    await file.makePublic();

    req.file.firebaseUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${imageName}`;

    next();
  });

  stream.end(image.buffer);
};

const uploadImagesToFirebase = (req, res, next) => {
  if (!req.files) return next();
  const images = req.files;
  let firebaseUrls = [];
  const promises = images.map((image) => {
    const imageName =
      Date.now() +
      "-" +
      image.originalname.slice(0, 4) +
      "." +
      image.originalname.split(".").pop();

    const file = bucket.file(imageName);
    const stream = file.createWriteStream({
      metadata: {
        contentType: image.mimetype,
      },
    });
    return new Promise((resolve, reject) => {
      stream.on("error", (e) => {
        console.log(e);
        reject(e);
      });

      stream.on("finish", async () => {
        await file.makePublic();
        firebaseUrls.push(
          `https://storage.googleapis.com/${BUCKET_NAME}/${imageName}`
        );
        resolve();
      });

      stream.end(image.buffer);
    });
  });
  Promise.all(promises)
    .then(() => {
      req.files.firebaseUrls = firebaseUrls;
      next();
    })
    .catch((err) => {
      return res.status(500).json({ message: err.message });
    });
};

const deleteImagesFromFirebase = async (req, res, next) => {
  if (!req.body.toDelete) return next();
  const images = req.body.toDelete;

  try {
    if (typeof req.body.toDelete === "object") {
      for (const image of images) {
        const imageName = image.split("/").pop();
        const file = bucket.file(imageName);
        await file.delete();
      }
    } else {
      const imageName = req.body.toDelete.split("/").pop();
      const file = bucket.file(imageName);
      await file.delete();
    }
  } catch (err) {
    return res.status(500).json({ message: "error in delete from firebase" });
  }

  next();
};

module.exports = {
  uploadImageToFirebase,
  uploadImagesToFirebase,
  deleteImagesFromFirebase,
};
