import { createRouter, createWebHistory } from "vue-router";
import { toast } from "../composables/useToast";

// Layouts
import CustomerLayout from "../layouts/CustomerLayout.vue";
import AdminLayout from "../layouts/AdminLayout.vue";

// Customer Views
import HomeView from "../views/customer/HomeView.vue";
import MenuView from "../views/customer/MenuView.vue";
import DishDetailView from "../views/customer/DishDetailView.vue";
import ReservationView from "../views/customer/ReservationView.vue";
import TrackReservationView from "../views/customer/TrackReservationView.vue";
import RankLoyaltyView from "../views/customer/RankLoyaltyView.vue";
import LoginView from "../views/customer/LoginView.vue";
import RegisterView from "../views/customer/RegisterView.vue";
import GuestOrderView from "../views/customer/GuestOrderView.vue";
import ProfileView from "../views/customer/ProfileView.vue";
import NotFoundView from "../views/NotFoundView.vue";

// Admin / POS Views
import DashboardView from "../views/admin/DashboardView.vue";
import TableGridManagerView from "../views/admin/TableGridManagerView.vue";
import ReservationManagerView from "../views/admin/ReservationManagerView.vue";
import ReservationCalendarView from "../views/admin/ReservationCalendarView.vue";
import POSDiningSessionView from "../views/admin/POSDiningSessionView.vue";
import MenuManagerView from "../views/admin/MenuManagerView.vue";
import InventoryManagerView from "../views/admin/InventoryManagerView.vue";
import SupplierManagerView from "../views/admin/SupplierManagerView.vue";
import KitchenView from "../views/admin/KitchenView.vue";
import PrintInvoiceView from "../views/admin/PrintInvoiceView.vue";
import VoucherManagerView from "../views/admin/VoucherManagerView.vue";
import StaffManagerView from "../views/admin/StaffManagerView.vue";
import AuditLogView from "../views/admin/AuditLogView.vue";
import SettingsView from "../views/admin/SettingsView.vue";
import ReviewManagerView from "../views/admin/ReviewManagerView.vue";
import UserManagerView from "../views/admin/UserManagerView.vue";

const routes = [
  {
    path: "/",
    component: CustomerLayout,
    children: [
      { path: "", name: "home", component: HomeView },
      { path: "thuc-don", name: "menu", component: MenuView },
      { path: "mon-an/:slug", name: "dish-detail", component: DishDetailView, alias: ["mon an/:slug", "mon-an/:slug(.*)"] },
      { path: "dat-ban", name: "reservation", component: ReservationView },
      { path: "tra-cuu", name: "track-order", component: TrackReservationView },
      { path: "hang-thanh-vien", name: "loyalty", component: RankLoyaltyView },
      { path: "thuc-don-tai-ban", name: "guest-order", component: GuestOrderView },
      {
        path: "ho-so",
        name: "profile",
        component: ProfileView,
        meta: { requiresAuth: true },
        alias: ["ho so", "tai-khoan", "tai khoan", "profile", "user/profile"],
      },
      { path: "login", name: "login", component: LoginView },
      { path: "register", name: "register", component: RegisterView },
    ],
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ["staff", "manager", "admin"] },
    children: [
      { path: "", name: "admin-dashboard", component: DashboardView, alias: ["dashboard"], meta: { roles: ["admin", "manager"] } },
      { path: "tables", name: "admin-tables", component: TableGridManagerView, meta: { roles: ["admin", "manager"] } },
      { path: "reservations", name: "admin-reservations", component: ReservationManagerView, meta: { roles: ["staff", "manager", "admin"] } },
      { path: "calendar", name: "admin-calendar", component: ReservationCalendarView, meta: { roles: ["staff", "manager", "admin"] } },
      { path: "pos", name: "admin-pos", component: POSDiningSessionView, meta: { roles: ["staff", "manager", "admin"] } },
      { path: "kitchen", name: "admin-kitchen", component: KitchenView, meta: { roles: ["staff", "manager", "admin"] } },
      { path: "menu", name: "admin-menu", component: MenuManagerView, meta: { roles: ["admin", "manager"] } },
      { path: "reviews", name: "admin-reviews", component: ReviewManagerView, meta: { roles: ["admin", "manager"] } },
      { path: "inventory", name: "admin-inventory", component: InventoryManagerView, meta: { roles: ["admin", "manager"] } },
      { path: "suppliers", name: "admin-suppliers", component: SupplierManagerView, meta: { roles: ["admin", "manager"] } },
      { path: "vouchers", name: "admin-vouchers", component: VoucherManagerView, meta: { roles: ["admin", "manager"] } },
      { path: "users", name: "admin-users", component: UserManagerView, meta: { roles: ["admin", "manager"] } },
      { path: "staff", name: "admin-staff", component: StaffManagerView, meta: { roles: ["admin"] } },
      { path: "audit-logs", name: "admin-audit", component: AuditLogView, meta: { roles: ["admin"] } },
      { path: "settings", name: "admin-settings", component: SettingsView, meta: { roles: ["admin"] } },
      { path: "invoice/:sessionId", name: "admin-invoice-print", component: PrintInvoiceView, meta: { roles: ["staff", "manager", "admin"] } },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// Guard kiểm tra đăng nhập & quyền truy cập theo từng vai trò (Role-based Access Control)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (to.meta.requiresAuth) {
    if (!token || !user) {
      return next({ name: "login", query: { redirect: to.fullPath } });
    }

    // Nếu là nhân viên (staff) truy cập vào gốc /admin hoặc trang không có quyền -> Tự động chuyển thẳng vào POS
    if (user.role === "staff") {
      if (
        to.path === "/admin" ||
        to.path === "/admin/" ||
        to.name === "admin-dashboard" ||
        (to.meta.roles && !to.meta.roles.includes("staff"))
      ) {
        return next({ name: "admin-pos" });
      }
    }

    if (to.meta.roles && !to.meta.roles.includes(user.role)) {
      toast.error("Bạn không có quyền truy cập vào chức năng này!");
      return next(user.role === "staff" ? { name: "admin-pos" } : { name: "home" });
    }
  }

  next();
});

export default router;
