import { PrismaClient } from "@prisma/client";
import {
  deleteImageFromCloudinary,
  uploadBufferToCloudinary,
} from "../config/cloudinary.js";

const prisma = new PrismaClient();

export async function listAlbums(req, res) {
  try {
    const albums = await prisma.album.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        photos: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return res.json(albums);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao listar álbuns.",
      error: error.message,
    });
  }
}

export async function getAlbumById(req, res) {
  try {
    const { id } = req.params;

    const album = await prisma.album.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        photos: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!album) {
      return res.status(404).json({
        message: "Álbum não encontrado.",
      });
    }

    return res.json(album);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar álbum.",
      error: error.message,
    });
  }
}

export async function createAlbum(req, res) {
  try {
    const { title, date, location, description } = req.body;

    if (!title || !date || !location || !description) {
      return res.status(400).json({
        message: "Preencha todos os campos obrigatórios.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Envie uma imagem de capa para o álbum.",
      });
    }

    const uploadedCover = await uploadBufferToCloudinary(
      req.file.buffer,
      "portfoliofotografo/capas"
    );

    const album = await prisma.album.create({
      data: {
        title,
        date,
        location,
        description,
        coverImage: uploadedCover.secure_url,
        coverImagePublicId: uploadedCover.public_id,
      },
      include: {
        photos: true,
      },
    });

    return res.status(201).json(album);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar álbum.",
      error: error.message,
    });
  }
}

export async function addPhotosToAlbum(req, res) {
  try {
    const { id } = req.params;

    const album = await prisma.album.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!album) {
      return res.status(404).json({
        message: "Álbum não encontrado.",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Envie pelo menos uma foto.",
      });
    }

    const uploadedPhotos = await Promise.all(
      req.files.map((file) =>
        uploadBufferToCloudinary(file.buffer, "portfoliofotografo/fotos")
      )
    );

    const photosData = uploadedPhotos.map((uploadedPhoto) => ({
      imageUrl: uploadedPhoto.secure_url,
      publicId: uploadedPhoto.public_id,
      albumId: Number(id),
    }));

    await prisma.photo.createMany({
      data: photosData,
    });

    const updatedAlbum = await prisma.album.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        photos: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return res.status(201).json(updatedAlbum);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao adicionar fotos ao álbum.",
      error: error.message,
    });
  }
}

export async function updateAlbum(req, res) {
  try {
    const { id } = req.params;
    const { title, date, location, description } = req.body;

    const album = await prisma.album.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!album) {
      return res.status(404).json({
        message: "Álbum não encontrado.",
      });
    }

    if (!title || !date || !location || !description) {
      return res.status(400).json({
        message: "Preencha todos os campos obrigatórios.",
      });
    }

    const data = {
      title,
      date,
      location,
      description,
    };

    if (req.file) {
      if (album.coverImagePublicId) {
        await deleteImageFromCloudinary(album.coverImagePublicId);
      }

      const uploadedCover = await uploadBufferToCloudinary(
        req.file.buffer,
        "portfoliofotografo/capas"
      );

      data.coverImage = uploadedCover.secure_url;
      data.coverImagePublicId = uploadedCover.public_id;
    }

    const updatedAlbum = await prisma.album.update({
      where: {
        id: Number(id),
      },
      data,
      include: {
        photos: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return res.json(updatedAlbum);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar álbum.",
      error: error.message,
    });
  }
}

export async function deleteAlbum(req, res) {
  try {
    const { id } = req.params;

    const album = await prisma.album.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        photos: true,
      },
    });

    if (!album) {
      return res.status(404).json({
        message: "Álbum não encontrado.",
      });
    }

    if (album.coverImagePublicId) {
      await deleteImageFromCloudinary(album.coverImagePublicId);
    }

    await Promise.all(
      album.photos.map((photo) => {
        if (photo.publicId) {
          return deleteImageFromCloudinary(photo.publicId);
        }

        return Promise.resolve();
      })
    );

    await prisma.album.delete({
      where: {
        id: Number(id),
      },
    });

    return res.json({
      message: "Álbum excluído com sucesso.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao excluir álbum.",
      error: error.message,
    });
  }
}