<template>
  <div class="modal d-block bg-dark bg-opacity-50" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-5 p-3 shadow-lg">
        <div class="modal-header border-0">
          <h5 class="modal-title fw-bold brand-font text-danger">
            <i class="fa-solid fa-pen-to-square me-2"></i>Cập Nhật Món Ăn
          </h5>
          <button @click="$emit('close')" type="button" class="btn-close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label fw-semibold">Tên món ăn <span class="text-danger">*</span></label>
            <input v-model="form.name" type="text" class="form-control" placeholder="Ví dụ: Cua Sốt Trứng Muối" required />
          </div>

          <div class="row g-3 mb-3">
            <div class="col-6">
              <label class="form-label fw-semibold">Vùng miền <span class="text-danger">*</span></label>
              <select v-model="form.region" class="form-select" required>
                <option value="Bắc">Miền Bắc</option>
                <option value="Trung">Miền Trung</option>
                <option value="Nam">Miền Nam</option>
              </select>
            </div>
            <div class="col-6">
              <label class="form-label fw-semibold">Danh mục <span class="text-danger">*</span></label>
              <select v-model="form.category" class="form-select" required>
                <option value="" disabled>-- Chọn danh mục --</option>
                <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Giá bán (VNĐ) <span class="text-danger">*</span></label>
            <input v-model.number="form.price" type="number" min="0" step="1000" class="form-control" required />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Mô tả món ăn</label>
            <textarea v-model="form.description" class="form-control" rows="2" placeholder="Hương vị, nguyên liệu đặc trưng..."></textarea>
          </div>

          <div class="d-flex gap-4 p-3 bg-light rounded-4 mb-2">
            <div class="form-check form-switch">
              <input v-model="form.availability" class="form-check-input" type="checkbox" id="availSwitch" />
              <label class="form-check-label fw-semibold fs-8" for="availSwitch">
                {{ form.availability ? '✅ Còn hàng' : '❌ Hết hàng' }}
              </label>
            </div>
            <div class="form-check form-switch">
              <input v-model="form.isFeatured" class="form-check-input" type="checkbox" id="featSwitch" />
              <label class="form-check-label fw-semibold fs-8" for="featSwitch">
                ⭐ Món đặc sản nổi bật
              </label>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger small rounded-3 mt-3 mb-0">{{ error }}</div>
        </div>

        <div class="modal-footer border-0">
          <button @click="$emit('close')" class="btn btn-light rounded-pill px-4">Hủy</button>
          <button @click="$emit('submit', form)" class="btn btn-danger rounded-pill px-4 fw-bold shadow-sm">
            <i class="fa-solid fa-floppy-disk me-1"></i> Lưu Cập Nhật
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const props = defineProps({
  dish: {
    type: Object,
    required: true,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  error: {
    type: String,
    default: "",
  },
});

defineEmits(["close", "submit"]);

const findCategoryId = () => {
  if (!props.dish.category) return props.categories[0]?._id || "";
  if (typeof props.dish.category === "object" && props.dish.category?._id) {
    return props.dish.category._id;
  }
  const matched = props.categories.find(
    (c) => c._id === props.dish.category || c.name === props.dish.category
  );
  return matched ? matched._id : props.dish.category;
};

const form = reactive({
  name: props.dish.name || "",
  region: props.dish.region || "Nam",
  category: findCategoryId(),
  price: props.dish.price || 0,
  description: props.dish.description || "",
  availability: props.dish.availability !== false,
  isFeatured: Boolean(props.dish.isFeatured),
});
</script>
