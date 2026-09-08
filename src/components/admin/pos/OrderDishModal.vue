<template>
  <div class="modal d-block bg-dark bg-opacity-50" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content rounded-5 p-3 shadow-lg">
        <div class="modal-header border-0 pb-2">
          <div>
            <h5 class="modal-title fw-bold brand-font text-danger mb-0">
              <i class="fa-solid fa-utensils me-2"></i>Gọi Món Cho Bàn {{ tableNumbers }}
            </h5>
            <small class="text-muted">Mã phiên: {{ session.sessionCode }} · Khách: {{ session.customerName || 'Khách tại quán' }}</small>
          </div>
          <button @click="$emit('close')" type="button" class="btn-close"></button>
        </div>
        <div class="modal-body pt-1">
          <div class="row g-3">
            <!-- Cột trái: Danh sách món & Tìm kiếm nhanh -->
            <div class="col-md-7">
              <div class="p-3 bg-light rounded-4 border h-100 d-flex flex-column">
                <!-- Search & Filter Bar -->
                <div class="mb-2.5">
                  <div class="input-group input-group-sm">
                    <span class="input-group-text bg-white border-end-0"><i class="fa-solid fa-magnifying-glass text-muted"></i></span>
                    <input
                      v-model="searchQuery"
                      type="text"
                      class="form-control border-start-0 ps-0"
                      placeholder="Tìm kiếm tên món ăn, lẩu, nước..."
                    />
                    <button v-if="searchQuery" @click="searchQuery = ''" class="btn btn-outline-secondary" type="button">✕</button>
                  </div>
                </div>

                <div class="d-flex align-items-center gap-1 mb-2 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    @click="activeStationFilter = 'ALL'"
                    :class="['btn btn-xs rounded-pill px-2.5 py-1 fw-semibold text-nowrap', activeStationFilter === 'ALL' ? 'btn-danger' : 'btn-white border text-dark']"
                  >
                    Tất cả
                  </button>
                  <button
                    @click="activeStationFilter = 'KITCHEN'"
                    :class="['btn btn-xs rounded-pill px-2.5 py-1 fw-semibold text-nowrap', activeStationFilter === 'KITCHEN' ? 'btn-danger' : 'btn-white border text-dark']"
                  >
                    🍳 Món Bếp
                  </button>
                  <button
                    @click="activeStationFilter = 'BAR'"
                    :class="['btn btn-xs rounded-pill px-2.5 py-1 fw-semibold text-nowrap', activeStationFilter === 'BAR' ? 'btn-danger' : 'btn-white border text-dark']"
                  >
                    🍹 Đồ Uống / Bar
                  </button>
                </div>

                <div class="pos-dish-scroll pe-1 flex-grow-1" style="max-height: 380px;">
                  <VueDraggable
                    v-model="filteredDishes"
                    :group="{ name: 'order', pull: 'clone', put: false }"
                    :sort="false"
                    :clone="cloneDishToOrder"
                    :animation="150"
                    :filter="'.no-drag'"
                    :prevent-on-filter="true"
                    class="row g-2"
                  >
                    <div v-for="dish in filteredDishes" :key="dish._id" class="col-12 col-sm-6">
                      <div class="pos-dish-card p-2 border rounded-3 bg-white d-flex justify-content-between align-items-center h-100 hover-card transition-all">
                        <div class="min-w-0 me-2">
                          <span class="badge rounded-pill px-1.5 py-0.5 fs-10 mb-0.5" :class="dish.station === 'BAR' ? 'bg-info bg-opacity-15 text-info' : 'bg-warning bg-opacity-15 text-warning'">
                            {{ dish.station === 'BAR' ? '🍹 Bar' : '🍳 Bếp' }}
                          </span>
                          <strong class="d-block text-dark text-truncate fs-8">{{ dish.name }}</strong>
                          <small class="text-danger fw-bold">{{ dish.price.toLocaleString('vi-VN') }}đ</small>
                        </div>
                        <button
                          type="button"
                          @click="addDishToOrder(dish)"
                          class="no-drag btn btn-outline-danger btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center flex-shrink-0 shadow-2xs"
                          style="width: 32px; height: 32px;"
                        >
                          <i class="fa-solid fa-plus fs-8"></i>
                        </button>
                      </div>
                    </div>
                  </VueDraggable>
                </div>
              </div>
            </div>

            <!-- Cột phải: Giỏ gọi món & Nhãn ghi chú nhanh -->
            <div class="col-md-5">
              <div class="order-basket p-3 rounded-4 h-100 d-flex flex-column border bg-light bg-opacity-50">
                <h6 class="fw-bold text-danger mb-2 d-flex align-items-center gap-2">
                  <i class="fa-solid fa-cart-shopping"></i> Món đã chọn
                  <span class="badge bg-danger rounded-pill ms-auto">{{ basket.length }}</span>
                </h6>

                <!-- Dropzone / Selected Items List -->
                <VueDraggable
                  v-model="basket"
                  group="order"
                  :animation="150"
                  class="basket-dropzone flex-grow-1 border-2 rounded-3 p-2 bg-white mb-2"
                  style="min-height: 160px; max-height: 200px; overflow-y: auto;"
                >
                  <div v-if="basket.length === 0" class="text-center text-muted small py-4">
                    <i class="fa-solid fa-hand-pointer text-danger d-block fs-4 mb-1 opacity-50"></i>
                    Kéo thả món vào đây hoặc bấm (+)
                  </div>
                  <div
                    v-for="(item, idx) in basket"
                    :key="idx"
                    class="basket-item p-2 mb-1.5 border rounded-3 bg-light d-flex justify-content-between align-items-center"
                  >
                    <div class="min-w-0 me-2">
                      <strong class="d-block text-dark text-truncate fs-8">{{ item.name }}</strong>
                      <small class="text-muted">{{ (item.price * item.quantity).toLocaleString('vi-VN') }}đ</small>
                    </div>
                    <div class="d-flex align-items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        @click="updateQty(idx, -1)"
                        class="btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                        style="width: 24px; height: 24px;"
                      >
                        -
                      </button>
                      <span class="fw-bold px-1 fs-7">{{ item.quantity }}</span>
                      <button
                        type="button"
                        @click="updateQty(idx, 1)"
                        class="btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                        style="width: 24px; height: 24px;"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </VueDraggable>

                <!-- ═══ BỘ NHÃN GHI CHÚ MÓN NHANH (QUICK MODIFIERS) ═══ -->
                <div class="p-2 bg-white rounded-3 border mb-2">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <small class="text-dark fw-bold fs-9">
                      <i class="fa-solid fa-tags text-warning me-1"></i>Nhãn Ghi Chú Nhanh Bếp / Bar:
                    </small>
                    <button v-if="orderNotes" @click="orderNotes = ''" class="btn btn-link text-muted p-0 fs-10 text-decoration-none">Xóa ghi chú</button>
                  </div>
                  <div class="d-flex flex-wrap gap-1 mb-1.5">
                    <button
                      v-for="tag in quickModifierTags"
                      :key="tag"
                      type="button"
                      @click="appendModifierTag(tag)"
                      class="btn btn-xs rounded-pill px-2 py-0.5 fs-10 btn-light border hover-tag"
                    >
                      {{ tag }}
                    </button>
                  </div>
                  <input
                    v-model="orderNotes"
                    type="text"
                    class="form-control form-control-sm fs-8 rounded-2"
                    placeholder="Ghi chú chi tiết cho Bếp / Bar..."
                  />
                </div>

                <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                  <span class="small text-muted">Tổng tiền tạm tính:</span>
                  <strong class="text-danger fs-5">{{ basketTotal.toLocaleString('vi-VN') }}đ</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer border-0 pt-2">
          <button @click="$emit('close')" class="btn btn-light rounded-pill px-4">Hủy</button>
          <button
            @click="handleSubmit"
            :disabled="basket.length === 0"
            class="btn btn-danger rounded-pill px-5 fw-bold shadow-sm"
          >
            <i class="fa-solid fa-paper-plane me-1.5"></i> Gửi Bếp ({{ basket.length }} món)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { VueDraggable } from "vue-draggable-plus";

const props = defineProps({
  session: {
    type: Object,
    required: true,
  },
  dishes: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close", "submit"]);

const searchQuery = ref("");
const activeStationFilter = ref("ALL"); // ALL | KITCHEN | BAR
const dishList = ref([...props.dishes]);
const basket = ref([]);
const orderNotes = ref("");

const quickModifierTags = [
  "+ Ít cay",
  "+ Không ớt",
  "+ Không hành",
  "+ Ít đá",
  "+ Không đường",
  "+ Ăn liền",
  "+ Mang ra sau",
  "+ Nước sôi thêm",
  "+ Đậm đà",
];

const appendModifierTag = (tag) => {
  const cleanTag = tag.replace(/^\+\s*/, "");
  if (!orderNotes.value) {
    orderNotes.value = cleanTag;
  } else if (!orderNotes.value.includes(cleanTag)) {
    orderNotes.value = orderNotes.value.trim() + ", " + cleanTag;
  }
};

const tableNumbers = computed(() => {
  const tables = props.session?.tables || [];
  return (
    tables
      .filter(Boolean)
      .map((t) => t.tableNumber || t)
      .join(" + ") || "—"
  );
});

watch(
  () => props.dishes,
  (newVal) => {
    dishList.value = [...newVal];
  },
);

const filteredDishes = computed(() => {
  return dishList.value.filter((d) => {
    const matchSearch = !searchQuery.value || d.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStation = activeStationFilter.value === "ALL" || (d.station || "KITCHEN") === activeStationFilter.value;
    return matchSearch && matchStation;
  });
});

const basketTotal = computed(() => {
  return basket.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const cloneDishToOrder = (dish) => {
  const existing = basket.value.find((b) => b.dishId === dish._id);
  if (existing) {
    existing.quantity += 1;
    return null;
  }
  return {
    dishId: dish._id,
    name: dish.name,
    price: dish.price,
    quantity: 1,
  };
};

const addDishToOrder = (dish) => {
  const existing = basket.value.find((b) => b.dishId === dish._id);
  if (existing) {
    existing.quantity += 1;
  } else {
    basket.value.push({
      dishId: dish._id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
    });
  }
};

const updateQty = (idx, delta) => {
  const item = basket.value[idx];
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    basket.value.splice(idx, 1);
  }
};

const handleSubmit = () => {
  if (basket.value.length > 0) {
    emit("submit", {
      items: basket.value,
      notes: orderNotes.value.trim() || "Nhân viên gọi món tại bàn qua POS",
    });
  }
};
</script>

<style scoped>
.pos-dish-scroll {
  overflow-y: auto;
}
.basket-dropzone {
  border-style: dashed;
}
.btn-xs {
  font-size: 0.72rem;
}
.fs-10 {
  font-size: 0.68rem;
}
.hover-card:hover {
  border-color: #fca5a5 !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
.hover-tag:hover {
  background-color: #fef2f2 !important;
  color: #dc2626 !important;
  border-color: #fca5a5 !important;
}
.transition-all {
  transition: all 0.2s ease;
}
.btn-white {
  background: #ffffff;
}
.shadow-2xs {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
</style>
