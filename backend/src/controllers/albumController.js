import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getBaseUrl(req) {
  if (process.env.PUBLIC_API_URL) {
    return process.env.PUBLIC_API_URL.replace(/\/$/, "");
  }

  return `${req.protocol}://${req.get("host")}`;
}

export async function listAlbums(req, res) {
  try {
    const albums = await prisma.album.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        photos: true,
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

    const coverImage = `${getBaseUrl(req)}/uploads/${req.file.filename}`;

    const album = await prisma.album.create({
      data: {
        title,
        date,
        location,
        description,
        coverImage,
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

    const baseUrl = getBaseUrl(req);

    const photosData = req.files.map((file) => ({
      imageUrl: `${baseUrl}/uploads/${file.filename}`,
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
      data.coverImage = `${getBaseUrl(req)}/uploads/${req.file.filename}`;
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
