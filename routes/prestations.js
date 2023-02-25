const express = require("express");
const {
  createPrestation,
  acceptPrestation,
  refusePrestation,
  cancelPrestation,
  finishedPrestation,
  getAcceptedScheduledProfessionalPrestations,
  getImmediateClientPrestations,
  getScheduledClientPrestations,
  getPrestation,
  getImmediateProfessionalPrestations,
  getScheduledProfessionalPrestations,
  getProfessionalPrestation,
  reviewPrestation,
  getPrestationByID,
  getPrestationReviewState,
  professionalAtDestination,
} = require("../controllers/prestations");

const router = express.Router();

router.post("/create", createPrestation);

router.get("/client/immediately/:id", getImmediateClientPrestations);
router.get("/client/schedual/:id", getScheduledClientPrestations);
router.get("/prestation/client/:id", getPrestation);
router.get(
  "/professional/immediately/:id",
  getImmediateProfessionalPrestations
);
router.get("/professional/schedual/:id", getScheduledProfessionalPrestations);
router.get("/prestation/professional/:id", getProfessionalPrestation);
router.get(
  "/professional/schedual/accepted/:id",
  getAcceptedScheduledProfessionalPrestations
);
router.get("/prestation/review_state/:id", getPrestationReviewState);
router.put("/prestation/review/:id", reviewPrestation);
router.put("/prestation/refuse/:id", refusePrestation);
router.put("/prestation/accept/:id", acceptPrestation);
router.put("/prestation/finish/:id", finishedPrestation);
router.put("/prestation/cancel/:id", cancelPrestation);
router.put("/prestation/destination/:id", professionalAtDestination);
router.get("/prestation/:id", getPrestationByID);

module.exports = router;
