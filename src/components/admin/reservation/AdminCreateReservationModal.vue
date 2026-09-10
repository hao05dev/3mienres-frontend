<template>
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.6); z-index: 1060;" @click.self="$emit('close')">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
        <!-- Modal Header -->
        <div class="modal-header bg-danger text-white px-4 py-3 border-0">
          <div class="d-flex align-items-center gap-2">
            <div class="p-2 bg-white bg-opacity-20 rounded-circle text-white">
              <i class="fa-solid fa-headset fs-5"></i>
            </div>
            <div>
              <h5 class="modal-title fw-bold mb-0 brand-font">Tiếp Nhận Đặt Bàn Qua Hotline / Tại Quầy</h5>
              <small class="text-white-50">Tạo đơn đặt bàn trực tiếp cho khách hàng liên hệ qua điện thoại hoặc vãng lai</small>
            </div>
          </div>
          <button type="button" class="btn-close btn-close-white" @click="$emit('close')"></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body p-4 bg-light" style="max-height: 75vh; overflow-y: auto;">
          <!-- 1. Thông Tin Khách Hàng -->
          <div class="p-3 bg-white rounded-3 border mb-3 shadow-2xs">
            <h6 class="fw-bold text-dark mb-3">
              <i class="fa-solid fa-user-check text-danger me-2"></i>1. Thông Tin Khách Hàng
            </h6>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small fw-semibold text-dark mb-1">
                  Họ và tên khách hàng <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  v-model="form.customerName"
                  class="form-control"
                  placeholder="VD: Anh Nam, Chị Lan..."
                  required
                />
              </div>
              <div class="col-md-6">
                <label class="form-label small fw-semibold text-dark mb-1">
                  Số điện thoại liên hệ <span class="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  v-model="form.customerPhone"
                  class="form-control"
                  placeholder="VD: 0901234567"
                  required
                />
              </div>
              <div class="col-md-12">
                <label class="form-label small fw-semibold text-dark mb-1">
                  Email (Tùy chọn)
                </label>
                <input
                  type="email"
                  v-model="form.customerEmail"
                  class="form-control"
                  placeholder="email@example.com (Dùng để gửi thông báo nếu có)"
                />
              </div>
            </div>
          </div>

          <!-- 2. Chi Tiết Lịch Hẹn & Số Khách -->
          <div class="p-3 bg-white rounded-3 border mb-3 shadow-2xs">
            <h6 class="fw-bold text-dark mb-3">
              <i class="fa-solid fa-calendar-check text-danger me-2"></i>2. Thời Gian & Quy Mô
            </h6>
            <div class="row g-3 align-items-end">
              <div class="col-md-5">
                <label class="form-label small fw-semibold text-dark mb-1">
                  Ngày & Giờ dùng bữa <span class="text-danger">*</span>
                </label>
                <input
                  type="datetime-local"
                  v-model="form.startAt"
                  @change="checkAvailability"
                  class="form-control fw-semibold"
                  :min="minDateTime"
                  required
                />
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-semibold text-dark mb-1">
                  Số lượng khách <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <input
                    type="number"
                    v-model.number="form.guestsCount"
                    @change="checkAvailability"
                    min="1"
                    max="100"
                    class="form-control fw-bold text-center"
                    required
                  />
                  <span class="input-group-text bg-light small">người</span>
                </div>
              </div>
              <div class="col-md-4">
                <label class="form-label small fw-semibold text-dark mb-1">
                  Loại đặt bàn
                </label>
                <select v-model="form.type" class="form-select">
                  <option value="NORMAL">Ăn Alacarte / Thường</option>
                  <option value="EVENT">Đặt Tiệc / Sự Kiện</option>
                  <option value="VIP">Phòng VIP Riêng</option>
                  <option value="BUFFET">Tiệc Buffet</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 3. Chọn Bàn Trống Khả Dụng -->
          <div class="p-3 bg-white rounded-3 border mb-3 shadow-2xs">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="fw-bold text-dark mb-0">
                <i class="fa-solid fa-chair text-danger me-2"></i>3. Chọn Sắp Xếp Bàn
              </h6>
              <button
                type="button"
                @click="checkAvailability"
                :disabled="checking || !form.startAt"
                class="btn btn-outline-danger btn-sm rounded-pill px-2.5 py-0.5 fs-8"
              >
                <i v-if="checking" class="fa-solid fa-spinner fa-spin me-1"></i>
                <i v-else class="fa-solid fa-rotate me-1"></i> Quét lại bàn
              </button>
            </div>

            <!-- Loading bàn -->
            <div v-if="checking" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-danger" role="status"></div>
              <span class="text-muted small ms-2">Đang kiểm tra sơ đồ bàn trống...</span>
            </div>

            <template v-else-if="availabilityData">
              <div v-if="availabilityData.availableTables.length > 0">
                <small class="text-muted d-block mb-2">
                  Hệ thống tự động gợi ý bàn trống phù hợp (hoặc nhấp chọn bàn thủ công):
                </small>

                <div class="d-flex flex-wrap gap-2 mb-3 max-height-scroll p-1" style="max-height: 160px; overflow-y: auto;">
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

                <!-- Bàn đã chọn -->
                <div class="d-flex justify-content-between align-items-center p-2 rounded-2 bg-light border fs-8">
                  <span>
                    Bàn gán:
                    <strong class="text-danger ms-1">
                      {{ selectedTableIds.length > 0 ? selectedTableNumbers.join(', ') : 'Chưa chọn bàn (Tự động gán)' }}
                    </strong>
                  </span>
                  <span :class="totalSelectedCapacity >= form.guestsCount ? 'text-success fw-bold' : 'text-danger fw-bold'">
                    Sức chứa: {{ totalSelectedCapacity }} / {{ form.guestsCount }} khách
                  </span>
                </div>
              </div>

              <div v-else class="alert alert-danger py-2 px-3 mb-0 fs-8">
                <i class="fa-solid fa-circle-exclamation me-1"></i>
                Không còn bàn trống cho khung giờ này. Vui lòng tư vấn khách đổi sang khung giờ khác!
              </div>
            </template>

            <div v-else class="text-muted small py-3 text-center">
              Chọn thời gian và số lượng khách để kiểm tra danh sách bàn trống khả dụng.
            </div>
          </div>

          <!-- 4. Tiền Cọc & Ghi Chú Hotline -->
          <div class="p-3 bg-white rounded-3 border shadow-2xs">
            <h6 class="fw-bold text-dark mb-3">
              <i class="fa-solid fa-receipt text-danger me-2"></i>4. Tiền Cọc & Ghi Chú Đơn
            </h6>
            <div class="row g-3">
              <div class="col-md-4">
                <label class="form-label small fw-semibold text-dark mb-1">
                  Số tiền cọc (VNĐ)
                </label>
                <input
                  type="number"
                  v-model.number="form.depositAmount"
                  min="0"
                  step="50000"
                  class="form-control fw-bold"
                  placeholder="0"
                />
              </div>
              <div class="col-md-4" v-if="form.depositAmount > 0">
                <label class="form-label small fw-semibold text-dark mb-1">
                  Trạng thái thu cọc
                </label>
                <select v-model="form.depositStatus" class="form-select">
                  <option value="PAID">Đã thu cọc</option>
                  <option value="UNPAID">Chờ khách nộp cọc</option>
                </select>
              </div>
              <div class="col-md-4" v-if="form.depositAmount > 0 && form.depositStatus === 'PAID'">
                <label class="form-label small fw-semibold text-dark mb-1">
                  Hình thức thu
                </label>
                <select v-model="form.depositMethod" class="form-select">
                  <option value="CASH">Tiền mặt tại quầy</option>
                  <option value="BANK_TRANSFER">Chuyển khoản VietQR</option>
                </select>
              </div>
              <div class="col-md-12">
                <label class="form-label small fw-semibold text-dark mb-1">
                  Ghi chú yêu cầu của khách
                </label>
                <input
                  type="text"
                  v-model="form.notes"
                  class="form-control form-control-sm"
                  placeholder="VD: Khách gọi hotline đặt tiệc sinh nhật, yêu cầu bàn cạnh cửa sổ..."
                />
              </div>
            </div>
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
            :disabled="loading || checking || !form.customerName || !form.customerPhone || !form.startAt"
            class="btn btn-danger rounded-pill px-4 fw-bold shadow-sm"
          >
            <i v-if="loading" class="fa-solid fa-spinner fa-spin me-1"></i>
            <i v-else class="fa-solid fa-circle-check me-1"></i>
            Tạo Đơn Đặt Bàn
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useReservationStore } from "../../../stores/reservationStore";
import { toast } from "../../../composables/useToast";

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit"]);
const reservationStore = useReservationStore();

const checking = ref(false);
const availabilityData = ref(null);
const selectedTableIds = ref([]);

const form = reactive({
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  guestsCount: 2,
  startAt: "",
  type: "NORMAL",
  depositAmount: 0,
  depositStatus: "NONE",
  depositMethod: "CASH",
  notes: "Khách đặt bàn qua Hotline nhà hàng",
});

const minDateTime = computed(() => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
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
  if (!form.startAt) return;
  checking.value = true;
  try {
    const data = await reservationStore.checkAvailability(form.startAt, form.guestsCount);
    availabilityData.value = data;

    // Tự động chọn bàn phù hợp nếu chưa chọn
    if (data.singleMatches && data.singleMatches.length > 0) {
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
  if (!form.customerName.trim()) {
    toast.error("Vui lòng nhập tên khách hàng");
    return;
  }
  if (!form.customerPhone.trim()) {
    toast.error("Vui lòng nhập số điện thoại khách");
    return;
  }
  if (!form.startAt) {
    toast.error("Vui lòng chọn thời gian dùng bữa");
    return;
  }

  emit("submit", {
    ...form,
    tableIds: selectedTableIds.value,
  });
};

onMounted(() => {
  // Mặc định chọn thời gian là 1 tiếng sau
  const nextHour = new Date(Date.now() + 60 * 60 * 1000);
  nextHour.setMinutes(0, 0, 0);
  const pad = (n) => String(n).padStart(2, "0");
  form.startAt = `${nextHour.getFullYear()}-${pad(nextHour.getMonth() + 1)}-${pad(nextHour.getDate())}T${pad(nextHour.getHours())}:${pad(nextHour.getMinutes())}`;
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
