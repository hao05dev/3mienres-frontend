import { io } from "socket.io-client";

// Kết nối Socket.io tới backend để nhận cập nhật realtime.
// Dùng singleton để toàn bộ app chỉ mở đúng 1 connection.

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
let socket = null;

export function connectSocket() {
  if (socket) return socket;
  socket = io(BACKEND_URL, {
    transports: ["websocket", "polling"],
    autoConnect: true,
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}

// Đăng ký lắng nghe sự kiện và trả về hàm hủy đăng ký.
export function onSocketEvent(event, handler) {
  const s = connectSocket();
  s.on(event, handler);
  return () => s.off(event, handler);
}
