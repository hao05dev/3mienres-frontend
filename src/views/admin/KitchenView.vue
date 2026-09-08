<template>
  <div :class="['kitchen-view-wrapper', isDarkMode ? 'kds-dark-mode' : '']">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
      <div>
        <h4 class="fw-bold brand-font mb-1" :class="isDarkMode ? 'text-white' : 'text-dark'">
          <i class="fa-solid fa-fire-burner text-danger me-2"></i>Màn Hình Điều Phối Bếp & Quầy Bar (KDS)
        </h4>
        <p class="small mb-0" :class="isDarkMode ? 'text-secondary' : 'text-muted'">
          Theo dõi đơn theo trạm chế biến theo thời gian thực, chuông báo đơn mới và chuyển trạng thái
        </p>
      </div>

      <div class="d-flex align-items-center gap-2">
        <!-- Nút Thử Chuông Bếp -->
        <button @click="testChime" class="btn btn-sm rounded-pill px-3 fw-semibold" :class="isDarkMode ? 'btn-outline-warning text-warning' : 'btn-outline-warning text-dark'" title="Phát thử chuông gọi bếp">
          <i class="fa-solid fa-bell me-1"></i> Chuông Báo
        </button>

        <!-- Nút Chuyển Dark Mode -->
        <button @click="toggleDarkMode" class="btn btn-sm rounded-pill px-3 fw-semibold" :class="isDarkMode ? 'btn-light text-dark' : 'btn-dark text-white'" title="Chuyển chế độ tối/sáng">
          <i :class="isDarkMode ? 'fa-solid fa-sun text-warning me-1' : 'fa-solid fa-moon me-1'"></i>
          {{ isDarkMode ? 'Giao Diện Sáng' : 'Giao Diện Tối (KDS)' }}
        </button>

        <button @click="fetchOrders" class="btn btn-outline-danger btn-sm rounded-pill px-3">
          <i class="fa-solid fa-rotate me-1" :class="{ 'fa-spin': loading }"></i> Làm mới
        </button>
      </div>
    </div>

    <!-- ═══ BỘ LỌC PHÂN LUỒNG BẾP / QUẦY PHA CHẾ (STATION ROUTING TABS) ═══ -->
    <div class="d-flex align-items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
      <button
        @click="activeStation = 'ALL'"
        :class="['btn btn-sm rounded-pill px-3 fw-bold text-nowrap flex-shrink-0 transition-all', activeStation === 'ALL' ? 'btn-danger shadow-sm' : (isDarkMode ? 'btn-dark text-light border-secondary' : 'btn-light text-dark border')]"
      >
        <i class="fa-solid fa-layer-group me-1.5"></i>
        Tất Cả Trạm
        <span class="badge rounded-pill ms-1" :class="activeStation === 'ALL' ? 'bg-white text-danger' : 'bg-secondary'">{{ totalStationOrders('ALL') }}</span>
      </button>

      <button
        @click="activeStation = 'KITCHEN'"
        :class="['btn btn-sm rounded-pill px-3 fw-bold text-nowrap flex-shrink-0 transition-all', activeStation === 'KITCHEN' ? 'btn-danger shadow-sm' : (isDarkMode ? 'btn-dark text-light border-secondary' : 'btn-light text-dark border')]"
      >
        <i class="fa-solid fa-fire-burner me-1.5 text-warning"></i>
        🍳 Bếp Nấu & Hải Sản
        <span class="badge rounded-pill ms-1" :class="activeStation === 'KITCHEN' ? 'bg-white text-danger' : 'bg-secondary'">{{ totalStationOrders('KITCHEN') }}</span>
      </button>

      <button
        @click="activeStation = 'BAR'"
        :class="['btn btn-sm rounded-pill px-3 fw-bold text-nowrap flex-shrink-0 transition-all', activeStation === 'BAR' ? 'btn-danger shadow-sm' : (isDarkMode ? 'btn-dark text-light border-secondary' : 'btn-light text-dark border')]"
      >
        <i class="fa-solid fa-martini-glass-citrus me-1.5 text-info"></i>
        🍹 Quầy Pha Chế / Bar
        <span class="badge rounded-pill ms-1" :class="activeStation === 'BAR' ? 'bg-white text-danger' : 'bg-secondary'">{{ totalStationOrders('BAR') }}</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-danger" role="status"></div>
    </div>

    <!-- Main Columns -->
    <div v-else class="row g-3">
      <!-- Cột trạng thái -->
      <div v-for="col in columns" :key="col.key" class="col-lg-4">
        <div :class="['kitchen-column p-3 rounded-4 h-100', `col-${col.key.toLowerCase()}`, isDarkMode ? 'kds-column-dark' : '']">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h6 class="fw-bold mb-0 d-flex align-items-center gap-2" :class="isDarkMode ? 'text-light' : 'text-dark'">
              <i :class="col.icon" :style="{ color: col.color }"></i>
              {{ col.label }}
            </h6>
            <span class="badge rounded-pill" :class="colBadgeClass(col.key)">{{ filteredOrdersByStatus(col.key).length }}</span>
          </div>

          <div v-if="filteredOrdersByStatus(col.key).length === 0" class="text-center small py-5" :class="isDarkMode ? 'text-secondary' : 'text-muted'">
            <i class="fa-solid fa-inbox fs-3 d-block mb-2 opacity-40"></i>
            Không có món nào trong trạm này
          </div>

          <div
            v-for="order in filteredOrdersByStatus(col.key)"
            :key="order._id"
            class="kitchen-ticket rounded-4 p-3 mb-3 border position-relative transition-all"
            :class="isDarkMode ? 'kds-ticket-dark border-secondary' : 'bg-white border-light shadow-2xs'"
          >
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <span class="badge bg-danger px-2.5 py-1 rounded-pill fs-8 fw-bold">
                  <i class="fa-solid fa-chair me-1"></i>{{ tableNumbers(order) }}
                </span>
                <small class="ms-2 font-monospace" :class="isDarkMode ? 'text-secondary' : 'text-muted'">{{ order.orderCode }}</small>
              </div>
              <span
                :class="[
                  'badge rounded-pill fs-9 fw-semibold px-2 py-0.5',
                  elapsed(order.createdAt) > 15 ? 'bg-danger text-white' : 'bg-light text-dark border'
                ]"
              >
                <i class="fa-solid fa-clock me-1"></i>{{ elapsed(order.createdAt) }} phút
              </span>
            </div>

            <!-- Danh sách món lọc theo station -->
            <div class="small mb-2">
              <div
                v-for="(item, idx) in getOrderItems(order)"
                :key="idx"
                class="d-flex justify-content-between align-items-center py-1.5 border-bottom"
                :class="isDarkMode ? 'border-secondary border-opacity-25' : 'border-light'"
              >
                <div class="d-flex align-items-center gap-1.5 flex-grow-1 me-2">
                  <span class="badge rounded-pill px-1.5 py-0.5 fs-10" :class="item.dish?.station === 'BAR' ? 'bg-info bg-opacity-20 text-info border border-info' : 'bg-warning bg-opacity-20 text-warning border border-warning'">
                    {{ item.dish?.station === 'BAR' ? '🍹 Bar' : '🍳 Bếp' }}
                  </span>
                  <span class="fw-semibold" :class="isDarkMode ? 'text-light' : 'text-dark'">{{ item.dish?.name || 'Món ăn' }}</span>
                </div>
                <strong class="text-danger fs-7 text-nowrap">x{{ item.quantity }}</strong>
              </div>
            </div>

            <!-- Ghi chú món ăn nếu có -->
            <p v-if="order.notes" class="small mb-2 p-2 rounded-3 bg-warning bg-opacity-15 text-warning fw-semibold fs-9">
              <i class="fa-solid fa-circle-info me-1"></i>Ghi chú: {{ order.notes }}
            </p>

            <!-- Hành động chuyển trạng thái -->
            <div v-if="col.key === 'PENDING'" class="d-grid mt-2">
              <button @click="advance(order, 'PREPARING')" class="btn btn-warning btn-sm rounded-pill fw-bold text-dark shadow-2xs">
                <i class="fa-solid fa-fire-burner me-1.5"></i> Bắt Đầu Chế Biến
              </button>
            </div>
            <div v-else-if="col.key === 'PREPARING'" class="d-grid mt-2">
              <button @click="advance(order, 'SERVED')" class="btn btn-success btn-sm rounded-pill fw-bold shadow-2xs">
                <i class="fa-solid fa-bell-concierge me-1.5"></i> Nấu Xong / Ra Món
              </button>
            </div>
            <div v-else-if="col.key === 'SERVED'" class="d-flex justify-content-between align-items-center text-success small pt-1">
              <span><i class="fa-solid fa-check-double me-1"></i> Đã chuyển phục vụ bàn</span>
              <span class="badge bg-success bg-opacity-15 text-success rounded-pill px-2 py-0.5">Hoàn tất</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import api from "../../services/api";
import { onSocketEvent } from "../../services/socket";
import { toast } from "../../composables/useToast";
import soundHelper from "../../utils/soundHelper";

const orders = ref([]);
const loading = ref(false);
const isDarkMode = ref(localStorage.getItem("kds_dark_mode") === "true");
const activeStation = ref("ALL"); // ALL | KITCHEN | BAR
let offSocket = null;

const columns = [
  { key: "PENDING", label: "Chờ Chế Biến", icon: "fa-solid fa-hourglass-half", color: "#ef6c00" },
  { key: "PREPARING", label: "Đang Chế Biến", icon: "fa-solid fa-fire-burner", color: "#d32f2f" },
  { key: "SERVED", label: "Đã Nấu Xong / Ra Món", icon: "fa-solid fa-circle-check", color: "#2e7d32" },
];

const getOrderItems = (order) => {
  if (!order.items) return [];
  if (activeStation.value === "ALL") return order.items;
  return order.items.filter((item) => {
    const station = item.dish?.station || "KITCHEN";
    return station === activeStation.value;
  });
};

const filterOrderByStation = (order) => {
  if (activeStation.value === "ALL") return true;
  return (order.items || []).some((item) => {
    const station = item.dish?.station || "KITCHEN";
    return station === activeStation.value;
  });
};

const filteredOrdersByStatus = (status) => {
  return orders.value
    .filter((o) => o.status === status)
    .filter(filterOrderByStation);
};

const totalStationOrders = (station) => {
  if (station === "ALL") return orders.value.length;
  return orders.value.filter((o) =>
    (o.items || []).some((item) => (item.dish?.station || "KITCHEN") === station)
  ).length;
};

const colBadgeClass = (key) => {
  switch (key) {
    case "PENDING": return "bg-warning text-dark";
    case "PREPARING": return "bg-danger text-white";
    case "SERVED": return "bg-success text-white";
    default: return "bg-dark text-white";
  }
};

const tableNumbers = (order) => {
  const tables = order.diningSession?.tables || [];
  return tables.map((t) => t.tableNumber).join("+") || "Bàn";
};

const elapsed = (createdAt) => {
  return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("kds_dark_mode", String(isDarkMode.value));
};

const testChime = () => {
  soundHelper.playKitchenChime();
  toast.info("Đã phát chuông gọi bếp!");
};

const fetchOrders = async (isFromSocket = false) => {
  if (!isFromSocket) loading.value = true;
  try {
    const res = await api.get("/orders/kitchen");
    const prevPendingCount = orders.value.filter((o) => o.status === "PENDING").length;
    orders.value = res.data.data.orders || [];

    const newPendingCount = orders.value.filter((o) => o.status === "PENDING").length;
    if (isFromSocket && newPendingCount > prevPendingCount) {
      soundHelper.playKitchenChime();
      toast.info("🔔 Có đơn gọi món mới gửi đến bếp!");
    }
  } catch (err) {
    if (!isFromSocket) toast.error("Lỗi tải đơn bếp: " + err.message);
  } finally {
    loading.value = false;
  }
};

const advance = async (order, status) => {
  try {
    await api.patch(`/orders/${order._id}/status`, { status });
    toast.success(`Đã chuyển ${order.orderCode} sang ${status === 'PREPARING' ? 'Đang chế biến' : 'Đã phục vụ'}`);
    await fetchOrders();
  } catch (err) {
    toast.error(err.response?.data?.message || "Lỗi chuyển trạng thái");
  }
};

onMounted(() => {
  fetchOrders();
  offSocket = onSocketEvent("orders:changed", () => fetchOrders(true));
});

onBeforeUnmount(() => {
  if (offSocket) offSocket();
});
</script>

<style scoped>
.kitchen-view-wrapper {
  transition: background 0.3s ease;
  min-height: calc(100vh - 120px);
}
.kitchen-column {
  background: #f8fafc;
  min-height: 550px;
}
.col-pending {
  border-top: 4px solid #ef6c00;
}
.col-preparing {
  border-top: 4px solid #d32f2f;
}
.col-served {
  border-top: 4px solid #2e7d32;
}
.kitchen-ticket:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}
.shadow-2xs {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
.fs-10 {
  font-size: 0.7rem;
}

/* KDS Dark Mode Styles */
.kds-dark-mode {
  background: #121824;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 1rem;
}
.kds-column-dark {
  background: #1a2234 !important;
  border: 1px solid #2d3748;
}
.kds-ticket-dark {
  background: #232d42 !important;
}
.transition-all {
  transition: all 0.2s ease;
}
</style>
