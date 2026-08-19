<template>
  <div class="row g-4">
    <div
      v-for="n in count"
      :key="n"
      :class="colClass"
    >
      <div class="card border-0 rounded-4 shadow-sm overflow-hidden h-100 bg-white skeleton-card">
        <!-- Image placeholder with shimmer -->
        <div class="position-relative skeleton-shimmer" :style="{ height: imageHeight }">
          <div class="skeleton-badge position-absolute top-0 start-0 m-3 rounded-pill"></div>
        </div>

        <!-- Card Body -->
        <div class="card-body p-3.5 d-flex flex-column">
          <!-- Title placeholder -->
          <div class="skeleton-line skeleton-title mb-2 rounded-2"></div>
          <div class="skeleton-line skeleton-subtitle mb-3 rounded-2" style="width: 60%;"></div>

          <!-- Description lines -->
          <div class="skeleton-line mb-1.5 rounded-1" style="width: 90%;"></div>
          <div class="skeleton-line mb-3 rounded-1" style="width: 75%;"></div>

          <!-- Footer with price & button -->
          <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-auto">
            <div class="skeleton-price rounded-2"></div>
            <div class="skeleton-btn rounded-pill"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 8,
  },
  colClass: {
    type: String,
    default: "col-sm-6 col-md-4 col-lg-3",
  },
  imageHeight: {
    type: String,
    default: "190px",
  },
});
</script>

<style scoped>
.skeleton-card {
  user-select: none;
  pointer-events: none;
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    #f1f5f9 0%,
    #e2e8f0 50%,
    #f1f5f9 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite ease-in-out;
}

.skeleton-line {
  height: 12px;
  background: linear-gradient(
    90deg,
    #f1f5f9 0%,
    #e2e8f0 50%,
    #f1f5f9 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite ease-in-out;
}

.skeleton-title {
  height: 18px;
  width: 80%;
}

.skeleton-subtitle {
  height: 10px;
}

.skeleton-badge {
  width: 64px;
  height: 22px;
  background: rgba(226, 232, 240, 0.9);
}

.skeleton-price {
  width: 80px;
  height: 20px;
  background: linear-gradient(
    90deg,
    #fee2e2 0%,
    #fecaca 50%,
    #fee2e2 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite ease-in-out;
}

.skeleton-btn {
  width: 90px;
  height: 32px;
  background: linear-gradient(
    90deg,
    #f1f5f9 0%,
    #e2e8f0 50%,
    #f1f5f9 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite ease-in-out;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
