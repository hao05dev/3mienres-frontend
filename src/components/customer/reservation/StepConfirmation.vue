<template>
  <div class="wizard-panel">
    <h4 class="fw-bold text-danger brand-font mb-4 d-flex align-items-center gap-2">
      <i class="fa-solid fa-clipboard-check"></i>
      {{ isEnglish ? 'Step 4: Review Booking & Special Requests' : 'Bước 4: Xem Lại & Hoàn Tất Đơn Đặt Bàn' }}
    </h4>

    <div class="row g-4 mb-4">
      <!-- Left: Summary Info & Voucher & Notes -->
      <div class="col-lg-7">
        <div class="p-4 bg-light rounded-4 border mb-3">
          <h6 class="fw-bold text-dark mb-3">
            <i class="fa-solid fa-circle-info text-danger me-2"></i>{{ isEnglish ? 'Reservation Overview' : 'Tóm Tắt Đơn Đặt Bàn' }}
          </h6>

          <div class="row g-2 mb-2">
            <div class="col-sm-6">
              <div class="p-2.5 bg-white rounded-3 border">
                <small class="text-muted d-block fs-8">{{ isEnglish ? 'Customer Name' : 'Tên người đặt' }}</small>
                <strong class="text-dark fs-7">{{ form.customerName }}</strong>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="p-2.5 bg-white rounded-3 border">
                <small class="text-muted d-block fs-8">{{ isEnglish ? 'Phone Number' : 'Số điện thoại' }}</small>
                <strong class="text-dark fs-7">{{ form.customerPhone }}</strong>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="p-2.5 bg-white rounded-3 border">
                <small class="text-muted d-block fs-8">{{ isEnglish ? 'Dining Time' : 'Thời gian dùng bữa' }}</small>
                <strong class="text-dark fs-7">{{ form.startAt ? new Date(form.startAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : '---' }}</strong>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="p-2.5 bg-white rounded-3 border">
                <small class="text-muted d-block fs-8">{{ isEnglish ? 'Guests' : 'Số khách' }}</small>
                <strong class="text-dark fs-7">{{ form.guestsCount }} {{ isEnglish ? 'pax' : 'người' }}</strong>
              </div>
            </div>
            <div class="col-12" v-if="selectedTables.length > 0">
              <div class="p-2.5 bg-white rounded-3 border">
                <small class="text-muted d-block fs-8">{{ isEnglish ? 'Assigned Tables' : 'Bàn đã chọn' }}</small>
                <strong class="text-danger fs-7">{{ selectedTables.map(t => 'Bàn ' + t.tableNumber).join(' + ') }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Special Request / Notes -->
        <div class="mb-3">
          <label class="form-label fw-semibold fs-7 text-dark">
            <i class="fa-solid fa-comment-dots text-danger me-1"></i>
            {{ isEnglish ? 'Special Request / Notes' : 'Ghi chú đặc biệt (Trang trí tiệc, ghế trẻ em, dị ứng...)' }}
          </label>
          <textarea
            v-model="form.notes"
            rows="2"
            class="form-control fs-7 rounded-3"
            :placeholder="isEnglish ? 'E.g: Birthday decor, baby chair, window seat...' : 'Ví dụ: Cần ghế trẻ em, trang trí sinh nhật, bàn gần cửa sổ...'"
          ></textarea>
        </div>
      </div>

      <!-- Right: Deposit Breakdown Box & Voucher Box -->
      <div class="col-lg-5">
        <div class="p-4 rounded-4 border bg-white shadow-sm h-100 d-flex flex-column justify-content-between">
          <div>
            <h6 class="fw-bold text-danger mb-3 pb-2 border-bottom d-flex align-items-center gap-2">
              <i class="fa-solid fa-shield-halved"></i>
              {{ isEnglish ? 'Deposit Payment Calculation' : 'Tính Toán Tiền Cọc Giữ Bàn' }}
            </h6>

            <!-- Khối Nhập Mã Giảm Giá / Voucher -->
            <div class="p-3 bg-light rounded-4 border mb-3">
              <label class="form-label fw-semibold fs-8 text-dark mb-1.5 d-flex align-items-center justify-content-between">
                <span><i class="fa-solid fa-ticket text-danger me-1"></i>{{ isEnglish ? 'Voucher / Coupon Code' : 'Mã Giảm Giá & Ưu Đãi' }}</span>
                <span v-if="appliedVoucher" class="badge bg-success rounded-pill px-2 py-0.5 fs-9">
                  <i class="fa-solid fa-check me-1"></i>{{ isEnglish ? 'Applied' : 'Đã áp dụng' }}
                </span>
              </label>

              <div v-if="!appliedVoucher" class="input-group input-group-sm">
                <input
                  v-model="voucherInput"
                  type="text"
                  class="form-control text-uppercase fw-bold fs-8"
                  :placeholder="isEnglish ? 'Enter promo code (e.g. TRIAN2THANG9)' : 'Nhập mã (VD: TRIAN2THANG9)'"
                  :disabled="checkingVoucher"
                  @keyup.enter="handleApplyVoucher"
                />
                <button
                  type="button"
                  class="btn btn-danger fw-bold px-3"
                  :disabled="!voucherInput.trim() || checkingVoucher"
                  @click="handleApplyVoucher"
                >
                  <span v-if="checkingVoucher" class="spinner-border spinner-border-sm me-1"></span>
                  <span v-else>{{ isEnglish ? 'Apply' : 'Áp Dụng' }}</span>
                </button>
              </div>

              <!-- Thẻ Voucher Đã Áp Dụng -->
              <div v-else class="d-flex justify-content-between align-items-center p-2 bg-success bg-opacity-10 border border-success rounded-3">
                <div>
                  <strong class="text-success fs-8 d-block">{{ appliedVoucher.title }}</strong>
                  <small class="text-muted fs-9">Mã: <strong>{{ appliedVoucher.code }}</strong> · Giảm {{ (voucherDiscount || 0).toLocaleString('vi-VN') }}đ</small>
                </div>
                <button
                  type="button"
                  @click="handleRemoveVoucher"
                  class="btn btn-sm btn-outline-danger rounded-circle p-1"
                  style="width: 26px; height: 26px; line-height: 1;"
                  title="Hủy mã"
                >
                  <i class="fa-solid fa-xmark fs-9"></i>
                </button>
              </div>

              <small v-if="voucherError" class="text-danger fs-9 d-block mt-1">
                <i class="fa-solid fa-circle-exclamation me-1"></i>{{ voucherError }}
              </small>
            </div>

            <!-- Breakdown chi tiết tiền -->
            <div class="space-y-2 mb-3">
              <div class="d-flex justify-content-between fs-8 text-muted py-1">
                <span>{{ isEnglish ? 'Table deposit base:' : 'Tiền cọc giữ bàn:' }}</span>
                <span class="text-dark fw-semibold">{{ baseDeposit.toLocaleString('vi-VN') }}đ</span>
              </div>
              <div v-if="preOrderTotal > 0" class="d-flex justify-content-between fs-8 text-muted py-1">
                <span>{{ isEnglish ? 'Pre-order deposit (50%):' : 'Cọc món ăn trước (50%):' }}</span>
                <span class="text-dark fw-semibold">{{ (preOrderTotal * 0.5).toLocaleString('vi-VN') }}đ</span>
              </div>
              <div v-if="voucherDiscount > 0" class="d-flex justify-content-between fs-8 text-success py-1 fw-bold">
                <span><i class="fa-solid fa-tag me-1"></i>{{ isEnglish ? 'Discount voucher:' : 'Mã giảm giá (' + (appliedVoucher?.code || '') + '):' }}</span>
                <span>-{{ voucherDiscount.toLocaleString('vi-VN') }}đ</span>
              </div>
              <div class="d-flex justify-content-between fs-8 text-muted py-1 border-top pt-2">
                <span class="fw-bold text-dark">{{ isEnglish ? 'Total deposit required:' : 'Tổng tiền cọc VietQR:' }}</span>
                <strong class="text-danger fs-6">{{ finalDeposit.toLocaleString('vi-VN') }}đ</strong>
              </div>
            </div>

            <div class="alert alert-info rounded-3 p-2.5 small mb-0 fs-8">
              <i class="fa-solid fa-circle-info me-1"></i>
              {{ isEnglish ? 'Deposit will be 100% deducted from your final bill during checkout.' : 'Tiền cọc sẽ được cấn trừ 100% vào hóa đơn thanh toán khi bạn dùng bữa xong tại nhà hàng.' }}
            </div>
          </div>

          <div v-if="error" class="alert alert-danger py-2 px-3 rounded-3 small mt-3 mb-0">
            <i class="fa-solid fa-circle-exclamation me-1"></i>{{ error }}
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="d-flex justify-content-between align-items-center pt-3 border-top">
      <button type="button" @click="$emit('back')" class="btn btn-outline-secondary rounded-pill px-4 fw-bold">
        <i class="fa-solid fa-arrow-left me-2"></i> {{ isEnglish ? 'Back' : 'Quay Lại' }}
      </button>

      <button
        type="button"
        @click="handleSubmit"
        :disabled="loading"
        class="btn btn-danger btn-lg rounded-pill px-5 fw-bold shadow-sm"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        <i v-else class="fa-solid fa-calendar-check me-2"></i>
        {{ isEnglish ? 'Confirm Booking Now' : 'Xác Nhận & Đặt Bàn Ngay' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import api from "../../../services/api";

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
  tables: {
    type: Array,
    default: () => [],
  },
  preOrders: {
    type: Object,
    default: () => ({}),
  },
  dishes: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
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

const emit = defineEmits(["back", "submit", "apply-voucher"]);

const voucherInput = ref("");
const appliedVoucher = ref(null);
const voucherDiscount = ref(0);
const voucherError = ref("");
const checkingVoucher = ref(false);

const selectedTables = computed(() => {
  const ids = new Set(props.form.tableIds || []);
  return props.tables.filter((t) => ids.has(t._id));
});

const preOrderTotal = computed(() => {
  let total = 0;
  for (const [dishId, qty] of Object.entries(props.preOrders)) {
    if (qty > 0) {
      const dish = props.dishes.find((d) => d._id === dishId);
      if (dish) total += dish.price * qty;
    }
  }
  return total;
});

const baseDeposit = computed(() => {
  return props.form.guestsCount >= 4 || preOrderTotal.value > 0 ? 100000 : 0;
});

const totalDepositRaw = computed(() => {
  return Math.round(preOrderTotal.value * 0.5) + baseDeposit.value;
});

const finalDeposit = computed(() => {
  return Math.max(0, totalDepositRaw.value - voucherDiscount.value);
});

const handleApplyVoucher = async () => {
  const code = voucherInput.value.trim().toUpperCase();
  if (!code) return;

  voucherError.value = "";
  checkingVoucher.value = true;
  try {
    const orderValue = preOrderTotal.value > 0 ? preOrderTotal.value : totalDepositRaw.value;
    const res = await api.post("/vouchers/validate", {
      code,
      orderValue,
    });
    appliedVoucher.value = res.data.data.voucher;
    voucherDiscount.value = res.data.data.discount || 0;
    emit("apply-voucher", {
      voucherCode: appliedVoucher.value.code,
      voucherDiscount: voucherDiscount.value,
    });
  } catch (err) {
    voucherError.value = err.response?.data?.message || (props.isEnglish ? "Invalid promo code" : "Mã giảm giá không hợp lệ hoặc đã hết hạn");
  } finally {
    checkingVoucher.value = false;
  }
};

const handleRemoveVoucher = () => {
  appliedVoucher.value = null;
  voucherDiscount.value = 0;
  voucherError.value = "";
  voucherInput.value = "";
  emit("apply-voucher", {
    voucherCode: null,
    voucherDiscount: 0,
  });
};

const handleSubmit = () => {
  emit("submit", {
    voucherCode: appliedVoucher.value?.code || null,
    voucherDiscount: voucherDiscount.value,
  });
};
</script>

<style scoped>
.space-y-2 > * + * {
  margin-top: 0.5rem;
}
</style>
