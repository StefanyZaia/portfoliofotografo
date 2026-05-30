import { Router } from "express";
import { deletePhoto } from "../controllers/photoController.js";

const router = Router();

router.delete("/:id", deletePhoto);

export default router;