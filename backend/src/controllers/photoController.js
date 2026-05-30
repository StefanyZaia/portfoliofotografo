import { PrismaClient } from "@prisma/client";
import { deleteImageFromCloudinary } from "../config/cloudinary.js";

const prisma = new PrismaClient();

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

    if (photo.publicId) {
      await deleteImageFromCloudinary(photo.publicId);
    }

    await prisma.photo.delete({
      where: {
        id: Number(id),
      },
    });

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