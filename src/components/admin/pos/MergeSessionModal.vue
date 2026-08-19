<template>
  <div class="modal d-block bg-dark bg-opacity-50" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-5 p-3 p-md-4 shadow-lg border-0">
        <!-- Header -->
        <div class="modal-header border-0 pb-1">
          <div>
            <h5 class="modal-title fw-bold brand-font text-danger mb-0">
              <i class="fa-solid fa-code-merge me-2"></i>Gộp Bàn & Gom Hóa Đơn Khi Đang Ăn
            </h5>
            <small class="text-muted fs-8">
              Xử lý trường hợp khách ở 2 bàn nhận ra nhau mid-meal và muốn gộp chung thành 1 bàn / 1 hóa đơn
            </small>
          </div>
          <button @click="$emit('close')" type="button" class="btn-close" :disabled="loading"></button>
        </div>

        <div class="modal-body py-3">
          <div class="row g-3">
            <!-- Cột trái: Chọn bàn muốn gộp -->
            <div class="col-md-7 border-end-md">
              <!-- Bàn chính giữ lại -->
              <div class="p-3 bg-danger bg-opacity-10 border border-danger rounded-4 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="badge bg-danger rounded-pill px-2.5 py-1 fs-9 fw-bold">
                    <i class="fa-solid fa-star me-1"></i>Bàn Chính Giữ Lại
                  </span>
                  <span class="text-danger fw-bold fs-7">{{ targetSession.sessionCode }}</span>
                </div>
                <h5 class="fw-bold text-dark mb-1">
                  Bàn {{ tableNumbers(targetSession) }}
                </h5>
                <div class="small text-muted d-flex justify-content-between">
                  <span>Khách: <strong>{{ targetSession.customerName || 'Khách vãng lai' }}</strong></span>
                  <span>{{ targetSession.actualGuestsCount || 1 }} người · {{ targetSession.elapsedMinutes || 0 }} phút</span>
                </div>
              </div>

              <!-- Danh sách bàn phụ muốn gộp vào -->
              <label class="form-label fw-semibold fs-7 text-dark mb-2">
                <i class="fa-solid fa-utensils text-danger me-1"></i>Chọn bàn phụ muốn gộp vào bàn chính trên:
              </label>

              <div v-if="otherSessions.length === 0" class="text-center py-4 border rounded-4 bg-light text-muted small">
                <i class="fa-solid fa-chair fs-3 d-block mb-1.5 opacity-50"></i>
                Không có bàn nào khác đang hoạt động để gộp
              </div>

              <div v-else class="table-select-scroll border rounded-4 p-2 bg-light">
                <div
                  v-for="s in otherSessions"
                  :key="s._id"
                  @click="selectedSourceId = s._id"
                  :class="[
                    'p-3 rounded-3 border mb-2 cursor-pointer transition-all bg-white',
                    selectedSourceId === s._id ? 'border-danger bg-danger bg-opacity-10 shadow-sm' : ''
                  ]"
                >
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <strong class="text-danger fs-7">
                      <i class="fa-solid fa-table me-1"></i>Bàn {{ tableNumbers(s) }}
                    </strong>
                    <span class="badge bg-danger bg-opacity-15 text-danger rounded-pill px-2 py-0.5 fs-9 fw-bold">
                      {{ s.actualGuestsCount || 1 }} người
                    </span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center small text-muted">
                    <span>Khách: <strong>{{ s.customerName || 'Khách vãng lai' }}</strong></span>
                    <span>Mã: {{ s.sessionCode }} · {{ s.elapsedMinutes || 0 }} phút</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cột phải: Thiết lập phương án ghép & tóm tắt -->
            <div class="col-md-5">
              <div v-if="selectedSource" class="d-flex flex-column h-100 justify-content-between">
                <div>
                  <h6 class="fw-bold text-dark mb-2.5">
                    <i class="fa-solid fa-sliders text-danger me-1"></i>Phương Án Bàn Ăn:
                  </h6>

                  <!-- Radio Options -->
                  <div class="p-3 bg-light rounded-4 border mb-3">
                    <div class="form-check mb-2.5">
                      <input
                        class="form-check-input"
                        type="radio"
                        id="keepSourceRadio"
                        :value="true"
                        v-model="keepSourceTable"
                      />
                      <label class="form-check-label fs-8 text-dark" for="keepSourceRadio">
                        <strong>Kê thêm bàn (Ghép cả 2 bàn)</strong>
                        <small class="d-block text-muted">Giữ cả 2 bàn thành 1 cụm lớn để khách ngồi rộng rãi.</small>
                      </label>
                    </div>

                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        id="releaseSourceRadio"
                        :value="false"
                        v-model="keepSourceTable"
                      />
                      <label class="form-check-label fs-8 text-dark" for="releaseSourceRadio">
                        <strong>Khách sang ngồi chung bàn chính</strong>
                        <small class="d-block text-success fw-semibold">Tự động trả bàn phụ về TRỐNG để đón khách mới!</small>
                      </label>
                    </div>
                  </div>

                  <!-- Tóm tắt kết quả sau gộp -->
                  <div class="alert alert-warning py-2.5 px-3 rounded-4 mb-0 small">
                    <div class="fw-bold text-dark mb-1">
                      <i class="fa-solid fa-receipt text-warning me-1"></i>Sau khi gộp:
                    </div>
                    <ul class="ps-3 mb-0 text-secondary">
                      <li>Toàn bộ món đã gọi của <strong>{{ selectedSource.sessionCode }}</strong> sẽ chuyển sang <strong>{{ targetSession.sessionCode }}</strong>.</li>
                      <li>Tổng số khách phục vụ: <strong>{{ (targetSession.actualGuestsCount || 1) + (selectedSource.actualGuestsCount || 1) }} người</strong>.</li>
                      <li>Thu ngân chỉ cần **in 1 Hóa Đơn và thanh toán 1 lần duy nhất**!</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-5 text-muted small h-100 d-flex flex-column justify-content-center align-items-center border rounded-4 bg-light">
                <i class="fa-solid fa-arrow-left fs-3 mb-2 opacity-50"></i>
                <span>Vui lòng chọn 1 bàn phụ ở danh sách bên trái để xem phương án gộp</span>
              </div>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger small rounded-3 mt-3 mb-0">
            <i class="fa-solid fa-circle-exclamation me-1"></i>{{ error }}
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer border-0 pt-0">
          <button @click="$emit('close')" class="btn btn-light rounded-pill px-4" :disabled="loading">
            Hủy Bỏ
          </button>
          <button
            @click="submitMerge"
            :disabled="!selectedSourceId || loading"
            class="btn btn-danger rounded-pill px-5 fw-bold shadow-sm"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-1.5"></span>
            <i v-else class="fa-solid fa-code-merge me-1.5"></i>
            Xác Nhận Gộp Bàn & Gom Hóa Đơn
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  targetSession: {
    type: Object,
    required: true,
  },
  activeSessions: {
    type: Array,
    default: () => [],
  },
  error: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit"]);

const selectedSourceId = ref("");
const keepSourceTable = ref(true);

const otherSessions = computed(() => {
  return props.activeSessions.filter((s) => s._id !== props.targetSession._id);
});

const selectedSource = computed(() => {
  return otherSessions.value.find((s) => s._id === selectedSourceId.value);
});

const tableNumbers = (session) => {
  const tables = session.tables || [];
  return tables.map((t) => t.tableNumber || t).join(" + ") || "Bàn";
};

const submitMerge = () => {
  if (selectedSourceId.value) {
    emit("submit", {
      sourceSessionId: selectedSourceId.value,
      keepSourceTable: keepSourceTable.value,
    });
  }
};
</script>

<style scoped>
.table-select-scroll {
  max-height: 300px;
  overflow-y: auto;
}
.transition-all {
  transition: all 0.2s ease;
}
@media (min-width: 768px) {
  .border-end-md {
    border-right: 1px solid #dee2e6;
    padding-right: 1.5rem;
  }
}
</style>
