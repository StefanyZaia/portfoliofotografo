import multer from "multer";
import path from "path";

// Configuração do multer para armazenamento de arquivos
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },

  // Gera um nome único para cada arquivo enviado
  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    callback(null, uniqueName);
  },
});

// Filtro para aceitar apenas arquivos de imagem
function fileFilter(req, file, callback) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Formato de imagem inválido. Use JPG, PNG ou WEBP."));
  }
}

// Exporta a configuração do multer para ser usada nas rotas de upload
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});