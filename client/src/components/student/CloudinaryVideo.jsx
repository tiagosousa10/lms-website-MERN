import React, { useMemo } from "react";

export default function CloudinaryVideo({
  cloudName,
  publicId,
  sourceUrl,
  poster,
  className = "absolute inset-0 w-full h-full",
}) {
  // Fallback para montar URL MP4 a partir do publicId, caso não venha sourceUrl
  const computedUrl = useMemo(() => {
    if (sourceUrl) return sourceUrl;
    if (cloudName && publicId) {
      // URL pública padrão de vídeo do Cloudinary
      return `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}.mp4`;
    }
    return null;
  }, [cloudName, publicId, sourceUrl]);

  if (!computedUrl) return null;

  return (
    <video
      className={`cld-basic-player ${className}`}
      src={computedUrl}
      poster={poster}
      controls
      playsInline
      preload="metadata"
    />
  );
}
