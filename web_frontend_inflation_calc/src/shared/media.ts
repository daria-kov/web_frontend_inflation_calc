
const MEDIA_URL = import.meta.env.VITE_MEDIA_URL;

export function getMediaUrl(filename?: string): string {
  if (!filename) {
    return "";
  }

  if (
    filename.startsWith("http://") ||
    filename.startsWith("https://")
  ) {
    return filename;
  }

  const baseUrl = MEDIA_URL.replace(/\/+$/, "");
  const filePath = filename.replace(/^\/+/, "");

  return `${baseUrl}/${filePath}`;
}
