import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("token") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    favoriteDishIds: (JSON.parse(localStorage.getItem("user") || "null")?.favorites || []).map((f) => (f?._id || f).toString()),
    favoriteDishes: [],
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "admin" || state.user?.role === "manager",
    isStaff: (state) => ["staff", "manager", "admin"].includes(state.user?.role),
    isFavorite: (state) => (dishId) => {
      if (!dishId) return false;
      const strId = dishId.toString();
      return state.favoriteDishIds.includes(strId);
    },
  },
  actions: {
    setAuth(res) {
      this.token = res.token;
      this.refreshToken = res.refreshToken;
      this.user = res.data.user;
      this.favoriteDishIds = (this.user?.favorites || []).map((f) => (f?._id || f).toString());

      localStorage.setItem("token", this.token);
      localStorage.setItem("refreshToken", this.refreshToken);
      localStorage.setItem("user", JSON.stringify(this.user));
    },
    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post("/auth/login", { email, password });
        this.setAuth(res.data);
        await this.fetchFavorites().catch(() => {});
        return res.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Đăng nhập thất bại!";
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },
    async register(payload) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post("/auth/register", payload);
        this.setAuth(res.data);
        return res.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Đăng ký thất bại!";
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        await api.post("/auth/logout");
      } catch {
        // Bỏ qua lỗi khi logout (token có thể đã hết hạn)
      } finally {
        this.token = null;
        this.refreshToken = null;
        this.user = null;
        this.favoriteDishIds = [];
        this.favoriteDishes = [];
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    },
    async fetchFavorites() {
      if (!this.token) return [];
      try {
        const res = await api.get("/users/me/favorites");
        this.favoriteDishes = res.data.data.favorites || [];
        this.favoriteDishIds = this.favoriteDishes.map((f) => (f._id || f).toString());
        return this.favoriteDishes;
      } catch (err) {
        console.error("Lỗi tải món yêu thích:", err);
        return [];
      }
    },
    async toggleFavorite(dishId) {
      if (!this.token) {
        throw new Error("Vui lòng đăng nhập để lưu món yêu thích!");
      }
      try {
        const strId = dishId.toString();
        const res = await api.post(`/users/favorites/${strId}/toggle`);
        const isFav = res.data.data.isFavorite;

        if (isFav) {
          if (!this.favoriteDishIds.includes(strId)) {
            this.favoriteDishIds.push(strId);
          }
        } else {
          this.favoriteDishIds = this.favoriteDishIds.filter((id) => id !== strId);
          this.favoriteDishes = this.favoriteDishes.filter((d) => (d._id || d).toString() !== strId);
        }

        if (this.user) {
          this.user.favorites = [...this.favoriteDishIds];
          localStorage.setItem("user", JSON.stringify(this.user));
        }

        return res.data;
      } catch (err) {
        throw new Error(err.response?.data?.message || err.message || "Lỗi cập nhật yêu thích");
      }
    },
  },
});
