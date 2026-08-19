<template>
  <div class="review-section-card p-4 p-md-5 rounded-5 bg-white border shadow-sm mt-4">
    <!-- ═══ 1. HEADER KHU VỰC ĐÁNH GIÁ ═══ -->
    <div class="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom flex-wrap gap-3">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="badge bg-warning bg-opacity-15 text-warning-emphasis px-2.5 py-1 rounded-pill fw-bold fs-8">
            <i class="fa-solid fa-star text-warning me-1"></i>Đánh Giá & Nhận Xét
          </span>
          <span class="badge bg-light text-secondary border rounded-pill px-2.5 py-1 fs-9 fw-semibold">
            {{ reviews.length }} nhận xét thực tế
          </span>
        </div>
        <h4 class="fw-bold brand-font text-dark mb-0">
          {{ isEnglish ? 'Customer Reviews & Feedback' : 'Cảm Nhận Từ Thực Khách 3 Miền Cua' }}
        </h4>
      </div>
      <button
        v-if="isAuthenticated && !showForm"
        @click="showForm = true"
        class="btn btn-outline-danger rounded-pill px-3.5 py-1.5 fw-bold fs-8 shadow-2xs"
      >
        <i class="fa-solid fa-pen-nib me-1.5"></i>{{ isEnglish ? 'Write a Review' : 'Viết Đánh Giá' }}
      </button>
    </div>

    <!-- ═══ 2. TỔNG QUAN XẾP HẠNG & PHÂN BỐ SAO (RATING SUMMARY) ═══ -->
    <div class="p-3.5 p-md-4 rounded-4 bg-light bg-opacity-60 border mb-4">
      <div class="row g-4 align-items-center">
        <!-- Cột Điểm Trung Bình -->
        <div class="col-md-4 text-center border-end-md">
          <div class="d-inline-flex flex-column align-items-center">
            <div class="score-display display-4 fw-black text-danger brand-font mb-0">
              {{ averageRating }}<span class="fs-4 text-muted fw-normal">/5</span>
            </div>
            <div class="d-flex gap-1 text-warning fs-5 my-1.5">
              <i
                v-for="star in 5"
                :key="star"
                :class="star <= Math.round(averageRating) ? 'fa-solid fa-star text-warning' : 'fa-regular fa-star text-secondary opacity-35'"
              ></i>
            </div>
            <small class="text-muted fs-8">
              <i class="fa-solid fa-shield-check text-success me-1"></i>100% đánh giá xác thực
            </small>
          </div>
        </div>

        <!-- Cột Thanh Tỉ Lệ Sao -->
        <div class="col-md-8">
          <div class="d-flex flex-column gap-2 max-w-lg mx-auto mx-md-0">
            <div
              v-for="star in [5, 4, 3, 2, 1]"
              :key="star"
              @click="selectedStarFilter = selectedStarFilter === star ? 0 : star"
              :class="[
                'star-bar-row d-flex align-items-center gap-2.5 px-2.5 py-1 rounded-3 transition-all cursor-pointer',
                selectedStarFilter === star ? 'bg-warning bg-opacity-20 shadow-2xs' : 'hover-bg-subtle'
              ]"
              :title="`Xem các đánh giá ${star} sao`"
            >
              <div class="d-flex align-items-center gap-1 text-muted fw-bold fs-8" style="width: 55px;">
                <span>{{ star }}</span>
                <i class="fa-solid fa-star text-warning fs-9"></i>
              </div>
              <div class="progress flex-grow-1 rounded-pill bg-secondary bg-opacity-15" style="height: 8px;">
                <div
                  class="progress-bar bg-warning rounded-pill transition-all"
                  :style="{ width: getStarPercent(star) + '%' }"
                ></div>
              </div>
              <span class="text-muted fs-9 text-end fw-semibold" style="width: 40px;">
                {{ countStar(star) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ 3. FORM VIẾT ĐÁNH GIÁ (NỔI BẬT & TIỆN ÍCH) ═══ -->
    <div class="review-form-card p-4 rounded-4 border bg-white shadow-sm mb-4 position-relative overflow-hidden">
      <div class="form-decor-bar"></div>

      <div class="d-flex align-items-center justify-content-between mb-3">
        <h6 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
          <div class="icon-circle-sm bg-danger text-white rounded-circle d-flex align-items-center justify-content-center">
            <i class="fa-solid fa-pen-fancy fs-9"></i>
          </div>
          {{ isEnglish ? 'Share Your Experience' : 'Chia Sẻ Cảm Nhận Của Bạn Về Món Ăn' }}
        </h6>
        <span v-if="isAuthenticated" class="text-muted fs-9">
          Đăng với tên: <strong class="text-danger">{{ authStore.user?.name }}</strong>
        </span>
      </div>

      <!-- Nếu chưa đăng nhập -->
      <div v-if="!isAuthenticated" class="text-center py-4 bg-light rounded-4 border border-dashed">
        <div class="icon-circle-lg bg-danger bg-opacity-10 text-danger rounded-circle mx-auto mb-2.5 d-flex align-items-center justify-content-center">
          <i class="fa-solid fa-user-lock fs-4"></i>
        </div>
        <h6 class="fw-bold text-dark mb-1">
          {{ isEnglish ? 'Login Required' : 'Đăng Nhập Để Gửi Đánh Giá' }}
        </h6>
        <p class="text-muted small mb-3 max-w-md mx-auto fs-8">
          {{ isEnglish ? 'Please log in with your account to rate this dish and earn member points!' : 'Vui lòng đăng nhập tài khoản để đánh giá độ ngon của món ăn và tích lũy điểm hội viên nhé!' }}
        </p>
        <router-link to="/login" class="btn btn-danger rounded-pill px-4 py-2 fw-bold fs-8 shadow-sm">
          <i class="fa-solid fa-right-to-bracket me-1.5"></i>{{ isEnglish ? 'Login Now' : 'Đăng Nhập Ngay' }}
        </router-link>
      </div>

      <!-- Form nhập đánh giá khi đã đăng nhập -->
      <form v-else @submit.prevent="submitReview">
        <!-- Bộ chọn Sao Interactive -->
        <div class="p-3 bg-light rounded-4 border mb-3">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <label class="form-label small fw-bold text-dark mb-0">
              {{ isEnglish ? 'Your Rating:' : 'Đánh giá mức độ hài lòng:' }}
            </label>
            <span class="badge bg-warning text-dark rounded-pill px-3 py-1.5 fs-8 fw-bold shadow-2xs animate-fade">
              <i class="fa-solid fa-thumbs-up me-1"></i>{{ starText(hoverRating || reviewForm.rating) }}
            </span>
          </div>

          <div class="d-flex align-items-center gap-2 mt-2">
            <div class="stars-picker d-flex gap-1.5 fs-3">
              <i
                v-for="s in 5"
                :key="s"
                @click="reviewForm.rating = s"
                @mouseover="hoverRating = s"
                @mouseleave="hoverRating = 0"
                :class="[
                  'cursor-pointer transition-transform star-btn',
                  (hoverRating ? s <= hoverRating : s <= reviewForm.rating) ? 'fa-solid fa-star text-warning' : 'fa-regular fa-star text-secondary opacity-35'
                ]"
              ></i>
            </div>
          </div>
        </div>

        <!-- Gợi ý nhanh (Quick Tags) -->
        <div class="mb-2.5">
          <small class="text-muted fs-9 fw-semibold d-block mb-1.5">
            <i class="fa-solid fa-tags text-danger me-1"></i>Gợi ý nhanh (Click để thêm vào nhận xét):
          </small>
          <div class="d-flex flex-wrap gap-1.5">
            <button
              v-for="tag in quickTags"
              :key="tag"
              type="button"
              @click="appendTag(tag)"
              class="btn btn-sm btn-light border rounded-pill px-2.5 py-1 fs-9 text-secondary hover-tag transition-all"
            >
              + {{ tag }}
            </button>
          </div>
        </div>

        <!-- Khung Viết Nhận Xét -->
        <div class="mb-3 position-relative">
          <textarea
            v-model="reviewForm.comment"
            rows="3"
            class="form-control rounded-4 fs-7 p-3 border review-textarea"
            :placeholder="isEnglish ? 'Describe the taste, freshness, and presentation of this dish...' : 'Hãy mô tả hương vị, độ tươi ngon và cảm nhận của bạn khi thưởng thức món ăn này...'"
            maxlength="500"
            required
          ></textarea>
          <span class="position-absolute bottom-0 end-0 m-2.5 text-muted fs-9">
            {{ reviewForm.comment.length }}/500
          </span>
        </div>

        <div class="d-flex justify-content-end align-items-center gap-2">
          <button
            type="submit"
            class="btn btn-danger btn-lg rounded-pill px-5 py-2.5 fw-bold fs-7 shadow-sm d-inline-flex align-items-center gap-2"
            :disabled="submitting || !reviewForm.comment.trim()"
          >
            <span v-if="submitting" class="spinner-border spinner-border-sm"></span>
            <i v-else class="fa-solid fa-paper-plane"></i>
            {{ isEnglish ? 'Send Review' : 'Gửi Đánh Giá' }}
          </button>
        </div>
      </form>
    </div>

    <!-- ═══ 4. BỘ LỌC ĐÁNH GIÁ (FILTER CHIPS) ═══ -->
    <div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2 pt-2 border-top">
      <div class="d-flex align-items-center gap-1.5 flex-wrap">
        <span class="small fw-bold text-muted me-1.5 fs-8">
          <i class="fa-solid fa-filter text-danger me-1"></i>{{ isEnglish ? 'Filter:' : 'Lọc:' }}
        </span>
        <button
          @click="selectedStarFilter = 0"
          :class="['btn btn-sm rounded-pill px-3 fs-8 fw-semibold transition-all', selectedStarFilter === 0 ? 'btn-danger shadow-sm' : 'btn-light border text-secondary']"
        >
          {{ isEnglish ? 'All' : 'Tất cả' }} ({{ reviews.length }})
        </button>
        <button
          v-for="s in [5, 4, 3, 2, 1]"
          :key="s"
          @click="selectedStarFilter = s"
          :class="['btn btn-sm rounded-pill px-3 fs-8 fw-semibold transition-all', selectedStarFilter === s ? 'btn-danger shadow-sm' : 'btn-light border text-secondary']"
        >
          {{ s }} <i class="fa-solid fa-star text-warning fs-9"></i> ({{ countStar(s) }})
        </button>
      </div>

      <small class="text-muted fs-9">
        Hiển thị <strong>{{ filteredReviews.length }}</strong> đánh giá
      </small>
    </div>

    <!-- ═══ 5. DANH SÁCH CÁC NHẬN XÉT CỦA THỰC KHÁCH ═══ -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-danger spinner-border-sm" role="status"></div>
      <p class="text-muted fs-8 mt-2 mb-0">Đang tải nhận xét...</p>
    </div>

    <div v-else-if="filteredReviews.length === 0" class="text-center py-5 text-muted bg-light rounded-4 border border-dashed my-2">
      <div class="icon-circle-lg bg-light border text-secondary opacity-50 rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center">
        <i class="fa-regular fa-comment-dots fs-3"></i>
      </div>
      <h6 class="fw-bold text-dark fs-7 mb-1">Chưa Có Đánh Giá Nào</h6>
      <p class="small text-muted mb-0 fs-8">
        {{ isEnglish ? 'Be the first to share your review for this delicious dish!' : 'Hãy là người đầu tiên thưởng thức và để lại cảm nhận cho món ăn này nhé!' }}
      </p>
    </div>

    <div v-else class="d-flex flex-column gap-3">
      <div
        v-for="r in filteredReviews"
        :key="r._id"
        class="review-item-card p-3.5 p-md-4 rounded-4 border bg-white shadow-2xs hover-shadow transition-all"
      >
        <!-- Header: Avatar + User Info + Stars -->
        <div class="d-flex justify-content-between align-items-start mb-2.5 flex-wrap gap-2">
          <div class="d-flex align-items-center gap-3">
            <div class="review-avatar rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-2xs">
              {{ getInitials(r.user?.name) }}
            </div>
            <div>
              <div class="d-flex align-items-center gap-2">
                <strong class="text-dark fs-7">{{ r.user?.name || (isEnglish ? 'Guest Customer' : 'Khách Hàng') }}</strong>
                <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-0.5 fs-9 fw-semibold border border-success border-opacity-20">
                  <i class="fa-solid fa-circle-check me-1"></i>Đã Thưởng Thức
                </span>
              </div>
              <small class="text-muted fs-9 d-flex align-items-center gap-1.5 mt-0.5">
                <i class="fa-regular fa-clock text-secondary"></i>
                {{ formatDate(r.createdAt) }}
              </small>
            </div>
          </div>

          <!-- Stars Badge -->
          <div class="d-flex align-items-center gap-1.5 bg-warning bg-opacity-10 px-2.5 py-1 rounded-pill border border-warning border-opacity-20">
            <span class="fw-black text-warning-emphasis fs-8">{{ r.rating }}.0</span>
            <div class="d-flex gap-0.5 text-warning fs-9">
              <i v-for="star in 5" :key="star" :class="star <= r.rating ? 'fa-solid fa-star' : 'fa-regular fa-star text-secondary opacity-30'"></i>
            </div>
          </div>
        </div>

        <!-- Comment Content -->
        <div class="review-content-body rounded-3 p-3 bg-light bg-opacity-50 border-0 mb-2">
          <p class="text-dark small mb-0 review-text">
            {{ r.comment }}
          </p>
        </div>

        <!-- Phản hồi chính thức từ Nhà Hàng -->
        <div v-if="r.reply && r.reply.comment" class="restaurant-reply-card rounded-4 p-3 border-start border-4 border-danger bg-light mt-3 shadow-2xs">
          <div class="d-flex align-items-center justify-content-between mb-1.5">
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-danger text-white rounded-pill px-2.5 py-1 fs-9 fw-bold d-inline-flex align-items-center gap-1">
                <i class="fa-solid fa-crown text-warning"></i>
                Nhà Hàng 3 Miền Cua Phản Hồi
              </span>
            </div>
            <small class="text-muted fs-9" v-if="r.reply.repliedAt">
              <i class="fa-regular fa-calendar me-1"></i>{{ formatDate(r.reply.repliedAt) }}
            </small>
          </div>
          <p class="small text-secondary mb-0 fst-italic" style="line-height: 1.6;">
            "{{ r.reply.comment }}"
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import api from "../../services/api";
import { useAuthStore } from "../../stores/authStore";
import { toast } from "../../composables/useToast";

const props = defineProps({
  dishId: {
    type: String,
    required: true,
  },
  isAuthenticated: {
    type: Boolean,
    default: false,
  },
  isEnglish: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["review-added"]);

const authStore = useAuthStore();
const reviews = ref([]);
const loading = ref(false);
const submitting = ref(false);
const showForm = ref(true);
const hoverRating = ref(0);
const selectedStarFilter = ref(0);

const quickTags = [
  "Hương vị tuyệt hảo",
  "Hải sản rất tươi",
  "Nêm nếm vừa miệng",
  "Trình bày bắt mắt",
  "Phục vụ nhiệt tình",
  "Đáng tiền",
];

const reviewForm = reactive({
  rating: 5,
  comment: "",
});

const averageRating = computed(() => {
  if (reviews.value.length === 0) return "5.0";
  const sum = reviews.value.reduce((acc, r) => acc + (r.rating || 5), 0);
  return (sum / reviews.value.length).toFixed(1);
});

const countStar = (star) => {
  return reviews.value.filter((r) => r.rating === star).length;
};

const getStarPercent = (star) => {
  if (reviews.value.length === 0) return 0;
  return (countStar(star) / reviews.value.length) * 100;
};

const filteredReviews = computed(() => {
  if (selectedStarFilter.value === 0) return reviews.value;
  return reviews.value.filter((r) => r.rating === selectedStarFilter.value);
});

const starText = (rating) => {
  const mapVi = {
    5: "5 Sao — Tuyệt đỉnh xuất sắc!",
    4: "4 Sao — Rất ngon & hài lòng",
    3: "3 Sao — Tương đối ổn",
    2: "2 Sao — Cần cải thiện thêm",
    1: "1 Sao — Chưa đạt yêu cầu",
  };
  const mapEn = {
    5: "5 Stars — Outstanding & Delicious!",
    4: "4 Stars — Very Good & Satisfying",
    3: "3 Stars — Average",
    2: "2 Stars — Needs Improvement",
    1: "1 Star — Poor Experience",
  };
  return (props.isEnglish ? mapEn : mapVi)[rating] || `${rating} Sao`;
};

const getInitials = (name) => {
  if (!name) return "KH";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatDate = (dateStr) => {
  if (!dateStr) return "Vừa xong";
  const date = new Date(dateStr);
  const time = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const day = date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  return `${time} · ${day}`;
};

const appendTag = (tag) => {
  if (!reviewForm.comment) {
    reviewForm.comment = tag + ". ";
  } else if (!reviewForm.comment.includes(tag)) {
    reviewForm.comment = reviewForm.comment.trim() + ", " + tag.toLowerCase();
  }
};

const fetchReviews = async () => {
  if (!props.dishId) return;
  loading.value = true;
  try {
    const res = await api.get(`/reviews/dish/${props.dishId}`);
    reviews.value = res.data.data.reviews || [];
  } catch (err) {
    console.error("Lỗi lấy danh sách đánh giá:", err);
  } finally {
    loading.value = false;
  }
};

const submitReview = async () => {
  if (!reviewForm.comment.trim()) {
    toast.error(props.isEnglish ? "Please enter your review comment" : "Vui lòng nhập nội dung nhận xét");
    return;
  }
  submitting.value = true;
  try {
    await api.post("/reviews", {
      dishId: props.dishId,
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
    });
    toast.success(props.isEnglish ? "Thank you for your review!" : "Cảm ơn bạn đã gửi đánh giá món ăn!");
    reviewForm.comment = "";
    reviewForm.rating = 5;
    await fetchReviews();
    emit("review-added");
  } catch (err) {
    toast.error(err.response?.data?.message || (props.isEnglish ? "Failed to submit review" : "Gửi đánh giá thất bại"));
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchReviews();
});
</script>

<style scoped>
.review-section-card {
  border-color: rgba(0, 0, 0, 0.08);
}
.icon-circle-sm {
  width: 26px;
  height: 26px;
}
.icon-circle-lg {
  width: 52px;
  height: 52px;
}
.review-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #d32f2f, #f59e0b);
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}
.review-form-card {
  border-color: #fee2e2;
  background: #ffffff;
}
.form-decor-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #d32f2f, #f59e0b, #ef4444);
}
.review-textarea {
  background-color: #fafbfc;
  border-color: #e5e7eb;
  transition: all 0.2s ease;
  line-height: 1.6;
}
.review-textarea:focus {
  background-color: #ffffff;
  border-color: #d32f2f;
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.12);
}
.star-btn {
  transition: transform 0.15s ease;
}
.star-btn:hover {
  transform: scale(1.25);
}
.hover-tag:hover {
  background-color: #fee2e2 !important;
  color: #d32f2f !important;
  border-color: #fca5a5 !important;
}
.hover-bg-subtle:hover {
  background-color: rgba(0, 0, 0, 0.03);
}
.hover-shadow:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border-color: #fecaca;
}
.review-text {
  line-height: 1.65;
  font-size: 0.92rem;
}
.shadow-2xs {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.transition-all {
  transition: all 0.2s ease;
}
@media (min-width: 768px) {
  .border-end-md {
    border-right: 1px solid #e5e7eb;
  }
}
</style>
