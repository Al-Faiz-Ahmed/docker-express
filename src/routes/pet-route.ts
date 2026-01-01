import express from "express";
import { getPetById, createPet } from "../controller/pet-controller";
const router: express.Router = express.Router();

router.get("/:id", getPetById);
router.post("/create", createPet);
// router.post("/");

export default router;
