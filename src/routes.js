import { Router } from "express";
import {
  refreshCountries,
  getAllCountries,
  getCountryByName,
  deleteCountry,
  getStatus,
  getSummaryImage,
} from "./controllers/countriesController.js";

const router = Router();

router.post("/countries/refresh", refreshCountries);
router.get("/countries", getAllCountries);
router.get("/countries/:name", getCountryByName);
router.delete("/countries/:name", deleteCountry);
router.get("/status", getStatus);
router.get("/countries/image", getSummaryImage);

export default router;
