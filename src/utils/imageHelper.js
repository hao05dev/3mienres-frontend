// Đường dẫn gốc định nghĩa cho ảnh món ăn tĩnh và backend server
const BACKEND_URL = "http://localhost:3000";
const BASE_UPLOADS_URL = "/uploads/dishes/";

export function getImageUrl(imageNameOrPath) {
  if (!imageNameOrPath || imageNameOrPath === "default-dish.jpg" || imageNameOrPath.includes("dish-placeholder")) {
    return `${BASE_UPLOADS_URL}cua-rang-me-ca-mau.jpg`;
  }

  // 1. Nếu là URL tuyệt đối đầy đủ (http:// hoặc https://)
  if (imageNameOrPath.startsWith("http://") || imageNameOrPath.startsWith("https://")) {
    return imageNameOrPath;
  }

  // 2. Nếu là đường dẫn bắt đầu bằng /uploads/
  if (imageNameOrPath.startsWith("/uploads/")) {
    // Nếu là file tĩnh cục bộ có sẵn trong /uploads/dishes/ hoặc /uploads/banners/
    if (imageNameOrPath.startsWith("/uploads/dishes/") || imageNameOrPath.startsWith("/uploads/banners/")) {
      return imageNameOrPath;
    }
    // Nếu là ảnh upload mới trên backend (/uploads/img-... hoặc /uploads/lau-...)
    return `${BACKEND_URL}${imageNameOrPath}`;
  }

  // 3. Nếu truyền dạng filename thuần túy (e.g. "cua-rang-me-ca-mau.jpg")
  const fileName = imageNameOrPath.split("/").pop();
  return `${BASE_UPLOADS_URL}${fileName}`;
}
