const API_URL = "http://localhost:3333";

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro na requisição.");
  }

  return data;
}

export async function getAlbums() {
  const response = await fetch(`${API_URL}/albums`);
  return handleResponse(response);
}

export async function getAlbumById(id) {
  const response = await fetch(`${API_URL}/albums/${id}`);
  return handleResponse(response);
}

export async function createAlbum(albumFormData) {
  const response = await fetch(`${API_URL}/albums`, {
    method: "POST",
    body: albumFormData,
  });

  return handleResponse(response);
}

export async function addPhotosToAlbum(albumId, photosFormData) {
  const response = await fetch(`${API_URL}/albums/${albumId}/photos`, {
    method: "POST",
    body: photosFormData,
  });

  return handleResponse(response);
}

export async function deleteAlbum(id) {
  const response = await fetch(`${API_URL}/albums/${id}`, {
    method: "DELETE",
  });

  return handleResponse(response);
}

export async function deletePhoto(id) {
  const response = await fetch(`${API_URL}/photos/${id}`, {
    method: "DELETE",
  });

  return handleResponse(response);
}

export async function updateAlbum(id, albumFormData) {
  const response = await fetch(`${API_URL}/albums/${id}`, {
    method: "PUT",
    body: albumFormData,
  });

  return handleResponse(response);
}