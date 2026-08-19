<template>
  <div class="not-found-page min-vh-100 d-flex align-items-center justify-content-center py-5 bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-7 col-md-9 text-center">
          <div class="glass-card p-4 p-md-5 rounded-5 shadow-lg bg-white border-0 position-relative overflow-hidden">
            <!-- Animated Crab Graphic -->
            <div class="mb-4 position-relative z-2">
              <div class="crab-badge d-inline-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 text-danger p-4 shadow-sm mb-3">
                <i class="fa-solid fa-shrimp display-4 animated-bounce"></i>
              </div>
              
              <div class="d-flex align-items-center justify-content-center gap-3 mb-2">
                <span class="display-3 fw-extrabold brand-font text-danger lh-1">4</span>
                <span class="p-2 bg-warning bg-opacity-20 text-warning rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 58px; height: 58px;">
                  <i class="fa-solid fa-compass fs-2 fa-spin" style="--fa-animation-duration: 10s;"></i>
                </span>
                <span class="display-3 fw-extrabold brand-font text-danger lh-1">4</span>
              </div>
            </div>

            <!-- Text Content -->
            <div class="position-relative z-2">
              <h3 class="fw-bold brand-font text-dark mb-2">
                {{ isEnglish ? 'Oops! Page Not Found' : 'Ối! Không Tìm Thấy Trang Này' }}
              </h3>
              <p class="text-muted small max-w-500 mx-auto mb-4">
                {{ isEnglish
                  ? 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let us guide you back to delicious crab dishes!'
                  : 'Trang bạn đang tìm kiếm có thể đã bị xóa, thay đổi đường dẫn hoặc tạm thời không khả dụng. Hãy để chúng tôi đưa bạn trở về với thực đơn hải sản 3 Miền thơm ngon nhé!' }}
              </p>

              <!-- Quick Links / Actions -->
              <div class="d-flex justify-content-center gap-2.5 flex-wrap mb-4">
                <router-link to="/" class="btn btn-primary-crab px-4 py-2.5 fw-bold shadow-sm">
                  <i class="fa-solid fa-house me-1.5"></i>
                  {{ isEnglish ? 'Back to Home' : 'Về Trang Chủ' }}
                </router-link>

                <router-link to="/thuc-don" class="btn btn-outline-danger rounded-pill px-4 py-2.5 fw-bold">
                  <i class="fa-solid fa-utensils me-1.5"></i>
                  {{ isEnglish ? 'Explore Menu' : 'Khám Phá Thực Đơn' }}
                </router-link>

                <router-link to="/dat-ban" class="btn btn-warning rounded-pill px-4 py-2.5 fw-bold text-dark shadow-2xs">
                  <i class="fa-solid fa-calendar-check me-1.5"></i>
                  {{ isEnglish ? 'Book a Table' : 'Đặt Bàn Ngay' }}
                </router-link>
              </div>

              <!-- Helpful Shortcuts -->
              <div class="pt-3 border-top d-flex justify-content-center align-items-center gap-3 fs-8 text-secondary flex-wrap">
                <span>{{ isEnglish ? 'Need help?' : 'Cần hỗ trợ?' }}</span>
                <a href="tel:19003388" class="text-decoration-none text-danger fw-bold">
                  <i class="fa-solid fa-phone me-1"></i>Hotline: 1900 3388
                </a>
                <span>•</span>
                <router-link to="/tra-cuu" class="text-decoration-none text-secondary hover-danger">
                  <i class="fa-solid fa-receipt me-1"></i>{{ isEnglish ? 'Track Order' : 'Tra cứu đơn' }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useLangStore } from "../stores/langStore";

const langStore = useLangStore();
const isEnglish = computed(() => langStore.isEnglish);
</script>

<style scoped>
.crab-badge {
  width: 90px;
  height: 90px;
}

.animated-bounce {
  animation: bounce 2s infinite ease-in-out;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.hover-danger:hover {
  color: #dc3545 !important;
}

.max-w-500 {
  max-width: 500px;
}
</style>
