import express from "express";
import { getPetById,deletePetById, createPet } from "../controller/pet-controller";
const router: express.Router = express.Router();

router.get("/:id", getPetById);
router.post("/create", createPet);
router.delete("/:id/delete", deletePetById)
// router.post("/");

export default router;
