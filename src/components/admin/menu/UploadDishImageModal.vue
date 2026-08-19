<template>
  <div class="modal d-block bg-dark bg-opacity-50" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-5 p-3 shadow-lg border-0">
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title fw-bold brand-font text-danger">
            <i class="fa-solid fa-cloud-arrow-up me-2"></i>Tải Ảnh Lên Cho Món: {{ dish?.name }}
          </h5>
          <button @click="$emit('close')" type="button" class="btn-close"></button>
        </div>

        <div class="modal-body">
          <div class="mb-3 text-center">
            <label class="form-label fw-semibold fs-7 text-dark d-block text-start mb-2">
              Chọn tệp hình ảnh từ máy tính (JPG, PNG, WEBP)
            </label>
            <input
              type="file"
              ref="fileInput"
              @change="handleFileSelected"
              class="form-control py-2 fs-7"
              accept="image/*"
            />
          </div>

          <!-- Preview box -->
          <div v-if="previewUrl" class="text-center my-3 p-3 bg-light rounded-4 border">
            <small class="text-muted d-block mb-2 fw-semibold">Xem trước ảnh sắp tải lên:</small>
            <img :src="previewUrl" class="img-fluid rounded-3 shadow-sm object-fit-cover" style="max-height: 180px;" />
          </div>

          <div v-if="errorMessage" class="alert alert-danger small rounded-3 mt-3 mb-0">{{ errorMessage }}</div>
        </div>

        <div class="modal-footer border-0 pt-0">
          <button @click="$emit('close')" class="btn btn-light rounded-pill px-4 fs-7" :disabled="uploading">Hủy</button>
          <button
            @click="handleUpload"
            :disabled="!selectedFile || uploading"
            class="btn btn-danger rounded-pill px-4 fw-bold fs-7 shadow-sm"
          >
            <span v-if="uploading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="fa-solid fa-upload me-1.5"></i>
            {{ uploading ? 'Đang tải lên...' : 'Tải Ảnh Lên Server' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../../../services/api";

const props = defineProps({
  dish: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "uploaded"]);

const selectedFile = ref(null);
const previewUrl = ref(null);
const uploading = ref(false);
const errorMessage = ref("");

const handleFileSelected = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
    errorMessage.value = "";
  }
};

const handleUpload = async () => {
  if (!selectedFile.value || !props.dish) return;
  uploading.value = true;
  errorMessage.value = "";

  try {
    const formData = new FormData();
    formData.append("image", selectedFile.value);

    // 1. Upload ảnh lên server
    const uploadRes = await api.post("/uploads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const imageUrl = uploadRes.data.url;

    // 2. Cập nhật URL ảnh cho món ăn
    await api.patch(`/dishes/${props.dish._id}`, { image: imageUrl });

    emit("uploaded", imageUrl);
  } catch (err) {
    errorMessage.value = err.response?.data?.message || err.message || "Tải ảnh thất bại!";
  } finally {
    uploading.value = false;
  }
};
</script>
