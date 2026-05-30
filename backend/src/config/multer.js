import multer from "multer";

const storage = multer.memoryStorage();

function fileFilter(req, file, callback) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Formato de imagem inválido. Use JPG, PNG ou WEBP."));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
});