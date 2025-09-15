import multer from "multer";

// Mantém diskStorage vazio -> vai usar diretório temporário do SO
const storage = multer.diskStorage({});

// Novo: filtro para imagens e vídeos
const fileFilter = (_req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Apenas imagens ou vídeos são permitidos"), false);
  }
};

// Novo: limite de tamanho (ex: 1GB para vídeos)
const limits = {
  fileSize: 1024 * 1024 * 1024, // 1 GB
};

const upload = multer({ storage, fileFilter, limits });

export default upload;
