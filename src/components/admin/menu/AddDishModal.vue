<template>
  <div class="modal d-block bg-dark bg-opacity-50" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg-custom">
      <div class="modal-content rounded-5 p-3 p-md-4 shadow-lg border-0">
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title fw-bold brand-font text-danger fs-5">
            <i class="fa-solid fa-plus-circle me-2"></i>Thêm Món Ăn Đặc Sản Mới
          </h5>
          <button @click="$emit('close')" type="button" class="btn-close" :disabled="submitting"></button>
        </div>
        
        <div class="modal-body">
          <div class="row g-3">
            <!-- Cột trái: Thông tin món -->
            <div class="col-md-7">
              <div class="mb-3">
                <label class="form-label fw-semibold fs-7 text-dark">Tên món ăn <span class="text-danger">*</span></label>
                <input v-model="form.name" type="text" class="form-control py-2 fs-7" placeholder="Ví dụ: Lẩu cá đuối lá giang" required />
              </div>

              <div class="row g-2 mb-3">
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
                  placeholder="Hương vị, nguyên liệu đặc trưng (Tùy chọn, hệ thống tự sinh nếu để trống)..."
                ></textarea>
              </div>

              <div class="p-2.5 bg-light rounded-3 mb-0">
                <div class="form-check form-switch">
                  <input v-model="form.isFeatured" class="form-check-input" type="checkbox" id="addFeatSwitch" />
                  <label class="form-check-label fw-semibold fs-8" for="addFeatSwitch">
                    ⭐ Đánh dấu Món đặc sản nổi bật (Trang chủ)
                  </label>
                </div>
              </div>
            </div>

            <!-- Cột phải: Tải ảnh trực tiếp -->
            <div class="col-md-5">
              <label class="form-label fw-semibold fs-7 text-dark">
                <i class="fa-solid fa-image text-danger me-1"></i>Hình ảnh món ăn
              </label>
              
              <!-- Khung Upload & Preview ảnh -->
              <div class="upload-box p-3 rounded-4 border border-2 border-dashed bg-light text-center position-relative">
                <div v-if="previewUrl" class="position-relative">
                  <img :src="previewUrl" class="img-fluid rounded-3 shadow-sm object-fit-cover w-100" style="max-height: 160px;" />
                  <button
                    @click="removeSelectedImage"
                    type="button"
                    class="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-1 shadow-sm"
                    style="width: 26px; height: 26px; padding: 0;"
                    title="Xóa ảnh chọn"
                  >
                    <i class="fa-solid fa-xmark fs-9"></i>
                  </button>
                </div>

                <div v-else class="py-4">
                  <i class="fa-solid fa-cloud-arrow-up display-6 text-danger opacity-60 mb-2 d-block"></i>
                  <p class="small text-muted mb-2 fs-8">Chọn tệp hình ảnh từ máy tính (JPG, PNG, WEBP)</p>
                  <label class="btn btn-outline-danger btn-sm rounded-pill px-3 fs-8 fw-semibold cursor-pointer">
                    <i class="fa-solid fa-folder-open me-1"></i> Chọn tệp ảnh
                    <input type="file" @change="handleFileSelected" class="d-none" accept="image/*" />
                  </label>
                </div>
              </div>

              <!-- Hoặc dán link ảnh -->
              <div class="mt-2.5">
                <small class="text-muted d-block mb-1 fs-9">Hoặc nhập URL hình ảnh (nếu có):</small>
                <input
                  v-model="form.image"
                  type="text"
                  class="form-control form-control-sm fs-8"
                  placeholder="https://... hoặc /uploads/dishes/..."
                  :disabled="!!imageFile"
                />
              </div>
            </div>
          </div>

          <div v-if="displayError" class="alert alert-danger small rounded-3 mt-3 mb-0">{{ displayError }}</div>
        </div>

        <div class="modal-footer border-0 pt-2">
          <button @click="$emit('close')" class="btn btn-light rounded-pill px-4 fs-7" :disabled="submitting">Hủy</button>
          <button @click="submitForm" class="btn btn-danger rounded-pill px-4 fw-bold fs-7 shadow-sm" :disabled="submitting">
            <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="fa-solid fa-plus me-1"></i>
            {{ submitting ? 'Đang tạo...' : 'Tạo Món Ăn Mới' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import api from "../../../services/api";

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

const imageFile = ref(null);
const previewUrl = ref(null);
const submitting = ref(false);
const localError = ref("");

const displayError = ref("");

watch(() => props.error, (err) => {
  displayError.value = err;
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

const handleFileSelected = (e) => {
  const file = e.target.files[0];
  if (file) {
    imageFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
    displayError.value = "";
  }
};

const removeSelectedImage = () => {
  imageFile.value = null;
  previewUrl.value = null;
};

const submitForm = async () => {
  displayError.value = "";
  submitting.value = true;

  try {
    let finalImageUrl = form.image;

    // Nếu người dùng đã chọn tệp ảnh từ máy tính -> upload lên server trước
    if (imageFile.value) {
      const formData = new FormData();
      formData.append("image", imageFile.value);
      const uploadRes = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      finalImageUrl = uploadRes.data.url;
    }

    emit("submit", {
      ...form,
      image: finalImageUrl,
    });
  } catch (err) {
    displayError.value = err.response?.data?.message || err.message || "Lỗi tải ảnh lên server!";
    submitting.value = false;
  }
};
</script>

<style scoped>
.modal-lg-custom {
  max-width: 650px;
}
.upload-box {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
