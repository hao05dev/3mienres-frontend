<template>
  <div class="admin-layout d-flex bg-light" style="min-height: 100vh;">
    <!-- Sidebar Left: Fixed, không cuộn theo nội dung -->
    <aside
      class="admin-sidebar bg-dark text-white d-flex flex-column justify-content-between"
      style="width: 260px; flex-shrink: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto;"
    >
      <div class="p-3">
        <!-- Brand Header -->
        <div class="d-flex align-items-center gap-2 mb-4 p-2 rounded-3 bg-white bg-opacity-10">
          <div class="p-2 bg-danger text-white rounded-3 flex-shrink-0" style="width: 40px; height: 40px; display:flex; align-items:center; justify-content:center;">
            <i class="fa-solid fa-utensils fs-5"></i>
          </div>
          <div class="overflow-hidden">
            <strong class="d-block text-white brand-font fs-7 text-truncate">
              {{ isStaffRole ? (langStore.isEnglish ? '3 MIEN STAFF POS' : 'POS PHỤC VỤ & THU NGÂN') : (langStore.isEnglish ? '3 MIEN POS SYSTEM' : 'HỆ THỐNG POS 3 MIỀN') }}
            </strong>
            <small class="text-warning" style="font-size: 0.7rem;">
              {{ isStaffRole ? 'Giao Diện Nghiệp Vụ Sàn' : 'Nhà Hàng 3 Miền Cua' }}
            </small>
          </div>
        </div>

        <!-- Navigation Links -->
        <ul class="nav flex-column gap-1" style="font-size: 0.85rem;">
          <!-- 1. Báo Cáo Tổng Quan (Chỉ Admin / Manager) -->
          <li v-if="!isStaffRole" class="nav-item">
            <router-link to="/admin" exact class="sidebar-link d-flex align-items-center gap-2 py-2 px-3 rounded-3" active-class="sidebar-link-active">
              <i class="fa-solid fa-chart-pie" style="width: 16px; text-align:center;"></i>
              <span>{{ langStore.isEnglish ? 'Overview Dashboard' : 'Báo Cáo Tổng Quan' }}</span>
            </router-link>
          </li>

          <!-- 2. Gọi Món & POS Sàn (Dành cho cả Staff, Manager, Admin) -->
          <li class="nav-item">
            <router-link to="/admin/pos" class="sidebar-link d-flex align-items-center gap-2 py-2 px-3 rounded-3" active-class="sidebar-link-active">
              <i class="fa-solid fa-cash-register" style="width: 16px; text-align:center;"></i>
              <span>{{ langStore.isEnglish ? 'Table Order & POS' : 'Sơ Đồ POS & Gọi Món' }}</span>
            </router-link>
          </li>

          <!-- 3. Đơn Đặt Bàn & Check-in (Staff, Manager, Admin) -->
          <li class="nav-item">
            <router-link to="/admin/reservations" class="sidebar-link d-flex align-items-center gap-2 py-2 px-3 rounded-3" active-class="sidebar-link-active">
              <i class="fa-solid fa-calendar-check" style="width: 16px; text-align:center;"></i>
              <span>{{ langStore.isEnglish ? 'Reservations & Check-in' : 'Đơn Đặt Bàn & Check-in' }}</span>
            </router-link>
          </li>

          <!-- 4. Lịch Đặt Bàn (Staff, Manager, Admin) -->
          <li class="nav-item">
            <router-link to="/admin/calendar" class="sidebar-link d-flex align-items-center gap-2 py-2 px-3 rounded-3" active-class="sidebar-link-active">
              <i class="fa-solid fa-calendar-days" style="width: 16px; text-align:center;"></i>
              <span>{{ langStore.isEnglish ? 'Reservation Calendar' : 'Lịch Đặt Bàn' }}</span>
            </router-link>
          </li>

          <!-- 5. Màn Hình Bếp / Bar KDS (Staff, Manager, Admin) -->
          <li class="nav-item">
            <router-link to="/admin/kitchen" class="sidebar-link d-flex align-items-center gap-2 py-2 px-3 rounded-3" active-class="sidebar-link-active">
              <i class="fa-solid fa-fire-burner" style="width: 16px; text-align:center;"></i>
              <span>{{ langStore.isEnglish ? 'Kitchen Display (KDS)' : 'Màn Hình Bếp / Bar (KDS)' }}</span>
            </router-link>
          </li>

          <!-- 6. Sơ Đồ Bàn & Ghép Bàn Vật Lý (Chỉ Manager / Admin) -->
          <li v-if="!isStaffRole" class="nav-item">
            <router-link to="/admin/tables" class="sidebar-link d-flex align-items-center gap-2 py-2 px-3 rounded-3" active-class="sidebar-link-active">
              <i class="fa-solid fa-chair" style="width: 16px; text-align:center;"></i>
              <span>{{ langStore.isEnglish ? 'Table Layout Map' : 'Cấu Hình Sơ Đồ Bàn' }}</span>
            </router-link>
          </li>

          <!-- 7. Quản Lý Thực Đơn (Manager / Admin) -->
          <li v-if="!isStaffRole" class="nav-item">
            <router-link to="/admin/menu" class="sidebar-link d-flex align-items-center gap-2 py-2 px-3 rounded-3" active-class="sidebar-link-active">
              <i class="fa-solid fa-book-open" style="width: 16px; text-align:center;"></i>
              <span>{{ langStore.isEnglish ? 'Menu Management' : 'Quản Lý Thực Đơn' }}</span>
            </router-link>
          </li>

          <!-- 8. Đánh Giá & Góp Ý (Manager / Admin) -->
          <li v-if="!isStaffRole" class="nav-item">
            <router-link to="/admin/reviews" class="sidebar-link d-flex align-items-center gap-2 py-2 px-3 rounded-3" active-class="sidebar-link-active">
              <i class="fa-solid fa-star-half-stroke" style="width: 16px; text-align:center;"></i>
              <span>{{ langStore.isEnglish ? 'Reviews & Feedback' : 'Đánh Giá & Góp Ý' }}</span>
            </router-link>
          </li>

          <!-- 9. Quản Lý Kho (Manager / Admin) -->
          <li v-if="!isStaffRole" class="nav-item">
            <router-link to="/admin/inventory" class="sidebar-link d-flex align-items-center gap-2 py-2 px-3 rounded-3" active-class="sidebar-link-active">
              <i class="fa-solid fa-boxes-stacked" style="width: 16px; text-align:center;"></i>
              <span>{{ langStore.isEnglish ? 'Inventory Stock' : 'Quản Lý Kho Nguyên Liệu' }}</span>
            </router-link>
          </li>

          <!-- 10. Nhà Cung Cấp (Manager / Admin) -->
          <li v-if="!isStaffRole" class="nav-item">
            <router-link to="/admin/suppliers" class="sidebar-link d-flex align-items-center gap-2 py-2 px-3 rounded-3" active-class="sidebar-link-active">
              <i class="fa-solid fa-truck-field" style="width: 16px; text-align:center;"></i>
              <span>{{ langStore.isEnglish ? 'Supplier Management' : 'Quản Lý Nhà Cung Cấp' }}</span>
            </router-link>
          </li>

          <!-- 11. Mã Giảm Giá & Voucher (Manager / Admin) -->
          <li v-if="!isStaffRole" class="nav-item">
            <router-link to="/admin/vouchers" class="sidebar-link d-flex align-items-center gap-2 py-2 px-3 rounded-3" active-class="sidebar-link-active">
              <i class="fa-solid fa-tags" style="width: 16px; text-align:center;"></i>
              <span>{{ langStore.isEnglish ? 'Vouchers & Discounts' : 'Mã Giảm Giá & Voucher' }}</span>
            </router-link>
          </li>

          <!-- 12. Khách Hàng & Hội Viên (Manager / Admin) -->
          <li v-if="!isStaffRole" class="nav-item">
            <router-link to="/admin/users" class="sidebar-link d-flex align-items-center gap-2 py-2 px-3 rounded-3" active-class="sidebar-link-active">
              <i class="fa-solid fa-users" style="width: 16px; text-align:center;"></i>
              <span>{{ langStore.isEnglish ? 'Customers & Loyalty' : 'Khách Hàng & Hội Viên' }}</span>
            </router-link>
          </li>

          <!-- 13. Nhân Viên & Phân Quyền (Chỉ Admin) -->
          <li v-if="authStore.user?.role === 'admin'" class="nav-item">
            <router-link to="/admin/staff" class="sidebar-link d-flex align-items-center gap-2 py-2 px-3 rounded-3" active-class="sidebar-link-active">
              <i class="fa-solid fa-users-gear" style="width: 16px; text-align:center;"></i>
              <span>{{ langStore.isEnglish ? 'Staff & Roles' : 'Nhân Viên & Phân Quyền' }}</span>
            </router-link>
          </li>

          <!-- 14. Nhật Ký Thao Tác (Chỉ Admin) -->
          <li v-if="authStore.user?.role === 'admin'" class="nav-item">
            <router-link to="/admin/audit-logs" class="sidebar-link d-flex align-items-center gap-2 py-2 px-3 rounded-3" active-class="sidebar-link-active">
              <i class="fa-solid fa-clock-rotate-left" style="width: 16px; text-align:center;"></i>
              <span>{{ langStore.isEnglish ? 'Audit Logs' : 'Nhật Ký Thao Tác' }}</span>
            </router-link>
          </li>

          <!-- 15. Cài Đặt Nhà Hàng (Chỉ Admin) -->
          <li v-if="authStore.user?.role === 'admin'" class="nav-item">
            <router-link to="/admin/settings" class="sidebar-link d-flex align-items-center gap-2 py-2 px-3 rounded-3" active-class="sidebar-link-active">
              <i class="fa-solid fa-gear" style="width: 16px; text-align:center;"></i>
              <span>{{ langStore.isEnglish ? 'Restaurant Settings' : 'Cài Đặt Nhà Hàng' }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Footer: User Info + Language Toggle -->
      <div class="p-3 border-top border-white border-opacity-10">
        <!-- Language Switcher -->
        <div class="d-flex align-items-center justify-content-between mb-3 bg-white bg-opacity-10 p-2 rounded-3">
          <small class="text-white-50" style="font-size: 0.75rem;">
            <i class="fa-solid fa-globe me-1"></i>
            {{ langStore.isEnglish ? 'Language' : 'Ngôn ngữ' }}:
          </small>
          <div class="btn-group btn-group-sm">
            <button
              @click="langStore.setLanguage('vi')"
              :class="['btn btn-xs py-0.5 px-2 rounded-start-pill', !langStore.isEnglish ? 'btn-danger fw-bold' : 'btn-outline-light']"
              style="font-size: 0.7rem;"
            >
              VI
            </button>
            <button
              @click="langStore.setLanguage('en')"
              :class="['btn btn-xs py-0.5 px-2 rounded-end-pill', langStore.isEnglish ? 'btn-danger fw-bold' : 'btn-outline-light']"
              style="font-size: 0.7rem;"
            >
              EN
            </button>
          </div>
        </div>

        <!-- User profile summary -->
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-2 overflow-hidden me-2">
            <div class="bg-danger text-white rounded-circle p-2 flex-shrink-0" style="width: 34px; height: 34px; display:flex; align-items:center; justify-content:center; font-size: 0.8rem; font-weight: bold;">
              {{ (authStore.user?.name || 'A').charAt(0).toUpperCase() }}
            </div>
            <div class="overflow-hidden">
              <span class="d-block text-white fw-bold text-truncate" style="font-size: 0.8rem;">
                {{ authStore.user?.name || 'User' }}
              </span>
              <span class="badge bg-danger rounded-pill px-2 py-0.5" style="font-size: 0.65rem;">
                {{ getRoleBadge(authStore.user?.role) }}
              </span>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="btn btn-outline-light btn-sm rounded-circle p-2 flex-shrink-0"
            title="Đăng xuất"
            style="width: 32px; height: 32px; display:flex; align-items:center; justify-content:center;"
          >
            <i class="fa-solid fa-right-from-bracket fs-8"></i>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Right -->
    <main class="admin-main flex-grow-1 p-4 bg-light overflow-auto" style="height: 100vh;">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useLangStore } from "../stores/langStore";
import { useRouter } from "vue-router";
import { toast } from "../composables/useToast";

const authStore = useAuthStore();
const langStore = useLangStore();
const router = useRouter();

const isStaffRole = computed(() => authStore.user?.role === "staff");

const getRoleBadge = (role) => {
  const map = {
    admin: "Quản Trị Viên",
    manager: "Quản Lý",
    staff: "Nhân Viên",
    customer: "Khách Hàng",
  };
  return map[role] || role || "Nhân viên";
};

const handleLogout = () => {
  authStore.logout();
  toast.success("Đã đăng xuất khỏi hệ thống");
  router.push("/login");
};
</script>

<style scoped>
.sidebar-link {
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
}

.sidebar-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  transform: translateX(4px);
}

.sidebar-link-active {
  background-color: #dc2626 !important;
  color: #fff !important;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}
</style>
