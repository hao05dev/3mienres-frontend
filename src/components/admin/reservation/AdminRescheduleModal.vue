<template>
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.6); z-index: 1060;" @click.self="$emit('close')">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
        <!-- Modal Header -->
        <div class="modal-header bg-danger text-white px-4 py-3 border-0">
          <div class="d-flex align-items-center gap-2">
            <div class="p-2 bg-white bg-opacity-20 rounded-circle text-white">
              <i class="fa-solid fa-calendar-days fs-5"></i>
            </div>
            <div>
              <h5 class="modal-title fw-bold mb-0 brand-font">Quản Lý Dời Lịch Đặt Bàn</h5>
              <small class="text-white-50">Mã đơn: <strong>{{ reservation.reservationCode }}</strong> · Khách: {{ reservation.customerName }} ({{ reservation.customerPhone }})</small>
            </div>
          </div>
          <button type="button" class="btn-close btn-close-white" @click="$emit('close')"></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body p-4 bg-light">
          <!-- Thông tin hiện tại -->
          <div class="p-3 bg-white rounded-3 border mb-3 shadow-2xs">
            <div class="row g-2 align-items-center">
              <div class="col-sm-4">
                <small class="text-muted d-block">Giờ hẹn hiện tại:</small>
                <strong class="text-dark">{{ formatDateTime(reservation.startAt) }}</strong>
              </div>
              <div class="col-sm-4">
                <small class="text-muted d-block">Số lượng khách:</small>
                <span class="badge bg-secondary px-2.5 py-1 rounded-pill">{{ reservation.guestsCount }} người</span>
              </div>
              <div class="col-sm-4">
                <small class="text-muted d-block">Bàn đang giữ:</small>
                <div v-if="reservation.tables && reservation.tables.length > 0" class="d-flex gap-1 flex-wrap mt-0.5">
                  <span v-for="t in reservation.tables" :key="t._id" class="badge bg-danger rounded-pill">
                    Bàn {{ t.tableNumber }} ({{ t.capacity }} chỗ)
                  </span>
                </div>
                <span v-else class="text-muted small">Chưa gán bàn</span>
              </div>
            </div>
          </div>

          <!-- Form chọn thời gian mới -->
          <div class="p-3 bg-white rounded-3 border mb-3 shadow-2xs">
            <h6 class="fw-bold text-dark mb-3">
              <i class="fa-solid fa-clock-rotate-left text-danger me-2"></i>1. Chọn Thời Gian Mới Mong Muốn
            </h6>

            <div class="row g-3 align-items-end">
              <div class="col-md-7">
                <label class="form-label small fw-semibold text-dark mb-1">
                  Ngày & Giờ dùng bữa mới <span class="text-danger">*</span>
                </label>
                <input
                  type="datetime-local"
                  v-model="newStartAt"
                  @change="checkAvailability"
                  class="form-control fw-semibold"
                  :min="minDateTime"
                />
              </div>
              <div class="col-md-5">
                <button
                  type="button"
                  @click="checkAvailability"
                  :disabled="checking"
                  class="btn btn-outline-danger w-100 fw-semibold"
                >
                  <i v-if="checking" class="fa-solid fa-spinner fa-spin me-1"></i>
                  <i v-else class="fa-solid fa-rotate me-1"></i>
                  Kiểm tra bàn trống
                </button>
              </div>
            </div>

            <!-- Cảnh báo nếu chọn giờ cũ hoặc bất thường -->
            <div v-if="isSameTime" class="alert alert-warning py-2 px-3 mt-2 mb-0 fs-8">
              <i class="fa-solid fa-triangle-exclamation me-1"></i>
              Thời gian mới đang trùng với giờ hẹn hiện tại. Vui lòng chọn thời gian khác nếu muốn dời lịch.
            </div>
          </div>

          <!-- Chọn bàn mới -->
          <div class="p-3 bg-white rounded-3 border mb-3 shadow-2xs">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold text-dark mb-0">
                <i class="fa-solid fa-chair text-danger me-2"></i>2. Chọn Bàn Cho Khung Giờ Mới
              </h6>
              <small class="text-muted fs-8" v-if="availabilityData">
                Tìm thấy <strong>{{ availabilityData.availableTables.length }}</strong> bàn trống
              </small>
            </div>

            <!-- Loading bàn -->
            <div v-if="checking" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-danger" role="status"></div>
              <span class="text-muted small ms-2">Đang quét sơ đồ bàn và kiểm tra xung đột...</span>
            </div>

            <template v-else-if="availabilityData">
              <!-- Danh sách bàn trống -->
              <div v-if="availabilityData.availableTables.length > 0" class="mt-2">
                <small class="text-muted d-block mb-2">
                  Nhấp để chọn 1 hoặc nhiều bàn liền kề (Cần tối thiểu {{ reservation.guestsCount }} chỗ ngồi):
                </small>

                <div class="d-flex flex-wrap gap-2 mb-3 max-height-scroll p-1" style="max-height: 180px; overflow-y: auto;">
                  <button
                    v-for="t in availabilityData.availableTables"
                    :key="t._id"
                    type="button"
                    @click="toggleTable(t)"
                    :class="[
                      'btn btn-sm rounded-3 d-flex flex-column align-items-center justify-content-center p-2 text-start transition-all',
                      selectedTableIds.includes(t._id)
                        ? 'btn-danger text-white shadow-sm'
                        : 'btn-outline-secondary bg-white text-dark'
                    ]"
                    style="min-width: 86px;"
                  >
                    <strong class="fs-7">Bàn {{ t.tableNumber }}</strong>
                    <small style="font-size: 0.7rem;" :class="selectedTableIds.includes(t._id) ? 'text-white-50' : 'text-muted'">
                      {{ t.capacity }} chỗ · {{ t.area?.name || 'Chung' }}
                    </small>
                  </button>
                </div>

                <!-- Tổng sức chứa đã chọn -->
                <div class="d-flex justify-content-between align-items-center p-2 rounded-2 bg-light border fs-8">
                  <span>
                    Bàn đã chọn:
                    <strong class="text-danger ms-1">
                      {{ selectedTableIds.length > 0 ? selectedTableNumbers.join(', ') : 'Tự động chọn bàn tối ưu' }}
                    </strong>
                  </span>
                  <span :class="totalSelectedCapacity >= reservation.guestsCount ? 'text-success fw-bold' : 'text-danger fw-bold'">
                    Sức chứa: {{ totalSelectedCapacity }} / {{ reservation.guestsCount }} khách
                  </span>
                </div>
              </div>

              <!-- Hết bàn trống -->
              <div v-else class="alert alert-danger py-2.5 px-3 mb-0 fs-8">
                <i class="fa-solid fa-circle-exclamation me-1"></i>
                Không còn bàn nào trống trong khung giờ này. Vui lòng chọn ngày/giờ khác cho khách!
              </div>
            </template>

            <div v-else class="text-muted small py-3 text-center">
              Nhập ngày giờ mới và bấm "Kiểm tra bàn trống" để xem danh sách bàn khả dụng.
            </div>
          </div>

          <!-- Ghi chú / Lý do dời lịch -->
          <div class="p-3 bg-white rounded-3 border shadow-2xs">
            <h6 class="fw-bold text-dark mb-2">
              <i class="fa-solid fa-comment-dots text-danger me-2"></i>3. Lý Do / Ghi Chú Dời Lịch
            </h6>
            <input
              type="text"
              v-model="rescheduleReason"
              class="form-control form-control-sm"
              placeholder="VD: Khách gọi hotline xin dời do bận họp, Đổi sang tiệc gia đình..."
            />
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer px-4 py-3 bg-white border-top d-flex justify-content-between">
          <button type="button" class="btn btn-light rounded-pill px-4" @click="$emit('close')">
            Hủy Bỏ
          </button>

          <button
            type="button"
            @click="handleSubmit"
            :disabled="loading || checking || !newStartAt || isSameTime"
            class="btn btn-danger rounded-pill px-4 fw-bold shadow-sm"
          >
            <i v-if="loading" class="fa-solid fa-spinner fa-spin me-1"></i>
            <i v-else class="fa-solid fa-calendar-check me-1"></i>
            Xác Nhận Dời Lịch
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useReservationStore } from "../../../stores/reservationStore";
import { toast } from "../../../composables/useToast";

const props = defineProps({
  reservation: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit"]);
const reservationStore = useReservationStore();

const newStartAt = ref("");
const rescheduleReason = ref("");
const checking = ref(false);
const availabilityData = ref(null);
const selectedTableIds = ref([]);

const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const minDateTime = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
});

const isSameTime = computed(() => {
  if (!newStartAt.value || !props.reservation.startAt) return false;
  const t1 = new Date(newStartAt.value).getTime();
  const t2 = new Date(props.reservation.startAt).getTime();
  return Math.abs(t1 - t2) < 60000;
});

const totalSelectedCapacity = computed(() => {
  if (!availabilityData.value || selectedTableIds.value.length === 0) return 0;
  return availabilityData.value.availableTables
    .filter((t) => selectedTableIds.value.includes(t._id))
    .reduce((sum, t) => sum + t.capacity, 0);
});

const selectedTableNumbers = computed(() => {
  if (!availabilityData.value) return [];
  return availabilityData.value.availableTables
    .filter((t) => selectedTableIds.value.includes(t._id))
    .map((t) => `Bàn ${t.tableNumber}`);
});

const toggleTable = (table) => {
  const idx = selectedTableIds.value.indexOf(table._id);
  if (idx >= 0) {
    selectedTableIds.value.splice(idx, 1);
  } else {
    selectedTableIds.value.push(table._id);
  }
};

const checkAvailability = async () => {
  if (!newStartAt.value) return;
  checking.value = true;
  try {
    const data = await reservationStore.checkAvailability(
      newStartAt.value,
      props.reservation.guestsCount,
      props.reservation._id
    );
    availabilityData.value = data;

    // Gợi ý tự động: Nếu bàn cũ vẫn trống ở giờ mới thì giữ nguyên bàn cũ
    const currentTableIds = (props.reservation.tables || []).map((t) => t._id || t);
    const availableIds = new Set(data.availableTables.map((t) => t._id));
    const canKeepOldTables = currentTableIds.length > 0 && currentTableIds.every((id) => availableIds.has(id));

    if (canKeepOldTables) {
      selectedTableIds.value = [...currentTableIds];
    } else if (data.singleMatches && data.singleMatches.length > 0) {
      selectedTableIds.value = [data.singleMatches[0]._id];
    } else if (data.combinations && data.combinations.length > 0) {
      selectedTableIds.value = data.combinations[0].tables.map((t) => t._id);
    } else {
      selectedTableIds.value = [];
    }
  } catch (err) {
    toast.error(err.message || "Lỗi kiểm tra bàn trống");
  } finally {
    checking.value = false;
  }
};

const handleSubmit = () => {
  if (!newStartAt.value) {
    toast.error("Vui lòng chọn ngày & giờ dời lịch mới");
    return;
  }
  if (isSameTime.value) {
    toast.error("Vui lòng chọn thời gian khác với giờ hẹn hiện tại");
    return;
  }

  emit("submit", {
    reservationId: props.reservation._id,
    startAt: newStartAt.value,
    tableIds: selectedTableIds.value,
    reason: rescheduleReason.value.trim() || "Khách gọi hotline yêu cầu dời lịch",
  });
};

onMounted(() => {
  if (props.reservation.rescheduleRequest?.requestedStartAt) {
    const reqDate = new Date(props.reservation.rescheduleRequest.requestedStartAt);
    const pad = (n) => String(n).padStart(2, "0");
    newStartAt.value = `${reqDate.getFullYear()}-${pad(reqDate.getMonth() + 1)}-${pad(reqDate.getDate())}T${pad(reqDate.getHours())}:${pad(reqDate.getMinutes())}`;
    rescheduleReason.value = props.reservation.rescheduleRequest.reason || "";
  } else if (props.reservation.startAt) {
    const curDate = new Date(props.reservation.startAt);
    const pad = (n) => String(n).padStart(2, "0");
    newStartAt.value = `${curDate.getFullYear()}-${pad(curDate.getMonth() + 1)}-${pad(curDate.getDate())}T${pad(curDate.getHours())}:${pad(curDate.getMinutes())}`;
  }
  checkAvailability();
});
</script>

<style scoped>
.brand-font {
  font-family: 'Playfair Display', Georgia, serif;
}
.shadow-2xs {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.fs-7 {
  font-size: 0.85rem;
}
.fs-8 {
  font-size: 0.78rem;
}
.transition-all {
  transition: all 0.15s ease-in-out;
}
</style>
