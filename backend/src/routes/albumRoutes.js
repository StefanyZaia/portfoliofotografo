import { Router } from "express";
import { upload } from "../config/multer.js";
import {
  createAlbum,
  listAlbums,
  deleteAlbum,
} from "../controllers/albumController.js";

const router = Router();

router.get("/", listAlbums);
router.post("/", upload.single("coverImage"), createAlbum);
router.delete("/:id", deleteAlbum);

export default router;