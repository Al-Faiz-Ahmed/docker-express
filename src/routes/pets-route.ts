import express from "express";
import { getAllPets } from "../controller/pets-controller";
const router: express.Router = express.Router();

router.get("/", getAllPets);

export default router;
