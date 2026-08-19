<template>
  <div class="modal d-block bg-dark bg-opacity-50" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-5 p-3 p-md-4 shadow-lg border-0">
        <!-- Header -->
        <div class="modal-header border-0 pb-1">
          <div>
            <h5 class="modal-title fw-bold brand-font text-danger mb-0">
              <i class="fa-solid fa-sliders me-2"></i>Tùy Chỉnh Check-in / Ghép Bàn & Số Khách
            </h5>
            <small class="text-muted fs-8">
              Đơn đặt bàn <strong>{{ reservation.reservationCode }}</strong> — {{ reservation.customerName }} ({{ reservation.customerPhone }})
            </small>
          </div>
          <button @click="$emit('close')" type="button" class="btn-close" :disabled="loading"></button>
        </div>

        <!-- Mode Switcher Tabs -->
        <div class="px-3 pt-2">
          <ul class="nav nav-pills gap-2 bg-light p-1.5 rounded-pill border d-inline-flex">
            <li class="nav-item">
              <button
                type="button"
                @click="checkinMode = 'new_table'"
                :class="['btn rounded-pill px-3.5 py-1.5 fw-semibold fs-8', checkinMode === 'new_table' ? 'btn-danger shadow-2xs' : 'btn-light border-0 text-secondary']"
                :disabled="loading"
              >
                <i class="fa-solid fa-door-open me-1.5"></i> Mở Bàn Riêng Mới
              </button>
            </li>
            <li class="nav-item">
              <button
                type="button"
                @click="checkinMode = 'merge_friend'"
                :class="['btn rounded-pill px-3.5 py-1.5 fw-semibold fs-8', checkinMode === 'merge_friend' ? 'btn-primary shadow-2xs' : 'btn-light border-0 text-secondary']"
                :disabled="loading"
              >
                <i class="fa-solid fa-user-group me-1.5"></i> Ghép Vào Bàn Người Quen Đang Ăn
              </button>
            </li>
          </ul>
        </div>

        <div class="modal-body py-3">
          <!-- ================= TAB 1: MỞ BÀN RIÊNG ================= -->
          <div v-if="checkinMode === 'new_table'" class="row g-3">
            <!-- Cột trái: Thông tin & số khách -->
            <div class="col-md-5 border-end-md">
              <div class="p-3 bg-light rounded-4 border mb-3">
                <div class="d-flex justify-content-between small text-secondary mb-1">
                  <span>Khách hàng:</span>
                  <strong class="text-dark">{{ reservation.customerName }}</strong>
                </div>
                <div class="d-flex justify-content-between small text-secondary mb-1">
                  <span>Số điện thoại:</span>
                  <strong class="text-dark">{{ reservation.customerPhone }}</strong>
                </div>
                <div class="d-flex justify-content-between small text-secondary mb-1">
                  <span>Số khách đặt ban đầu:</span>
                  <span class="badge bg-secondary rounded-pill">{{ reservation.guestsCount }} người</span>
                </div>
                <div class="d-flex justify-content-between small text-secondary">
                  <span>Bàn ban đầu:</span>
                  <strong class="text-danger">
                    {{ (reservation.tables || []).map(t => t.tableNumber || t).join(', ') || 'Chưa gán' }}
                  </strong>
                </div>
              </div>

              <!-- Điều chỉnh số khách thực tế -->
              <div class="mb-3">
                <label class="form-label fw-semibold fs-7 text-dark">
                  Số khách thực tế đến ăn <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm px-3"
                    @click="decreaseGuests"
                    :disabled="loading"
                  >
                    <i class="fa-solid fa-minus"></i>
                  </button>
                  <input
                    v-model.number="form.actualGuestsCount"
                    type="number"
                    min="1"
                    max="100"
                    class="form-control text-center fw-bold fs-6"
                    required
                    :disabled="loading"
                  />
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm px-3"
                    @click="increaseGuests"
                    :disabled="loading"
                  >
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
                <small class="text-muted fs-8 mt-1 d-block">
                  (Khách có thể đi nhiều hơn hoặc ít hơn số lượng đã đặt)
                </small>
              </div>

              <!-- Sức chứa bàn đã chọn -->
              <div
                class="p-3 rounded-4 border mb-2"
                :class="selectedTotalCapacity >= form.actualGuestsCount ? 'bg-success bg-opacity-10 border-success' : 'bg-warning bg-opacity-10 border-warning'"
              >
                <div class="d-flex justify-content-between align-items-center small mb-1">
                  <span>Bàn chọn thực tế:</span>
                  <strong class="text-dark">{{ selectedTablesList.map(t => t.tableNumber).join(' + ') || 'Chưa chọn' }}</strong>
                </div>
                <div class="d-flex justify-content-between align-items-center small">
                  <span>Sức chứa / Số khách:</span>
                  <strong :class="selectedTotalCapacity >= form.actualGuestsCount ? 'text-success' : 'text-warning'">
                    {{ selectedTotalCapacity }} chỗ / {{ form.actualGuestsCount }} khách
                  </strong>
                </div>
                <small
                  v-if="form.tableIds.length > 0 && selectedTotalCapacity < form.actualGuestsCount"
                  class="text-danger d-block mt-1 fs-8 fw-semibold"
                >
                  <i class="fa-solid fa-triangle-exclamation me-1"></i>Sức chứa bàn chưa đủ cho số khách!
                </small>
              </div>
            </div>

            <!-- Cột phải: Chọn bàn trống thực tế -->
            <div class="col-md-7">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <label class="form-label fw-semibold fs-7 text-dark mb-0">
                  <i class="fa-solid fa-chair text-danger me-1"></i>Chọn bàn thực tế mở cho khách
                </label>
                <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-2.5 py-1 fs-8">
                  {{ selectableTables.length }} bàn khả dụng
                </span>
              </div>

              <div class="table-select-scroll border rounded-4 p-3 bg-light">
                <div v-for="(tablesInArea, areaName) in tablesByArea" :key="areaName" class="mb-3">
                  <div class="fw-bold text-secondary small mb-1.5 pb-1 border-bottom" style="font-size: 0.75rem;">
                    <i class="fa-solid fa-map-pin me-1 text-danger"></i>{{ areaName }}
                  </div>
                  <div class="row g-2">
                    <div v-for="t in tablesInArea" :key="t._id" class="col-6 col-sm-4">
                      <label
                        :class="[
                          'table-choice-card p-2 rounded-3 border text-center d-block cursor-pointer transition-all',
                          form.tableIds.includes(t._id) ? 'border-danger bg-danger bg-opacity-10 shadow-sm' : 'bg-white'
                        ]"
                      >
                        <input
                          type="checkbox"
                          :value="t._id"
                          v-model="form.tableIds"
                          class="d-none"
                          :disabled="loading"
                        />
                        <div class="d-flex justify-content-between align-items-center mb-0.5">
                          <span class="badge bg-light text-dark border fs-8 fw-bold">Bàn {{ t.tableNumber }}</span>
                          <i v-if="form.tableIds.includes(t._id)" class="fa-solid fa-circle-check text-danger fs-8"></i>
                          <span v-else class="text-success fs-9"><i class="fa-solid fa-circle"></i></span>
                        </div>
                        <small class="text-muted d-block fs-8">{{ t.capacity }} chỗ</small>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ================= TAB 2: GHÉP VÀO BÀN NGƯỜI QUEN ================= -->
          <div v-else class="row g-3">
            <div class="col-12">
              <div class="alert alert-primary py-2 px-3 rounded-4 d-flex align-items-center mb-3">
                <i class="fa-solid fa-people-arrows fs-5 text-primary me-2"></i>
                <div class="small">
                  Khách <strong>{{ reservation.customerName }}</strong> sẽ được gộp chung vào bàn của người quen đang ngồi ăn. Toàn bộ món đặt trước (Pre-order) sẽ tự động nạp chung vào <strong>1 hóa đơn duy nhất</strong>.
                </div>
              </div>
            </div>

            <!-- Cột trái: Chọn bàn người quen -->
            <div class="col-md-7 border-end-md">
              <label class="form-label fw-semibold fs-7 text-dark mb-2">
                <i class="fa-solid fa-utensils text-danger me-1"></i>Chọn bàn người quen đang ngồi ăn:
              </label>

              <div v-if="activeSessionsList.length === 0" class="text-center py-4 border rounded-4 bg-light text-muted">
                <i class="fa-solid fa-chair fs-3 d-block mb-1.5 opacity-50"></i>
                <span class="small">Hiện tại quán chưa có bàn nào đang hoạt động để gộp</span>
              </div>

              <div v-else class="table-select-scroll border rounded-4 p-2 bg-light">
                <div
                  v-for="sess in activeSessionsList"
                  :key="sess._id"
                  @click="selectedTargetSessionId = sess._id"
                  :class="[
                    'p-3 rounded-3 border mb-2 cursor-pointer transition-all bg-white',
                    selectedTargetSessionId === sess._id ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : ''
                  ]"
                >
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <strong class="text-danger fs-7">
                      <i class="fa-solid fa-table me-1"></i>Bàn {{ getSessionTableNumbers(sess) }}
                    </strong>
                    <span class="badge bg-danger rounded-pill px-2.5 py-0.5 fs-9">
                      {{ sess.actualGuestsCount || 1 }} người đang ngồi
                    </span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center small text-muted">
                    <span>Khách: <strong>{{ sess.customerName || 'Khách vãng lai' }}</strong></span>
                    <span>Mã: {{ sess.sessionCode }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cột phải: Cài đặt ghép bàn -->
            <div class="col-md-5">
              <!-- Số người đi kèm của khách đến sau -->
              <div class="mb-3">
                <label class="form-label fw-semibold fs-7 text-dark">
                  Số khách của đoàn đến sau <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm px-3"
                    @click="decreaseGuests"
                    :disabled="loading"
                  >
                    <i class="fa-solid fa-minus"></i>
                  </button>
                  <input
                    v-model.number="form.actualGuestsCount"
                    type="number"
                    min="1"
                    max="100"
                    class="form-control text-center fw-bold fs-6"
                    required
                    :disabled="loading"
                  />
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm px-3"
                    @click="increaseGuests"
                    :disabled="loading"
                  >
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>

              <!-- Tùy chọn xử lý bàn ban đầu của khách đặt online -->
              <div class="mb-3">
                <label class="form-label fw-semibold fs-7 text-dark">
                  Xử lý bàn đã giữ trước:
                </label>
                <div class="form-check mb-2">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="releaseTableRadio"
                    :value="false"
                    v-model="keepReservationTables"
                  />
                  <label class="form-check-label fs-8 text-dark" for="releaseTableRadio">
                    <strong>Sang ngồi chung bàn</strong> (Tự động trả bàn đã giữ về Trống để đón khách khác)
                  </label>
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="keepTableRadio"
                    :value="true"
                    v-model="keepReservationTables"
                  />
                  <label class="form-check-label fs-8 text-dark" for="keepTableRadio">
                    <strong>Kê thêm bàn</strong> (Ghép cả bàn đã giữ vào bàn người quen thành 1 cụm lớn)
                  </label>
                </div>
              </div>

              <div v-if="selectedTargetSession" class="p-2.5 bg-success bg-opacity-10 border border-success rounded-3 small">
                <i class="fa-solid fa-circle-check text-success me-1"></i>
                Sau khi gộp: Bàn sẽ có tổng cộng <strong>{{ (selectedTargetSession.actualGuestsCount || 1) + form.actualGuestsCount }} người</strong>.
              </div>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger small rounded-3 mt-3 mb-0">
            <i class="fa-solid fa-circle-exclamation me-1"></i>{{ error }}
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer border-0 pt-2">
          <button @click="$emit('close')" class="btn btn-light rounded-pill px-4" :disabled="loading">Hủy</button>
          
          <!-- Submit Mở Bàn Mới -->
          <button
            v-if="checkinMode === 'new_table'"
            @click="handleSubmitNewTable"
            :disabled="form.tableIds.length === 0 || loading"
            class="btn btn-success rounded-pill px-5 fw-bold shadow-sm"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="fa-solid fa-door-open me-1.5"></i>
            Xác Nhận Mở Bàn ({{ form.tableIds.length }} bàn)
          </button>

          <!-- Submit Ghép Người Quen -->
          <button
            v-else
            @click="handleSubmitMergeFriend"
            :disabled="!selectedTargetSessionId || loading"
            class="btn btn-primary rounded-pill px-5 fw-bold shadow-sm"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="fa-solid fa-user-group me-1.5"></i>
            Xác Nhận Check-in & Ghép Vào Người Quen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useTableStore } from "../../../stores/tableStore";
import { useSessionStore } from "../../../stores/sessionStore";

const props = defineProps({
  reservation: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "submit", "submit-merge"]);

const tableStore = useTableStore();
const sessionStore = useSessionStore();

const checkinMode = ref("new_table"); // 'new_table' | 'merge_friend'
const selectedTargetSessionId = ref("");
const keepReservationTables = ref(false);

const initialTableIds = (props.reservation.tables || []).map((t) => (t._id || t).toString());

const form = reactive({
  actualGuestsCount: props.reservation.guestsCount || 2,
  tableIds: [...initialTableIds],
});

const activeSessionsList = computed(() => {
  return sessionStore.activeSessions || [];
});

const selectedTargetSession = computed(() => {
  return activeSessionsList.value.find((s) => s._id === selectedTargetSessionId.value);
});

const getSessionTableNumbers = (sess) => {
  if (!sess.tables || sess.tables.length === 0) return "—";
  return sess.tables.map((t) => t.tableNumber || t).join(" + ");
};

const selectableTables = computed(() => {
  return tableStore.tables.filter((t) => {
    const isAlreadyAssigned = initialTableIds.includes(t._id.toString());
    return t.status === "AVAILABLE" || isAlreadyAssigned;
  });
});

const selectedTablesList = computed(() => {
  return tableStore.tables.filter((t) => form.tableIds.includes(t._id));
});

const selectedTotalCapacity = computed(() => {
  return selectedTablesList.value.reduce((sum, t) => sum + (t.capacity || 0), 0);
});

const tablesByArea = computed(() => {
  const grouped = {};
  for (const t of selectableTables.value) {
    const areaName = t.area?.name || "Khu vực chung";
    (grouped[areaName] ||= []).push(t);
  }
  return grouped;
});

const decreaseGuests = () => {
  if (form.actualGuestsCount > 1) form.actualGuestsCount--;
};

const increaseGuests = () => {
  form.actualGuestsCount++;
};

const handleSubmitNewTable = () => {
  emit("submit", {
    reservationId: props.reservation._id,
    actualGuestsCount: form.actualGuestsCount,
    tableIds: form.tableIds,
  });
};

const handleSubmitMergeFriend = () => {
  emit("submit-merge", {
    reservationId: props.reservation._id,
    targetSessionId: selectedTargetSessionId.value,
    actualGuestsCount: form.actualGuestsCount,
    keepReservationTables: keepReservationTables.value,
  });
};

onMounted(() => {
  tableStore.fetchTables();
  sessionStore.fetchActiveSessions();
});
</script>

<style scoped>
.table-select-scroll {
  max-height: 280px;
  overflow-y: auto;
}
.table-choice-card {
  user-select: none;
}
.table-choice-card:hover {
  border-color: #16a34a !important;
}
.shadow-2xs {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
@media (min-width: 768px) {
  .border-end-md {
    border-right: 1px solid #dee2e6;
    padding-right: 1.5rem;
  }
}
</style>
