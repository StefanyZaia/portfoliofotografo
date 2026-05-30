import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { deletePhoto } from "../controllers/photoController.js";

const router = Router();

router.delete("/:id", authMiddleware, deletePhoto);

export default router;