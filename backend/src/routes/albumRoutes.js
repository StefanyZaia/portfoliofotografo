import { Router } from "express";
import {
  createAlbum,
  listAlbums,
  deleteAlbum
} from "../controllers/albumController.js";

const router = Router();

router.get("/", listAlbums);
router.post("/", createAlbum);
router.delete("/:id", deleteAlbum);

export default router;