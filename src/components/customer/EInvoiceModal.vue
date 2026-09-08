<template>
  <div class="modal d-block bg-dark bg-opacity-60" tabindex="-1" @click.self="$emit('close')">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-5 border-0 shadow-lg overflow-hidden">
        <!-- Modal Header -->
        <div class="modal-header bg-danger text-white border-0 px-4 py-3">
          <div class="d-flex align-items-center gap-2">
            <div class="p-2 bg-white bg-opacity-20 rounded-3">
              <i class="fa-solid fa-receipt fs-5"></i>
            </div>
            <div>
              <h5 class="modal-title fw-bold brand-font mb-0">
                Hóa Đơn Điện Tử (E-Receipt)
              </h5>
              <small class="text-white-50 fs-9">Mã: {{ invoice.invoiceCode }}</small>
            </div>
          </div>
          <button @click="$emit('close')" type="button" class="btn-close btn-close-white" aria-label="Close"></button>
        </div>

        <!-- Modal Body (Printable Area) -->
        <div class="modal-body p-4 bg-light bg-opacity-50 printable-invoice">
          <!-- Receipt Header / Branding -->
          <div class="text-center pb-3 mb-3 border-bottom border-2 border-dashed">
            <h4 class="fw-bold brand-font text-danger mb-1">NHÀ HÀNG 3 MIỀN CUA</h4>
            <p class="text-muted small mb-1">Ẩm Thực Đặc Sản 3 Miền Bắc - Trung - Nam</p>
            <p class="text-muted fs-9 mb-0">Hotline: 0988.123.456 · Đ/C: 123 Đường 30 Tháng 4, Q. Ninh Kiều, Cần Thơ</p>
          </div>

          <!-- Invoice Metadata -->
          <div class="row g-2 mb-3 small bg-white p-3 rounded-4 border">
            <div class="col-sm-6">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted">Số Hóa Đơn:</span>
                <strong class="text-dark">{{ invoice.invoiceCode }}</strong>
              </div>
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted">Bàn Ăn:</span>
                <strong class="text-danger">
                  {{ tableNumbers }}
                </strong>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Thời Gian Vào:</span>
                <span class="text-secondary">
                  {{ invoice.diningSession?.checkInTime ? new Date(invoice.diningSession.checkInTime).toLocaleString('vi-VN') : '---' }}
                </span>
              </div>
            </div>

            <div class="col-sm-6">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted">Ngày Thanh Toán:</span>
                <strong class="text-dark">
                  {{ invoice.paidAt ? new Date(invoice.paidAt).toLocaleString('vi-VN') : new Date(invoice.createdAt).toLocaleString('vi-VN') }}
                </strong>
              </div>
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted">Hình Thức:</span>
                <span class="badge bg-danger bg-opacity-10 text-danger rounded-pill px-2.5 py-0.5 fw-bold fs-9">
                  {{ paymentMethodLabel(invoice.paymentMethod) }}
                </span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Thu Ngân:</span>
                <span class="text-dark fw-semibold">{{ invoice.cashier?.name || 'Quầy Thu Ngân' }}</span>
              </div>
            </div>
          </div>

          <!-- Dishes Ordered Table -->
          <div class="card border-0 rounded-4 overflow-hidden mb-3 shadow-2xs">
            <div class="table-responsive">
              <table class="table table-sm table-striped align-middle mb-0" style="font-size: 0.82rem;">
                <thead class="table-danger text-dark fw-bold">
                  <tr>
                    <th style="width: 40px;" class="text-center">#</th>
                    <th>Món Ăn</th>
                    <th style="width: 60px;" class="text-center">SL</th>
                    <th style="width: 100px;" class="text-end">Đơn Giá</th>
                    <th style="width: 110px;" class="text-end">Thành Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in allDishItems" :key="idx">
                    <td class="text-center text-muted fs-9">{{ idx + 1 }}</td>
                    <td>
                      <strong class="text-dark">{{ item.dishName }}</strong>
                    </td>
                    <td class="text-center">
                      <span class="badge bg-secondary bg-opacity-10 text-dark rounded-pill px-2 py-0.5 fw-bold fs-9">
                        {{ item.quantity }}
                      </span>
                    </td>
                    <td class="text-end text-muted">{{ item.price.toLocaleString('vi-VN') }}đ</td>
                    <td class="text-end fw-bold text-dark">{{ (item.price * item.quantity).toLocaleString('vi-VN') }}đ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Total Calculation Summary -->
          <div class="bg-white p-3 rounded-4 border">
            <div class="d-flex justify-content-between small mb-1.5">
              <span class="text-muted">Tổng Tạm Tính:</span>
              <strong class="text-dark">{{ (invoice.subtotal || 0).toLocaleString('vi-VN') }}đ</strong>
            </div>

            <div v-if="invoice.discountAmount > 0" class="d-flex justify-content-between small text-success mb-1.5">
              <span>
                <i class="fa-solid fa-tag me-1"></i>Chiết Khấu / Giảm Giá
                <span v-if="invoice.voucherCode" class="badge bg-success bg-opacity-15 text-success ms-1">
                  {{ invoice.voucherCode }}
                </span>:
              </span>
              <strong>-{{ (invoice.discountAmount || 0).toLocaleString('vi-VN') }}đ</strong>
            </div>

            <div v-if="invoice.taxAmount > 0" class="d-flex justify-content-between small text-muted mb-1.5">
              <span>Thuế VAT ({{ invoice.taxPercent || 8 }}%):</span>
              <span>+{{ (invoice.taxAmount || 0).toLocaleString('vi-VN') }}đ</span>
            </div>

            <div v-if="invoice.depositDeducted > 0" class="d-flex justify-content-between small text-primary mb-1.5">
              <span><i class="fa-solid fa-money-bill-transfer me-1"></i>Đã Trừ Tiền Cọc:</span>
              <strong>-{{ (invoice.depositDeducted || 0).toLocaleString('vi-VN') }}đ</strong>
            </div>

            <div class="d-flex justify-content-between align-items-center pt-2 border-top border-2 mt-2">
              <div>
                <strong class="fs-6 text-dark d-block">TỔNG TIỀN THANH TOÁN:</strong>
                <small class="text-success fw-semibold fs-9">
                  <i class="fa-solid fa-circle-check me-1"></i>Đã hoàn tất thanh toán
                </small>
              </div>
              <span class="display-6 fw-bold text-danger brand-font" style="font-size: 1.45rem;">
                {{ (invoice.finalAmount || 0).toLocaleString('vi-VN') }}đ
              </span>
            </div>
          </div>

          <!-- Footer Thank You Note -->
          <div class="text-center pt-3 mt-3 border-top border-dashed">
            <p class="fst-italic text-muted small mb-0">
              🦀 Cảm ơn Quý khách đã thưởng thức ẩm thực tại Nhà Hàng 3 Miền Cua! Hẹn gặp lại Quý khách!
            </p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer bg-white border-0 px-4 py-3 d-flex justify-content-between">
          <button @click="$emit('close')" type="button" class="btn btn-light rounded-pill px-4 fw-semibold border">
            Đóng
          </button>
          <div class="d-flex gap-2">
            <button @click="printReceipt" type="button" class="btn btn-outline-danger rounded-pill px-4 fw-bold">
              <i class="fa-solid fa-print me-1.5"></i> In Hóa Đơn
            </button>
            <router-link to="/dat-ban" class="btn btn-danger rounded-pill px-4 fw-bold shadow-sm">
              <i class="fa-solid fa-calendar-plus me-1.5"></i> Đặt Bàn Lại
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  invoice: {
    type: Object,
    required: true,
  },
});

defineEmits(["close"]);

const tableNumbers = computed(() => {
  const tables = props.invoice?.diningSession?.tables || [];
  return (
    tables
      .filter(Boolean)
      .map((t) => t.tableNumber || t)
      .join(" + ") || "Bàn ăn"
  );
});

const allDishItems = computed(() => {
  const items = [];
  const orders = props.invoice?.orders || [];
  orders.forEach((ord) => {
    (ord.items || []).forEach((it) => {
      items.push({
        dishName: it.dish?.name || it.name || "Món ăn",
        quantity: it.quantity || 1,
        price: it.dish?.price || it.price || 0,
      });
    });
  });
  return items;
});

const paymentMethodLabel = (method) => {
  switch (method) {
    case "CASH": return "Tiền mặt";
    case "BANK_TRANSFER": return "Chuyển khoản VietQR";
    case "CARD": return "Quẹt thẻ POS";
    case "MOMO": return "Ví MoMo";
    case "VNPAY": return "VNPay QR";
    default: return method || "Tiền mặt";
  }
};

const printReceipt = () => {
  window.print();
};
</script>

<style scoped>
.shadow-2xs {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
@media print {
  body * {
    visibility: hidden;
  }
  .printable-invoice,
  .printable-invoice * {
    visibility: visible;
  }
  .printable-invoice {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: #fff !important;
  }
}
</style>
