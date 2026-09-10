<template>
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.6); z-index: 1060;" @click.self="$emit('close')">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="modal-header bg-dark text-white px-4 py-3 border-0">
          <div class="d-flex align-items-center gap-2">
            <div class="p-2 bg-white bg-opacity-10 rounded-circle text-white">
              <i class="fa-solid fa-ban text-danger fs-5"></i>
            </div>
            <div>
              <h5 class="modal-title fw-bold mb-0 brand-font">Xác Nhận Hủy Đơn Đặt Bàn</h5>
              <small class="text-white-50">Mã đơn: <strong>{{ reservation.reservationCode }}</strong> · {{ reservation.customerName }}</small>
            </div>
          </div>
          <button type="button" class="btn-close btn-close-white" @click="$emit('close')"></button>
        </div>

        <!-- Body -->
        <div class="modal-body p-4 bg-light">
          <!-- Thông tin đơn -->
          <div class="p-3 bg-white rounded-3 border mb-3 shadow-2xs">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="text-muted small">Thời gian đặt bàn:</span>
              <strong class="text-dark small">{{ new Date(reservation.startAt).toLocaleString('vi-VN') }}</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="text-muted small">Số khách / Bàn:</span>
              <span class="small fw-semibold text-danger">
                {{ reservation.guestsCount }} khách ({{ (reservation.tables || []).map(t => 'Bàn ' + t.tableNumber).join(', ') || 'Chưa gán' }})
              </span>
            </div>
            <div v-if="reservation.depositAmount > 0" class="d-flex justify-content-between align-items-center pt-2 border-top mt-2">
              <span class="text-muted small">Tiền cọc:</span>
              <span class="badge bg-warning text-dark">{{ (reservation.depositAmount || 0).toLocaleString('vi-VN') }}đ ({{ reservation.depositStatus === 'PAID' ? 'Đã thu' : 'Chưa thu' }})</span>
            </div>
          </div>

          <!-- Nhập lý do hủy -->
          <div class="p-3 bg-white rounded-3 border shadow-2xs">
            <label class="form-label small fw-bold text-dark mb-1">
              Lý do hủy đơn <span class="text-danger">*</span>
            </label>

            <!-- Quick presets -->
            <div class="d-flex flex-wrap gap-1.5 mb-2">
              <button
                v-for="preset in reasonPresets"
                :key="preset"
                type="button"
                @click="reason = preset"
                class="btn btn-outline-secondary btn-sm rounded-pill py-0.5 px-2 fs-8"
              >
                {{ preset }}
              </button>
            </div>

            <textarea
              v-model="reason"
              class="form-control form-control-sm"
              rows="3"
              placeholder="Nhập chi tiết lý do hủy đơn..."
              required
            ></textarea>
            <small class="text-muted fs-8 mt-1 d-block">
              <i class="fa-solid fa-circle-info text-primary me-1"></i>
              Khi xác nhận hủy, bàn đã giữ sẽ được giải phóng ngay lập tức để phục vụ khách khác.
            </small>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer px-4 py-3 bg-white border-top d-flex justify-content-between">
          <button type="button" class="btn btn-light rounded-pill px-4" @click="$emit('close')">
            Giữ Lại Đơn
          </button>

          <button
            type="button"
            @click="handleSubmit"
            :disabled="loading || !reason.trim()"
            class="btn btn-danger rounded-pill px-4 fw-bold shadow-sm"
          >
            <i v-if="loading" class="fa-solid fa-spinner fa-spin me-1"></i>
            <i v-else class="fa-solid fa-ban me-1"></i>
            Xác Nhận Hủy Đơn
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
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

const reasonPresets = [
  "Khách gọi hotline báo bận hủy bàn",
  "Khách đổi kế hoạch đột xuất",
  "Khách đặt trùng đơn",
  "Không liên lạc được với khách",
];

const reason = ref("Khách gọi hotline báo bận hủy bàn");

const handleSubmit = () => {
  if (!reason.value.trim()) {
    toast.error("Vui lòng nhập lý do hủy đơn");
    return;
  }
  emit("submit", {
    reservationId: props.reservation._id,
    reason: reason.value.trim(),
  });
};
</script>

<style scoped>
.brand-font {
  font-family: 'Playfair Display', Georgia, serif;
}
.shadow-2xs {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.fs-8 {
  font-size: 0.78rem;
}
</style>
