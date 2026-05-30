import { Router } from "express";
import { upload } from "../config/multer.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createAlbum,
  listAlbums,
  getAlbumById,
  addPhotosToAlbum,
  updateAlbum,
  deleteAlbum,
} from "../controllers/albumController.js";

const router = Router();

router.get("/", listAlbums);
router.get("/:id", getAlbumById);

router.post("/", authMiddleware, upload.single("coverImage"), createAlbum);
router.post(
  "/:id/photos",
  authMiddleware,
  upload.array("photos", 30),
  addPhotosToAlbum
);

router.put("/:id", authMiddleware, upload.single("coverImage"), updateAlbum);

router.delete("/:id", authMiddleware, deleteAlbum);

export default router;