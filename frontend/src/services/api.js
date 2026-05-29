const API_URL = "http://localhost:3333";

// Funções para interagir com a API do backend
export async function getAlbums() {
  const response = await fetch(`${API_URL}/albums`);
  return response.json();
}

// Função para criar um novo álbum
export async function createAlbum(album) {
  const response = await fetch(`${API_URL}/albums`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(album)
  });

  return response.json();
}

// Função para excluir um álbum
export async function deleteAlbum(id) {
  const response = await fetch(`${API_URL}/albums/${id}`, {
    method: "DELETE"
  });

  return response.json();
}