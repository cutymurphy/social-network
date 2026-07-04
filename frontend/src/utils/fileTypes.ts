const POST_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/matroska",
  "video/x-matroska",
];

export const isValidPostFile = (file: File) =>
  POST_FILE_TYPES.includes(file.type);
