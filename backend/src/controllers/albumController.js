import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// Controladores para gerenciar álbuns
export async function listAlbums(req, res) {
  try {
    const albums = await prisma.album.findMany({
        // Ordena os álbuns do mais recente para o mais antigo
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json(albums);
  } catch (error) {
    // Em caso de erro, retorna uma resposta de erro com detalhes
    return res.status(500).json({
      message: "Erro ao listar álbuns.",
      error: error.message
    });
  }
}

// Controlador para criar um novo álbum
export async function createAlbum(req, res) {
  try {
    const { title, date, location, description, coverImage } = req.body;

    if (!title || !date || !location || !description || !coverImage) {
      return res.status(400).json({
        message: "Preencha todos os campos obrigatórios."
      });
    }

    const album = await prisma.album.create({
      data: {
        title,
        date,
        location,
        description,
        coverImage
      }
    });

    return res.status(201).json(album);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar álbum.",
      error: error.message
    });
  }
}

// Controlador para excluir um álbum existente
export async function deleteAlbum(req, res) {
  try {
    const { id } = req.params;

    await prisma.album.delete({
      where: {
        id: Number(id)
      }
    });

    return res.json({
      message: "Álbum excluído com sucesso."
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao excluir álbum.",
      error: error.message
    });
  }
}