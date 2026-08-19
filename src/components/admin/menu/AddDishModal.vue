<template>
  <div class="modal d-block bg-dark bg-opacity-50" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-5 p-3 shadow-lg border-0">
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title fw-bold brand-font text-danger">
            <i class="fa-solid fa-plus-circle me-2"></i>Thêm Món Ăn Đặc Sản Mới
          </h5>
          <button @click="$emit('close')" type="button" class="btn-close"></button>
        </div>
        
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label fw-semibold fs-7 text-dark">Tên món ăn <span class="text-danger">*</span></label>
            <input v-model="form.name" type="text" class="form-control py-2 fs-7" placeholder="Ví dụ: Lẩu cá đuối hồng" required />
          </div>

          <div class="row g-3 mb-3">
            <div class="col-6">
              <label class="form-label fw-semibold fs-7 text-dark">Vùng miền <span class="text-danger">*</span></label>
              <select v-model="form.region" class="form-select py-2 fs-7" required>
                <option value="Bắc">Miền Bắc</option>
                <option value="Trung">Miền Trung</option>
                <option value="Nam">Miền Nam</option>
              </select>
            </div>
            <div class="col-6">
              <label class="form-label fw-semibold fs-7 text-dark">Danh mục món ăn <span class="text-danger">*</span></label>
              <select v-model="form.category" class="form-select py-2 fs-7" required>
                <option value="" disabled>-- Chọn danh mục --</option>
                <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold fs-7 text-dark">Giá bán (VNĐ) <span class="text-danger">*</span></label>
            <input v-model.number="form.price" type="number" min="0" step="1000" class="form-control py-2 fs-7" required />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold fs-7 text-dark">Mô tả món ăn</label>
            <textarea
              v-model="form.description"
              class="form-control fs-7"
              rows="2"
              placeholder="Hương vị, nguyên liệu đặc trưng (Tùy chọn, nếu để trống hệ thống sẽ tự sinh mô tả chuẩn)..."
            ></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold fs-7 text-dark">Đường dẫn ảnh đại diện (Tùy chọn)</label>
            <input
              v-model="form.image"
              type="text"
              class="form-control py-2 fs-7"
              placeholder="Để trống sẽ dùng ảnh mặc định, bạn có thể tải ảnh lên sau"
            />
          </div>

          <div class="p-3 bg-light rounded-4 mb-2">
            <div class="form-check form-switch">
              <input v-model="form.isFeatured" class="form-check-input" type="checkbox" id="addFeatSwitch" />
              <label class="form-check-label fw-semibold fs-8" for="addFeatSwitch">
                ⭐ Đánh dấu là Món đặc sản nổi bật (hiển thị trang chủ)
              </label>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger small rounded-3 mt-3 mb-0">{{ error }}</div>
        </div>

        <div class="modal-footer border-0 pt-0">
          <button @click="$emit('close')" class="btn btn-light rounded-pill px-4 fs-7">Hủy</button>
          <button @click="submitForm" class="btn btn-danger rounded-pill px-4 fw-bold fs-7 shadow-sm">
            <i class="fa-solid fa-plus me-1"></i> Tạo Món Ăn Mới
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "submit"]);

const form = reactive({
  name: "",
  region: "Nam",
  category: props.categories[0]?._id || "",
  price: 150000,
  description: "",
  image: "",
  isFeatured: false,
});

watch(
  () => props.categories,
  (newCats) => {
    if (newCats.length > 0 && !form.category) {
      form.category = newCats[0]._id;
    }
  },
  { immediate: true }
);

const submitForm = () => {
  emit("submit", { ...form });
};
</script>
