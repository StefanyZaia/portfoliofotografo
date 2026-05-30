import { Router } from "express";
import { upload } from "../config/multer.js";
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

router.post("/", upload.single("coverImage"), createAlbum);
router.post("/:id/photos", upload.array("photos", 30), addPhotosToAlbum);

router.put("/:id", upload.single("coverImage"), updateAlbum);

router.delete("/:id", deleteAlbum);

export default router;