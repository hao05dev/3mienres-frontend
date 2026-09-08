<template>
  <div>
    <!-- Header & Date Filter Bar -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      <div>
        <h2 class="fw-bold brand-font mb-1">{{ langStore.t('admin.dashboard.title') }}</h2>
        <p class="text-muted small mb-0">{{ langStore.t('admin.dashboard.subtitle') }}</p>
      </div>

      <div class="d-flex align-items-center gap-2 flex-wrap">
        <!-- Date Presets -->
        <div class="btn-group btn-group-sm rounded-pill overflow-hidden border">
          <button
            @click="setPreset('today')"
            :class="['btn', activePreset === 'today' ? 'btn-danger fw-bold' : 'btn-light']"
          >
            {{ langStore.isEnglish ? 'Today' : 'Hôm Nay' }}
          </button>
          <button
            @click="setPreset('7days')"
            :class="['btn', activePreset === '7days' ? 'btn-danger fw-bold' : 'btn-light']"
          >
            {{ langStore.isEnglish ? '7 Days' : '7 Ngày Qua' }}
          </button>
          <button
            @click="setPreset('thisMonth')"
            :class="['btn', activePreset === 'thisMonth' ? 'btn-danger fw-bold' : 'btn-light']"
          >
            {{ langStore.isEnglish ? 'This Month' : 'Tháng Này' }}
          </button>
        </div>

        <!-- Custom Date Range Pickers -->
        <div class="d-flex align-items-center gap-1 bg-white p-1 rounded-pill border">
          <input
            type="date"
            v-model="startDate"
            @change="activePreset = 'custom'; fetchData();"
            class="form-control form-control-sm border-0 bg-transparent text-dark fw-semibold"
            style="width: 130px; font-size: 0.78rem;"
          />
          <span class="text-muted fs-8">→</span>
          <input
            type="date"
            v-model="endDate"
            @change="activePreset = 'custom'; fetchData();"
            class="form-control form-control-sm border-0 bg-transparent text-dark fw-semibold"
            style="width: 130px; font-size: 0.78rem;"
          />
        </div>

        <!-- Export CSV Button -->
        <button @click="exportCsv" class="btn btn-outline-success btn-sm rounded-pill px-3 fw-bold">
          <i class="fa-solid fa-file-excel me-1"></i> {{ langStore.isEnglish ? 'Export Excel' : 'Xuất Excel' }}
        </button>

        <!-- Refresh Button -->
        <button @click="fetchData" class="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold">
          <i class="fa-solid fa-rotate me-1"></i> {{ langStore.isEnglish ? 'Refresh' : 'Làm mới' }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-danger" role="status"></div>
    </div>

    <template v-else>
      <!-- KPI Metric Cards Grid -->
      <div class="row g-3 mb-4">
        <div class="col-xl-3 col-md-6">
          <div class="glass-card p-4 rounded-4 bg-white border-start border-danger border-5 shadow-sm">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <small class="text-muted fw-semibold d-block mb-1">{{ langStore.t('admin.dashboard.totalRevenue') }}</small>
                <h3 class="fw-bold text-danger brand-font mb-0">{{ (kpis.totalRevenue || 0).toLocaleString('vi-VN') }}đ</h3>
              </div>
              <div class="p-3 bg-danger bg-opacity-10 text-danger rounded-circle">
                <i class="fa-solid fa-money-bill-wave fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="glass-card p-4 rounded-4 bg-white border-start border-warning border-5 shadow-sm">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <small class="text-muted fw-semibold d-block mb-1">{{ langStore.t('admin.dashboard.occupancyRate') }}</small>
                <h3 class="fw-bold text-dark brand-font mb-0">{{ kpis.occupancyRate || '0%' }}</h3>
              </div>
              <div class="p-3 bg-warning bg-opacity-15 text-warning rounded-circle">
                <i class="fa-solid fa-chart-pie fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="glass-card p-4 rounded-4 bg-white border-start border-primary border-5 shadow-sm">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <small class="text-muted fw-semibold d-block mb-1">{{ langStore.t('admin.dashboard.totalReservations') }}</small>
                <h3 class="fw-bold text-primary brand-font mb-0">{{ kpis.reservationsCount || kpis.totalReservations || 0 }}</h3>
              </div>
              <div class="p-3 bg-primary bg-opacity-10 text-primary rounded-circle">
                <i class="fa-solid fa-calendar-check fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6">
          <div class="glass-card p-4 rounded-4 bg-white border-start border-success border-5 shadow-sm">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <small class="text-muted fw-semibold d-block mb-1">{{ langStore.t('admin.dashboard.activeSessions') }}</small>
                <h3 class="fw-bold text-success brand-font mb-0">{{ kpis.occupiedTables || kpis.activeSessions || 0 }}</h3>
              </div>
              <div class="p-3 bg-success bg-opacity-10 text-success rounded-circle">
                <i class="fa-solid fa-utensils fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ BIỂU ĐỒ GIỜ CAO ĐIỂM (PEAK HOURS ANALYTICS) ═══ -->
      <div class="glass-card p-4 rounded-4 bg-white shadow-sm mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <h5 class="fw-bold brand-font text-dark mb-0">
              <i class="fa-solid fa-chart-simple text-danger me-2"></i>
              {{ langStore.isEnglish ? 'Peak Hours Analytics (08:00 - 23:00)' : 'Biểu Đồ Giờ Cao Điểm Nhà Hàng (08:00 – 23:00)' }}
            </h5>
            <small class="text-muted">Mật độ lượng khách và doanh thu theo từng khung giờ trong ngày</small>
          </div>

          <div class="d-flex align-items-center gap-3 fs-8">
            <span class="d-inline-flex align-items-center gap-1">
              <span class="badge bg-danger p-1 rounded-circle" style="width: 10px; height: 10px;"></span> Giờ cao điểm vàng
            </span>
            <span class="d-inline-flex align-items-center gap-1">
              <span class="badge bg-secondary opacity-50 p-1 rounded-circle" style="width: 10px; height: 10px;"></span> Giờ thường nhật
            </span>
          </div>
        </div>

        <!-- Visual Bar Chart -->
        <div class="peak-hours-chart-container pt-3 pb-2">
          <div class="d-flex align-items-end justify-content-between gap-1 h-100" style="min-height: 180px;">
            <div
              v-for="slot in peakHoursData"
              :key="slot.hour"
              class="peak-hour-col text-center d-flex flex-column align-items-center justify-content-end flex-grow-1"
              :title="`${slot.label}: ${slot.orderCount} lượt thanh toán (${slot.revenue.toLocaleString('vi-VN')}đ)`"
            >
              <small class="fs-10 text-muted fw-bold mb-1" v-if="slot.orderCount > 0">{{ slot.orderCount }}</small>
              <div
                class="peak-bar rounded-top-3 transition-all"
                :style="{
                  height: getBarHeight(slot.orderCount) + 'px',
                  backgroundColor: isPeakHour(slot.hour) ? '#dc2626' : (slot.orderCount > 0 ? '#f87171' : '#e2e8f0')
                }"
              ></div>
              <span class="peak-hour-label mt-1.5 fs-10" :class="isPeakHour(slot.hour) ? 'fw-bold text-danger' : 'text-muted'">
                {{ slot.hour }}h
              </span>
            </div>
          </div>
        </div>

        <!-- Khung tóm tắt giờ cao điểm -->
        <div class="row g-2 mt-2 pt-3 border-top">
          <div class="col-md-6">
            <div class="p-2.5 rounded-3 bg-danger bg-opacity-10 border border-danger border-opacity-25 d-flex align-items-center gap-2.5">
              <i class="fa-solid fa-sun text-danger fs-5"></i>
              <div>
                <strong class="d-block text-danger fs-8">Cao Điểm Ca Trưa: 11:30 – 13:30</strong>
                <small class="text-secondary fs-9">Tập trung khách văn phòng, gia đình và khách dùng lẩu nhanh.</small>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="p-2.5 rounded-3 bg-warning bg-opacity-15 border border-warning border-opacity-50 d-flex align-items-center gap-2.5">
              <i class="fa-solid fa-moon text-dark fs-5"></i>
              <div>
                <strong class="d-block text-dark fs-8">Cao Điểm Ca Tối: 18:30 – 21:00</strong>
                <small class="text-secondary fs-9">Tập trung tiệc sinh nhật, liên hoan công ty, lẩu cua & hải sản đặc sản.</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts & Top Dishes Row -->
      <div class="row g-4 mb-4">
        <!-- Top 5 Best Sellers -->
        <div class="col-lg-6">
          <div class="glass-card p-4 rounded-4 bg-white shadow-sm h-100">
            <h5 class="fw-bold brand-font text-dark mb-3">
              <i class="fa-solid fa-fire text-danger me-2"></i>{{ langStore.t('admin.dashboard.topDishes') }}
            </h5>
            <div v-if="topDishes.length > 0" class="list-group list-group-flush">
              <div v-for="(item, idx) in topDishes" :key="idx" class="list-group-item px-0 py-2.5 d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-3">
                  <span class="badge bg-danger rounded-circle p-2 fs-8" style="width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;">{{ idx + 1 }}</span>
                  <strong class="text-dark fs-7">{{ item.name || item.dishName }}</strong>
                </div>
                <div class="text-end">
                  <span class="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1 fw-bold fs-8 me-2">
                    {{ item.totalQuantity }} suất
                  </span>
                  <strong class="text-dark fs-7">{{ (item.totalRevenue || 0).toLocaleString('vi-VN') }}đ</strong>
                </div>
              </div>
            </div>
            <p v-else class="text-muted small py-4 text-center mb-0">Chưa có dữ liệu bán món ăn trong khoảng thời gian này</p>
          </div>
        </div>

        <!-- Inventory Alerts -->
        <div class="col-lg-6">
          <div class="glass-card p-4 rounded-4 bg-white shadow-sm h-100">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold brand-font text-dark mb-0">
                <i class="fa-solid fa-triangle-exclamation text-warning me-2"></i>{{ langStore.t('admin.dashboard.lowStock') }}
              </h5>
              <span class="badge bg-warning text-dark rounded-pill px-3 py-1 fw-bold fs-8">
                {{ lowStockIngredients.length }} nguyên liệu
              </span>
            </div>
            <div v-if="lowStockIngredients.length > 0" class="list-group list-group-flush">
              <div v-for="ing in lowStockIngredients" :key="ing._id" class="list-group-item px-0 py-2.5 d-flex justify-content-between align-items-center">
                <div>
                  <strong class="text-dark fs-7 d-block">{{ ing.name }}</strong>
                  <small class="text-muted">Ngưỡng cảnh báo: {{ ing.minStockLevel }} {{ ing.unit }}</small>
                </div>
                <span class="badge bg-danger rounded-pill px-3 py-1.5 fw-bold fs-8">
                  Còn: {{ ing.stockQuantity }} {{ ing.unit }}
                </span>
              </div>
            </div>
            <p v-else class="text-success small py-4 text-center mb-0 fw-semibold">
              <i class="fa-solid fa-circle-check me-1"></i> Tất cả nguyên liệu kho đều đầy đủ trên ngưỡng an toàn!
            </p>
          </div>
        </div>
      </div>

      <!-- Tổng quan trạng thái đặt bàn & đơn món -->
      <div class="glass-card p-4 rounded-4 bg-white shadow-sm mb-4">
        <h5 class="fw-bold brand-font text-dark mb-3">
          <i class="fa-solid fa-list-check text-danger me-2"></i>
          {{ langStore.isEnglish ? 'Status Overview' : 'Tổng Quan Trạng Thái' }}
        </h5>
        <div class="row g-3">
          <div class="col-lg-7">
            <small class="text-muted fw-semibold d-block mb-2">{{ langStore.isEnglish ? 'Reservation Status' : 'Trạng Thái Đơn Đặt Bàn' }}</small>
            <div class="d-flex flex-wrap gap-2">
              <span class="badge bg-warning text-dark rounded-pill px-3 py-2 fs-7">{{ langStore.isEnglish ? 'Pending' : 'Chờ Xác Nhận' }}: {{ resStatusCount('PENDING') }}</span>
              <span class="badge bg-success rounded-pill px-3 py-2 fs-7">{{ langStore.isEnglish ? 'Confirmed' : 'Đã Xác Nhận' }}: {{ resStatusCount('CONFIRMED') }}</span>
              <span class="badge bg-primary rounded-pill px-3 py-2 fs-7">{{ langStore.isEnglish ? 'Checked In' : 'Đã Vào Bàn' }}: {{ resStatusCount('ARRIVED') }}</span>
              <span class="badge bg-secondary rounded-pill px-3 py-2 fs-7">{{ langStore.isEnglish ? 'Paid' : 'Đã Thanh Toán' }}: {{ resStatusCount('COMPLETED') }}</span>
              <span class="badge bg-danger rounded-pill px-3 py-2 fs-7">{{ langStore.isEnglish ? 'Cancelled' : 'Đã Hủy' }}: {{ resStatusCount('CANCELLED') }}</span>
            </div>
          </div>
          <div class="col-lg-5">
            <small class="text-muted fw-semibold d-block mb-2">{{ langStore.isEnglish ? 'Order Status' : 'Trạng Thái Đơn Món' }}</small>
            <div class="d-flex flex-wrap gap-2">
              <span class="badge bg-warning text-dark rounded-pill px-3 py-2 fs-7">{{ langStore.isEnglish ? 'Pending' : 'Chờ Chế Biến' }}: {{ orderStatusCount('PENDING') }}</span>
              <span class="badge bg-danger rounded-pill px-3 py-2 fs-7">{{ langStore.isEnglish ? 'Preparing' : 'Đang Chế Biến' }}: {{ orderStatusCount('PREPARING') }}</span>
              <span class="badge bg-success rounded-pill px-3 py-2 fs-7">{{ langStore.isEnglish ? 'Served' : 'Đã Phục Vụ' }}: {{ orderStatusCount('SERVED') }}</span>
            </div>
            <div class="d-flex gap-2 mt-3">
              <div class="p-2 rounded-3 bg-success bg-opacity-10 flex-grow-1 text-center">
                <small class="text-muted d-block fs-8">{{ langStore.isEnglish ? 'Deposit Collected' : 'Cọc Đã Thu' }}</small>
                <strong class="text-success fs-7">{{ (depositStats.collected || 0).toLocaleString('vi-VN') }}đ</strong>
              </div>
              <div class="p-2 rounded-3 bg-warning bg-opacity-10 flex-grow-1 text-center">
                <small class="text-muted d-block fs-8">{{ langStore.isEnglish ? 'Deposit Pending' : 'Cọc Chờ Thu' }}</small>
                <strong class="text-warning fs-7">{{ (depositStats.pending || 0).toLocaleString('vi-VN') }}đ</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Breakdown & Method Summary -->
      <div v-if="paymentBreakdown.length > 0" class="glass-card p-4 rounded-4 bg-white shadow-sm mb-4">
        <h5 class="fw-bold brand-font text-dark mb-3">
          <i class="fa-solid fa-wallet text-primary me-2"></i>
          {{ langStore.isEnglish ? 'Payment Method Breakdown' : 'Phân Bổ Doanh Thu Theo Phương Thức Thanh Toán' }}
        </h5>
        <div class="row g-3">
          <div v-for="pm in paymentBreakdown" :key="pm._id" class="col-md-3 col-sm-6">
            <div class="p-3 rounded-4 border bg-light">
              <span class="badge bg-danger rounded-pill px-2.5 py-1 mb-1 fs-8 fw-bold">{{ pm._id }}</span>
              <strong class="d-block text-dark fs-6 mt-1">{{ pm.total.toLocaleString('vi-VN') }}đ</strong>
              <small class="text-muted fs-8">{{ pm.count }} {{ langStore.isEnglish ? 'invoices' : 'hóa đơn' }}</small>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { connectSocket } from "../../services/socket";
import api from "../../services/api";
import { useLangStore } from "../../stores/langStore";
import { toast } from "../../composables/useToast";

const langStore = useLangStore();
const loading = ref(false);
const kpis = ref({});
const topDishes = ref([]);
const lowStockIngredients = ref([]);
const paymentBreakdown = ref([]);
const reservationStatusCounts = ref([]);
const orderStatusCounts = ref([]);
const peakHoursData = ref([]);
const depositStats = ref({ collected: 0, pending: 0 });

const activePreset = ref("today");
const startDate = ref("");
const endDate = ref("");

const resStatusCount = (status) => reservationStatusCounts.value.find((s) => s._id === status)?.count || 0;
const orderStatusCount = (status) => orderStatusCounts.value.find((s) => s._id === status)?.count || 0;

const isPeakHour = (hour) => {
  return (hour >= 11 && hour <= 13) || (hour >= 18 && hour <= 21);
};

const getBarHeight = (count) => {
  const maxCount = Math.max(1, ...peakHoursData.value.map((p) => p.orderCount));
  const normalized = (count / maxCount) * 120;
  return Math.max(count > 0 ? 16 : 4, normalized);
};

const formatDateString = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const setPreset = (preset) => {
  activePreset.value = preset;
  const now = new Date();

  if (preset === "today") {
    startDate.value = formatDateString(now);
    endDate.value = formatDateString(now);
  } else if (preset === "7days") {
    const past7 = new Date();
    past7.setDate(now.getDate() - 6);
    startDate.value = formatDateString(past7);
    endDate.value = formatDateString(now);
  } else if (preset === "thisMonth") {
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    startDate.value = formatDateString(firstDay);
    endDate.value = formatDateString(now);
  }
  fetchData();
};

const fetchData = async () => {
  loading.value = true;
  try {
    const params = {};
    if (startDate.value) params.startDate = startDate.value;
    if (endDate.value) params.endDate = endDate.value;

    const res = await api.get("/dashboard/stats", { params });
    const data = res.data.data;
    kpis.value = {
      totalRevenue: data.totalRevenue || 0,
      occupancyRate: data.tablesOverview?.occupancyRate || '0%',
      reservationsCount: data.reservationsCount || 0,
      occupiedTables: data.tablesOverview?.occupiedTables || 0,
    };
    topDishes.value = data.topDishes || [];
    lowStockIngredients.value = data.lowStockAlerts?.ingredients || [];
    paymentBreakdown.value = data.paymentMethodBreakdown || [];
    reservationStatusCounts.value = data.reservationStatusCounts || [];
    orderStatusCounts.value = data.orderStatusCounts || [];
    peakHoursData.value = data.peakHours || [];
    depositStats.value = data.depositStats || { collected: 0, pending: 0 };
  } catch (err) {
    console.error("Lỗi lấy dữ liệu Dashboard:", err);
    toast.error("Không thể tải dữ liệu báo cáo");
  } finally {
    loading.value = false;
  }
};

const exportCsv = () => {
  const headers = ["Khung Gio", "So Luot Don", "Doanh Thu (VND)"];
  const rows = peakHoursData.value.map((p) => [
    p.label,
    p.orderCount,
    p.revenue,
  ]);
  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Bao_Cao_Gio_Cao_Diem_${startDate.value || 'today'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success("Đã xuất báo cáo CSV thành công!");
};

onMounted(() => {
  setPreset("today");
  const socket = connectSocket();
  if (socket) {
    socket.on("orders:changed", () => fetchData());
    socket.on("invoices:changed", () => fetchData());
    socket.on("reservations:changed", () => fetchData());
  }
});
</script>

<style scoped>
.peak-hours-chart-container {
  overflow-x: auto;
}
.peak-hour-col {
  min-width: 38px;
}
.peak-bar {
  width: 100%;
  max-width: 24px;
  min-height: 4px;
}
.peak-bar:hover {
  filter: brightness(1.15);
  transform: scaleY(1.05);
}
.fs-10 {
  font-size: 0.7rem;
}
.transition-all {
  transition: all 0.2s ease;
}
</style>
