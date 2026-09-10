<template>
  <nav class="navbar navbar-expand-xl glass-nav sticky-top py-2">
    <div class="container-fluid container-xl">
      <!-- Logo Brand (Fixed geometry to prevent layout shift) -->
      <router-link to="/" class="navbar-brand d-flex align-items-center gap-2 me-3" style="min-width: 200px;">
        <img src="/logo-3mien-cua.svg" alt="3 Miền Cua Logo" style="width: 40px; height: 40px;" class="rounded-3 shadow-sm flex-shrink-0" />
        <div class="leading-none overflow-hidden">
          <span class="fw-bold fs-5 brand-font text-danger d-block text-nowrap">3 MIỀN CUA</span>
          <small class="text-muted fs-8 d-block text-nowrap text-truncate fw-normal" style="font-size: 0.7rem; max-width: 160px;">
            {{ langStore.isEnglish ? 'Specialty Cuisine' : 'Ẩm thực đặc sản 3 miền' }}
          </small>
        </div>
      </router-link>

      <!-- Mobile Right Controls (Search + Lang + Toggler) -->
      <div class="d-flex align-items-center gap-2 d-xl-none ms-auto me-2">
        <button
          @click="openSearchModal"
          class="btn btn-light rounded-circle shadow-xs border d-flex align-items-center justify-content-center"
          style="width: 36px; height: 36px;"
          title="Tìm kiếm món ăn"
        >
          <i class="fa-solid fa-magnifying-glass text-secondary font-xs"></i>
        </button>

        <button
          @click="langStore.toggleLang()"
          class="btn btn-outline-danger btn-sm rounded-pill px-2.5 py-1 fs-8 fw-bold"
        >
          <i class="fa-solid fa-globe me-1"></i>{{ langStore.currentLang }}
        </button>
      </div>

      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarMain"
        aria-controls="navbarMain"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarMain">
        <!-- Main Navigation Links -->
        <ul class="navbar-nav mx-auto mb-2 mb-xl-0 gap-xl-1 align-items-center fw-semibold fs-7">
          <li class="nav-item">
            <router-link to="/" class="nav-link px-2.5 text-nowrap" active-class="active text-danger fw-bold">
              {{ langStore.isEnglish ? 'Home' : 'Trang Chủ' }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/thuc-don" class="nav-link px-2.5 text-nowrap" active-class="active text-danger fw-bold">
              {{ langStore.isEnglish ? 'Menu' : 'Thực Đơn 3 Miền' }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/dat-ban" class="nav-link px-2.5 text-nowrap" active-class="active text-danger fw-bold">
              <i class="fa-solid fa-calendar-check me-1 text-danger"></i>
              {{ langStore.isEnglish ? 'Book Table' : 'Đặt Bàn Online' }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/tra-cuu" class="nav-link px-2.5 text-nowrap" active-class="active text-danger fw-bold">
              {{ langStore.isEnglish ? 'Track Order' : 'Tra Cứu Đơn' }}
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/hang-thanh-vien" class="nav-link px-2.5 text-nowrap" active-class="active text-danger fw-bold">
              <i class="fa-solid fa-crown me-1 text-warning"></i>
              {{ langStore.isEnglish ? 'Loyalty Rank' : 'Hạng Thành Viên' }}
            </router-link>
          </li>
          <li v-if="authStore.isAuthenticated" class="nav-item d-xl-none">
            <router-link to="/ho-so" class="nav-link px-2.5 text-nowrap" active-class="active text-danger fw-bold">
              <i class="fa-solid fa-user-gear me-1 text-danger"></i>
              {{ langStore.isEnglish ? 'My Profile' : 'Hồ Sơ Của Tôi' }}
            </router-link>
          </li>
        </ul>

        <!-- Right Side Action Buttons -->
        <div class="d-flex align-items-center gap-2 ms-xl-2 mt-2 mt-xl-0 flex-shrink-0 justify-content-end">
          <!-- Desktop Search Icon Button -->
          <button
            @click="openSearchModal"
            class="btn btn-light rounded-circle shadow-2xs border d-none d-xl-flex align-items-center justify-content-center search-trigger-btn transition-all"
            style="width: 38px; height: 38px;"
            :title="langStore.isEnglish ? 'Search dishes (Ctrl+K)' : 'Tìm kiếm món ăn (Ctrl+K)'"
          >
            <i class="fa-solid fa-magnifying-glass text-secondary"></i>
          </button>

          <!-- Nút Đổi Ngôn Ngữ Desktop -->
          <button
            @click="langStore.toggleLang()"
            class="btn btn-outline-danger btn-sm rounded-pill px-3 py-1.5 fs-7 d-none d-xl-flex align-items-center gap-1.5 text-nowrap fw-bold shadow-sm"
            title="Đổi ngôn ngữ Tiếng Việt / Tiếng Anh"
          >
            <i class="fa-solid fa-globe"></i>
            <span>{{ langStore.currentLang }}</span>
          </button>

          <!-- Nếu đã đăng nhập -->
          <div v-if="authStore.isAuthenticated" class="dropdown">
            <button
              class="btn btn-outline-secondary dropdown-toggle rounded-pill px-3 py-1.5 fs-7 d-flex align-items-center gap-2 text-nowrap"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i class="fa-solid fa-circle-user fs-6 text-danger"></i>
              <span class="fw-semibold">{{ authStore.user?.name }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 p-2 mt-2" style="min-width: 220px;">
              <li v-if="authStore.isStaff">
                <router-link :to="authStore.user?.role === 'staff' ? '/admin/pos' : '/admin'" class="dropdown-item rounded-3 py-2 fw-medium text-danger">
                  <i class="fa-solid fa-cash-register me-2" v-if="authStore.user?.role === 'staff'"></i>
                  <i class="fa-solid fa-chart-line me-2" v-else></i>
                  {{ authStore.user?.role === 'staff' ? 'Màn Hình POS Bán Hàng' : (langStore.isEnglish ? 'Admin Dashboard' : 'Trang Quản Trị Nhà Hàng') }}
                </router-link>
              </li>
              <li>
                <router-link to="/ho-so?tab=info" class="dropdown-item rounded-3 py-2 fw-medium">
                  <i class="fa-solid fa-user-gear me-2 text-primary"></i> {{ langStore.isEnglish ? 'My Profile' : 'Hồ Sơ & Thông Tin' }}
                </router-link>
              </li>
              <li>
                <router-link to="/ho-so?tab=invoices" class="dropdown-item rounded-3 py-2 fw-medium">
                  <i class="fa-solid fa-file-invoice-dollar me-2 text-success"></i> {{ langStore.isEnglish ? 'Invoice History' : 'Lịch Sử Hóa Đơn' }}
                </router-link>
              </li>
              <li>
                <router-link to="/ho-so?tab=favorites" class="dropdown-item rounded-3 py-2 fw-medium">
                  <i class="fa-solid fa-heart me-2 text-danger"></i> {{ langStore.isEnglish ? 'Favorite Dishes' : 'Món Ăn Yêu Thích' }}
                </router-link>
              </li>
              <li>
                <router-link to="/hang-thanh-vien" class="dropdown-item rounded-3 py-2 fw-medium">
                  <i class="fa-solid fa-gem me-2 text-warning"></i> {{ langStore.isEnglish ? 'Points:' : 'Điểm Tích Lũy:' }} {{ (authStore.user?.totalSpent || 0).toLocaleString('vi-VN') }}đ
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button @click="handleLogout" class="dropdown-item rounded-3 py-2 fw-medium text-muted">
                  <i class="fa-solid fa-arrow-right-from-bracket me-2"></i> {{ langStore.isEnglish ? 'Logout' : 'Đăng Xuất' }}
                </button>
              </li>
            </ul>
          </div>

          <!-- Nếu chưa đăng nhập -->
          <template v-else>
            <router-link to="/login" class="btn btn-link text-decoration-none text-dark fw-semibold px-2.5 text-nowrap fs-7">
              {{ langStore.isEnglish ? 'Login' : 'Đăng Nhập' }}
            </router-link>
          </template>

          <router-link to="/dat-ban" class="btn btn-primary-crab px-3.5 py-2 text-nowrap fs-7 fw-bold shadow-sm">
            {{ langStore.isEnglish ? 'Book Now' : 'Đặt Bàn Ngay' }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>

  <!-- MODERN SEARCH MODAL / COMMAND PALETTE -->
  <Teleport to="body">
    <Transition name="search-fade">
      <div
        v-if="isSearchOpen"
        class="search-modal-backdrop"
        @click.self="closeSearchModal"
      >
        <div class="search-modal-container bg-white rounded-4 shadow-2xl overflow-hidden border">
          <!-- Header Search Input -->
          <div class="search-modal-header p-3 border-bottom d-flex align-items-center gap-2">
            <i class="fa-solid fa-magnifying-glass text-danger fs-5 ms-1"></i>
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              @keydown.enter="handleSearchSubmit"
              @keydown.esc="closeSearchModal"
              type="text"
              class="form-control form-control-lg border-0 shadow-none ps-2 pe-1 fs-6"
              :placeholder="langStore.isEnglish ? 'Search dishes by name, ingredients, region...' : 'Tìm món ăn theo tên, nguyên liệu, vùng miền...'"
            />
            <button
              v-if="searchQuery"
              type="button"
              class="btn btn-link text-muted p-1 text-decoration-none me-1"
              @click="searchQuery = ''"
            >
              <i class="fa-solid fa-circle-xmark fs-5"></i>
            </button>
            <button
              type="button"
              class="btn btn-light rounded-pill px-2.5 py-1 text-muted fs-8 fw-semibold border"
              @click="closeSearchModal"
            >
              <span class="d-none d-sm-inline">ESC</span>
              <i class="fa-solid fa-xmark d-inline d-sm-none"></i>
            </button>
          </div>

          <!-- Quick Tags Suggestions -->
          <div class="p-3 bg-light-subtle border-bottom d-flex align-items-center gap-2 flex-wrap fs-8">
            <span class="text-muted fw-semibold flex-shrink-0">
              <i class="fa-solid fa-fire text-danger me-1"></i>{{ langStore.isEnglish ? 'Popular:' : 'Gợi ý hot:' }}
            </span>
            <button
              v-for="tag in popularTags"
              :key="tag"
              type="button"
              class="btn btn-sm btn-white border rounded-pill px-2.5 py-0.5 fs-8 text-secondary shadow-2xs hover-danger"
              @click="selectTag(tag)"
            >
              {{ tag }}
            </button>
          </div>

          <!-- Results Body -->
          <div class="search-modal-body p-3" style="max-height: 380px; overflow-y: auto;">
            <!-- Loading -->
            <div v-if="menuStore.loading" class="text-center py-4 text-muted">
              <div class="spinner-border spinner-border-sm text-danger me-2"></div>
              <span>{{ langStore.isEnglish ? 'Searching menu...' : 'Đang tìm món...' }}</span>
            </div>

            <!-- List Results -->
            <div v-else-if="filteredResults.length > 0" class="d-flex flex-column gap-2">
              <div class="d-flex justify-content-between align-items-center mb-1 px-1">
                <span class="text-muted fs-8 fw-bold text-uppercase">
                  {{ langStore.isEnglish ? 'Matching Dishes' : 'Món ăn phù hợp' }} ({{ filteredResults.length }})
                </span>
                <button
                  type="button"
                  class="btn btn-link text-danger fs-8 fw-bold text-decoration-none p-0"
                  @click="handleSearchSubmit"
                >
                  {{ langStore.isEnglish ? 'View all in Menu →' : 'Xem trong Thực Đơn →' }}
                </button>
              </div>

              <div
                v-for="dish in filteredResults"
                :key="dish._id"
                class="search-dish-card p-2 rounded-3 border d-flex align-items-center justify-content-between gap-3 hover-bg-light transition-all cursor-pointer"
                @click="goToDish(dish)"
              >
                <div class="d-flex align-items-center gap-3 overflow-hidden">
                  <img
                    :src="getImageUrl(dish.image)"
                    :alt="dish.name"
                    class="rounded-3 object-fit-cover flex-shrink-0"
                    style="width: 52px; height: 52px;"
                    @error="(e) => e.target.src = '/images/default-dish.jpg'"
                  />
                  <div class="overflow-hidden">
                    <h6 class="fw-bold text-dark mb-0.5 fs-7 text-truncate">{{ dish.name }}</h6>
                    <p class="text-muted fs-8 mb-0 text-truncate" style="max-width: 320px;">
                      {{ dish.description || 'Đặc sản tươi ngon chuẩn vị 3 miền' }}
                    </p>
                    <div class="d-flex align-items-center gap-2 mt-1">
                      <span class="badge bg-danger-subtle text-danger fs-8 px-2 py-0.5 rounded-pill">{{ dish.region || 'Đặc sản' }}</span>
                      <span class="text-danger fw-bold fs-7">{{ (dish.price || 0).toLocaleString('vi-VN') }}đ</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 fs-8 fw-semibold flex-shrink-0"
                  @click.stop="goToDish(dish)"
                >
                  {{ langStore.isEnglish ? 'Details' : 'Chi tiết' }} <i class="fa-solid fa-arrow-right ms-1"></i>
                </button>
              </div>
            </div>

            <!-- Empty State when searching -->
            <div v-else-if="searchQuery.trim()" class="text-center py-5">
              <div class="display-6 text-muted mb-2">🦀</div>
              <h6 class="fw-bold text-dark mb-1">
                {{ langStore.isEnglish ? 'No dishes found' : 'Không tìm thấy món ăn phù hợp' }}
              </h6>
              <p class="text-muted fs-8 mb-3">
                {{ langStore.isEnglish ? 'Try searching with different keywords or regions.' : 'Thử tìm với từ khóa khác như "Cua", "Lẩu", "Hấp", "Nướng"...' }}
              </p>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm rounded-pill px-3.5 py-1.5 fw-bold fs-8"
                @click="goToMenuAll"
              >
                {{ langStore.isEnglish ? 'Explore Full Menu' : 'Khám Phá Toàn Bộ Thực Đơn' }}
              </button>
            </div>

            <!-- Default hint when no search query yet -->
            <div v-else class="text-center py-4 text-muted">
              <i class="fa-solid fa-magnifying-glass fs-3 text-danger opacity-50 mb-2 d-block"></i>
              <p class="fs-8 mb-0">
                {{ langStore.isEnglish ? 'Type a dish name, or choose from popular tags above.' : 'Gõ tên món ăn hoặc chọn nhanh từ gợi ý phía trên.' }}
              </p>
            </div>
          </div>

          <!-- Footer Shortcut Hint -->
          <div class="search-modal-footer bg-light px-3 py-2 border-top d-flex justify-content-between align-items-center fs-8 text-muted">
            <span>
              <i class="fa-solid fa-keyboard me-1"></i>
              {{ langStore.isEnglish ? 'Press' : 'Bấm' }} <kbd class="bg-white border text-dark px-1.5 py-0.5 rounded">Enter</kbd> {{ langStore.isEnglish ? 'to search all' : 'để tìm tất cả' }}
            </span>
            <button
              type="button"
              class="btn btn-link text-danger fs-8 fw-bold text-decoration-none p-0"
              @click="goToMenuAll"
            >
              {{ langStore.isEnglish ? 'All dishes' : 'Tất cả thực đơn' }} →
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useLangStore } from "../stores/langStore";
import { useMenuStore } from "../stores/menuStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const langStore = useLangStore();
const menuStore = useMenuStore();
const router = useRouter();

const isSearchOpen = ref(false);
const searchQuery = ref("");
const searchInputRef = ref(null);

const popularTags = [
  "Cua Cà Mau",
  "Cua Rang Me",
  "Lẩu Cua Đồng",
  "Lẩu Cá Kèo",
  "Hấp Nước Dừa",
  "Tôm Hùm",
  "Miền Nam",
  "Miền Bắc",
];

const removeVietnameseTones = (str) => {
  if (!str) return "";
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
  str = str.replace(/\u02C6|\u0306|\u031B/g, "");
  return str.trim();
};

const getImageUrl = (image) => {
  if (!image) return "/images/default-dish.jpg";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return image;
};

const calculateRelevanceScore = (dish, query, cleanQuery) => {
  const name = (dish.name || "").toLowerCase();
  const cleanName = removeVietnameseTones(name);
  const desc = (dish.description || "").toLowerCase();
  const cleanDesc = removeVietnameseTones(desc);
  const reg = (dish.region || "").toLowerCase();
  const cleanReg = removeVietnameseTones(reg);

  let score = 0;

  // 1. EXACT MATCH TÊN MÓN: +1000 điểm
  if (name === query) score += 1000;
  else if (cleanName === cleanQuery) score += 950;

  // 2. TÊN BẮT ĐẦU BẰNG TỪ KHÓA: +600 điểm
  else if (name.startsWith(query)) score += 600;
  else if (cleanName.startsWith(cleanQuery)) score += 550;

  // 3. TÊN CHỨA CỤM TỪ KHÓA NGUYÊN VẸN: +400 điểm
  else if (name.includes(query)) score += 400;
  else if (cleanName.includes(cleanQuery)) score += 350;

  // 4. KHỚP TỪNG TỪ ĐƠN TRONG TÊN: +100 đến +200 điểm
  const tokens = cleanQuery.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    const matchedTokens = tokens.filter((t) => cleanName.includes(t));
    score += (matchedTokens.length / tokens.length) * 200;
  }

  // 5. KHỚP VÙNG MIỀN: +80 điểm
  if (reg === query || cleanReg === cleanQuery) score += 80;
  else if (reg.includes(query) || cleanReg.includes(cleanQuery)) score += 40;

  // 6. KHỚP MÔ TẢ MÓN ĂN: +20 điểm
  if (desc.includes(query) || cleanDesc.includes(cleanQuery)) score += 20;

  // 7. BONUS ĐỘ CÔ ĐỌNG (Tên ngắn gọn sát với từ khóa có rank cao hơn):
  if (score >= 100) {
    score += Math.max(0, 30 - Math.floor(cleanName.length / 2));
  }

  return score;
};

const filteredResults = computed(() => {
  const rawQ = searchQuery.value.trim();
  if (!rawQ) return [];
  const q = rawQ.toLowerCase();
  const cleanQ = removeVietnameseTones(q);

  return (menuStore.dishes || [])
    .map((dish) => ({
      dish,
      score: calculateRelevanceScore(dish, q, cleanQ),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.dish)
    .slice(0, 8);
});

const openSearchModal = async () => {
  isSearchOpen.value = true;
  if (menuStore.dishes.length === 0) {
    menuStore.fetchDishes({ limit: 100 });
  }
  await nextTick();
  if (searchInputRef.value) {
    searchInputRef.value.focus();
  }
};

const closeSearchModal = () => {
  isSearchOpen.value = false;
};

const selectTag = (tag) => {
  searchQuery.value = tag;
  if (searchInputRef.value) {
    searchInputRef.value.focus();
  }
};

const handleSearchSubmit = () => {
  const query = searchQuery.value.trim();
  closeSearchModal();
  router.push({
    path: "/thuc-don",
    query: query ? { search: query } : {},
  });
};

const goToDish = (dish) => {
  closeSearchModal();
  if (dish.slug) {
    router.push(`/mon-an/${dish.slug}`);
  } else {
    router.push({
      path: "/thuc-don",
      query: { search: dish.name },
    });
  }
};

const goToMenuAll = () => {
  closeSearchModal();
  router.push("/thuc-don");
};

const handleLogout = () => {
  authStore.logout();
  router.push("/");
};

const handleKeyDown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    if (isSearchOpen.value) {
      closeSearchModal();
    } else {
      openSearchModal();
    }
  }
  if (e.key === "Escape" && isSearchOpen.value) {
    closeSearchModal();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
.navbar-nav .nav-link {
  white-space: nowrap !important;
  display: inline-flex;
  align-items: center;
}

.search-trigger-btn:hover {
  background-color: #fee2e2 !important;
  border-color: #fca5a5 !important;
}

.search-trigger-btn:hover i {
  color: #dc2626 !important;
}

/* Modal Search Styles */
.search-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 80px 16px 24px;
}

.search-modal-container {
  width: 100%;
  max-width: 640px;
  background: #ffffff;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalSlideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.hover-danger:hover {
  background-color: #fee2e2 !important;
  color: #dc2626 !important;
  border-color: #fca5a5 !important;
}

.search-dish-card:hover {
  background-color: #f8fafc;
  border-color: #fca5a5 !important;
}

.cursor-pointer {
  cursor: pointer;
}

.font-xs {
  font-size: 0.8rem;
}

.font-2xs {
  font-size: 0.68rem;
}

@keyframes modalSlideDown {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.2s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}
</style>
