import express from "express";
import { getAllPets,seedPets,deletePets,truncatePetsTable } from "../controller/pets-controller";
const router: express.Router = express.Router();

router.get("/", getAllPets);
router.post("/seed-pets", seedPets);
router.delete("/delete-pets", deletePets);
router.delete("/truncate-pets", truncatePetsTable);


export default router;
