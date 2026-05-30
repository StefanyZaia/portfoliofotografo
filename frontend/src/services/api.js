export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3333").replace(
  /\/$/,
  ""
);

export function getImageUrl(imageUrl) {
  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("/")) {
    return `${API_URL}${imageUrl}`;
  }

  try {
    const url = new URL(imageUrl);

    if (url.protocol === "http:" && API_URL.startsWith("https://")) {
      const apiUrl = new URL(API_URL);
      url.protocol = apiUrl.protocol;
      url.host = apiUrl.host;
    }

    return url.toString();
  } catch {
    return imageUrl;
  }
}

function getToken() {
  return localStorage.getItem("@portfolio:token");
}

function getAuthHeaders() {
  const token = getToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("@portfolio:token");
    }

    throw new Error(data.error || data.message || "Erro na requisição.");
  }

  return data;
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
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
    headers: {
      ...getAuthHeaders(),
    },
    body: albumFormData,
  });

  return handleResponse(response);
}

export async function updateAlbum(id, albumFormData) {
  const response = await fetch(`${API_URL}/albums/${id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: albumFormData,
  });

  return handleResponse(response);
}

export async function addPhotosToAlbum(albumId, photosFormData) {
  const response = await fetch(`${API_URL}/albums/${albumId}/photos`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: photosFormData,
  });

  return handleResponse(response);
}

export async function deleteAlbum(id) {
  const response = await fetch(`${API_URL}/albums/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
}

export async function deletePhoto(id) {
  const response = await fetch(`${API_URL}/photos/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
}
