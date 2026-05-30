import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

function getFileNameFromUrl(imageUrl) {
  try {
    const url = new URL(imageUrl);
    return path.basename(url.pathname);
  } catch {
    return path.basename(imageUrl);
  }
}

export async function deletePhoto(req, res) {
  try {
    const { id } = req.params;

    const photo = await prisma.photo.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!photo) {
      return res.status(404).json({
        message: "Foto não encontrada.",
      });
    }

    await prisma.photo.delete({
      where: {
        id: Number(id),
      },
    });

    const fileName = getFileNameFromUrl(photo.imageUrl);
    const filePath = path.join(process.cwd(), "uploads", fileName);

    try {
      await fs.unlink(filePath);
    } catch (fileError) {
      if (fileError.code !== "ENOENT") {
        console.warn("Não foi possível remover o arquivo da foto:", fileError.message);
      }
    }

    return res.json({
      message: "Foto excluída com sucesso.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao excluir foto.",
      error: error.message,
    });
  }
}