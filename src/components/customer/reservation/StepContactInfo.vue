<template>
  <div class="wizard-panel">
    <h4 class="fw-bold text-danger brand-font mb-4 d-flex align-items-center gap-2">
      <i class="fa-solid fa-address-card"></i>
      {{ isEnglish ? 'Step 1: Customer Contact & Booking Type' : 'Bước 1: Thông Tin & Loại Hình Đặt Bàn' }}
    </h4>

    <!-- ═══ 1. LỰA CHỌN LOẠI HÌNH ĐẶT BÀN (BOOKING TYPE) ═══ -->
    <div class="mb-4">
      <label class="form-label fw-bold fs-7 text-dark mb-2">
        <i class="fa-solid fa-champagne-glasses text-danger me-1"></i>
        {{ isEnglish ? 'Select Booking Type' : 'Chọn Loại Hình Dùng Bữa / Đặt Tiệc' }} <span class="text-danger">*</span>
      </label>

      <div class="row g-3">
        <!-- Option 1: Dùng bữa thông thường -->
        <div class="col-md-6">
          <div
            @click="selectBookingType('NORMAL')"
            :class="[
              'p-3 rounded-4 border-2 cursor-pointer transition-all h-100',
              form.type === 'NORMAL' ? 'border-danger bg-danger bg-opacity-10 shadow-sm' : 'border bg-white hover-shadow'
            ]"
          >
            <div class="d-flex align-items-center justify-content-between mb-1">
              <div class="d-flex align-items-center gap-2">
                <i class="fa-solid fa-utensils text-danger fs-5"></i>
                <strong class="text-dark fs-7">
                  {{ isEnglish ? 'Standard Dining' : 'Dùng Bữa Thông Thường' }}
                </strong>
              </div>
              <span class="badge bg-danger rounded-pill fs-9" v-if="form.type === 'NORMAL'">
                <i class="fa-solid fa-check"></i>
              </span>
            </div>
            <p class="text-muted fs-8 mb-1">
              {{ isEnglish ? 'For family meals, friend gatherings, lunch & dinner.' : 'Phù hợp cho bữa ăn gia đình, bạn bè, ăn trưa hoặc ăn tối thường nhật.' }}
            </p>
            <span class="badge bg-white text-danger border border-danger rounded-pill px-2.5 py-0.5 fs-9 fw-semibold">
              <i class="fa-regular fa-clock me-1"></i>Thời lượng tiêu chuẩn: 120 phút (2 giờ)
            </span>
          </div>
        </div>

        <!-- Option 2: Đặt tiệc & Sự kiện -->
        <div class="col-md-6">
          <div
            @click="selectBookingType('EVENT')"
            :class="[
              'p-3 rounded-4 border-2 cursor-pointer transition-all h-100',
              form.type === 'EVENT' ? 'border-danger bg-danger bg-opacity-10 shadow-sm' : 'border bg-white hover-shadow'
            ]"
          >
            <div class="d-flex align-items-center justify-content-between mb-1">
              <div class="d-flex align-items-center gap-2">
                <i class="fa-solid fa-cake-candles text-danger fs-5"></i>
                <strong class="text-dark fs-7">
                  {{ isEnglish ? 'Party & Event Booking' : 'Đặt Tiệc & Sự Kiện' }}
                </strong>
              </div>
              <span class="badge bg-danger rounded-pill fs-9" v-if="form.type === 'EVENT'">
                <i class="fa-solid fa-check"></i>
              </span>
            </div>
            <p class="text-muted fs-8 mb-1">
              {{ isEnglish ? 'Birthday, anniversary, company year-end, meetings.' : 'Tiệc sinh nhật, thôi nôi, liên hoan công ty, hội nghị, tất niên...' }}
            </p>
            <span class="badge bg-warning text-dark rounded-pill px-2.5 py-0.5 fs-9 fw-bold">
              <i class="fa-solid fa-sparkles me-1"></i>Thời lượng mở rộng: 3 – 8 tiếng
            </span>
          </div>
        </div>
      </div>

      <!-- Thời lượng tùy chỉnh cho Sự kiện -->
      <div v-if="form.type === 'EVENT'" class="p-3 bg-light rounded-4 border mt-3 animate-fade">
        <label class="form-label fw-semibold fs-8 text-dark mb-1.5 d-flex align-items-center justify-content-between">
          <span><i class="fa-regular fa-hourglass-half text-danger me-1"></i>{{ isEnglish ? 'Expected Event Duration:' : 'Thời Lượng Dự Kiến Diễn Ra Tiệc:' }}</span>
          <span class="text-danger fw-bold fs-8">{{ form.durationMinutes / 60 }} giờ ({{ form.durationMinutes }} phút)</span>
        </label>
        <div class="d-flex flex-wrap gap-2">
          <button
            v-for="d in durationOptions"
            :key="d.minutes"
            type="button"
            @click="form.durationMinutes = d.minutes"
            :class="[
              'btn btn-sm rounded-pill px-3 fs-8 fw-semibold transition-all',
              form.durationMinutes === d.minutes ? 'btn-danger shadow-sm' : 'btn-white border text-dark'
            ]"
          >
            {{ d.label }}
          </button>
        </div>
        <small class="text-muted fs-9 d-block mt-1.5">
          <i class="fa-solid fa-circle-info text-primary me-1"></i>Hệ thống sẽ giữ bàn và chuẩn bị không gian chu đáo xuyên suốt toàn bộ thời lượng sự kiện của bạn.
        </small>
      </div>
    </div>

    <!-- ═══ 2. THÔNG TIN LIÊN HỆ NGƯỜI ĐẶT BÀN ═══ -->
    <div class="row g-4 mb-4">
      <div class="col-md-6">
        <label class="form-label fw-semibold fs-7 text-dark">
          {{ isEnglish ? 'Full Name' : 'Họ và tên người đặt' }} <span class="text-danger">*</span>
        </label>
        <div class="form-control-icon">
          <input
            v-model="form.customerName"
            type="text"
            class="form-control py-3 fs-7"
            placeholder="Ví dụ: Nguyễn Văn A"
            required
          />
          <i class="fa-solid fa-user"></i>
        </div>
      </div>

      <div class="col-md-6">
        <label class="form-label fw-semibold fs-7 text-dark">
          {{ isEnglish ? 'Phone Number' : 'Số điện thoại liên hệ' }} <span class="text-danger">*</span>
        </label>
        <div class="form-control-icon">
          <input
            v-model="form.customerPhone"
            type="tel"
            class="form-control py-3 fs-7"
            placeholder="Ví dụ: 0988776655"
            required
          />
          <i class="fa-solid fa-phone"></i>
        </div>
      </div>

      <div class="col-md-6">
        <label class="form-label fw-semibold fs-7 text-dark">
          {{ isEnglish ? 'Number of Guests' : 'Số lượng khách (Số người)' }} <span class="text-danger">*</span>
        </label>
        <div class="input-group">
          <button
            type="button"
            class="btn btn-outline-secondary px-3 py-2.5"
            @click="form.guestsCount > 1 ? form.guestsCount-- : null"
          >
            <i class="fa-solid fa-minus"></i>
          </button>
          <input
            v-model.number="form.guestsCount"
            type="number"
            min="1"
            max="100"
            class="form-control text-center fw-bold fs-6 py-2.5"
            placeholder="Số người"
            required
          />
          <button
            type="button"
            class="btn btn-outline-secondary px-3 py-2.5"
            @click="form.guestsCount++"
          >
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
        <small class="text-muted fs-8 mt-1 d-block">
          {{ isEnglish ? 'Specify how many guests will dine at the restaurant.' : 'Nhập chính xác số người để nhà hàng chuẩn bị không gian chu đáo.' }}
        </small>
      </div>

      <div class="col-md-6">
        <label class="form-label fw-semibold fs-7 text-dark">
          {{ isEnglish ? 'Email (Optional)' : 'Địa chỉ Email (Nhận mã vé đặt bàn)' }}
        </label>
        <div class="form-control-icon">
          <input
            v-model="form.customerEmail"
            type="email"
            class="form-control py-3 fs-7"
            placeholder="email@example.com"
          />
          <i class="fa-solid fa-envelope"></i>
        </div>
        <small class="text-muted fs-8 mt-1 d-block">
          {{ isEnglish ? 'Used to receive booking confirmation card.' : 'Dùng để gửi thẻ vé check-in và hóa đơn điện tử.' }}
        </small>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger py-2 px-3 rounded-3 small mb-4">
      <i class="fa-solid fa-circle-exclamation me-1"></i>{{ error }}
    </div>

    <div class="d-flex justify-content-end pt-3">
      <button type="button" @click="$emit('next')" class="btn btn-danger btn-lg rounded-pill px-5 fw-bold shadow-sm">
        {{ isEnglish ? 'Next: Select Table' : 'Tiếp Theo: Chọn Thời Gian & Bàn' }}
        <i class="fa-solid fa-arrow-right ms-2"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  error: {
    type: String,
    default: "",
  },
  isEnglish: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["next"]);

const durationOptions = [
  { label: "3 tiếng (180 phút)", minutes: 180 },
  { label: "4 tiếng (240 phút)", minutes: 240 },
  { label: "5 tiếng (300 phút)", minutes: 300 },
  { label: "Cả ngày (8 tiếng - 480 phút)", minutes: 480 },
];

const selectBookingType = (type) => {
  props.form.type = type;
  if (type === "EVENT" && (!props.form.durationMinutes || props.form.durationMinutes === 120)) {
    props.form.durationMinutes = 240; // Default 4 hours for events
  } else if (type === "NORMAL") {
    props.form.durationMinutes = 120; // Default 2 hours for normal dining
  }
};
</script>

<style scoped>
.form-control-icon {
  position: relative;
}
.form-control-icon i {
  position: absolute;
  top: 50%;
  right: 1.25rem;
  transform: translateY(-50%);
  color: #a0aec0;
}
.cursor-pointer {
  cursor: pointer;
}
.hover-shadow:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: #fca5a5 !important;
}
.transition-all {
  transition: all 0.2s ease;
}
.btn-white {
  background: #ffffff;
}
</style>
