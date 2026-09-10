<template>
  <div class="py-5 bg-light min-vh-100">
    <div class="container">
      <!-- Title Header -->
      <div class="text-center max-w-2xl mx-auto mb-5">
        <span class="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-bold mb-2 fs-8 text-uppercase">
          <i class="fa-solid fa-utensils me-1"></i> {{ langStore.t('home.badge') }}
        </span>
        <h1 class="display-5 fw-bold brand-font text-dark">
          {{ langStore.t('menu.title') }}
        </h1>
        <p class="text-muted small">
          {{ langStore.t('menu.subtitle') }}
        </p>
      </div>

      <!-- DUAL FILTER TOOLBAR (3 MIỀN + CATEGORIES TỪ DB + SORT) -->
      <div class="glass-card p-4 mb-4 rounded-5 shadow-sm bg-white border-0">
        <!-- Row 1: Search & Sort & 3 Miền Region Filter -->
        <div class="row g-3 align-items-center mb-3">
          <!-- Search Input -->
          <div class="col-lg-4 col-md-6">
            <div class="position-relative">
              <div class="input-group rounded-pill overflow-hidden border shadow-2xs bg-light">
                <span class="input-group-text bg-light border-0 ps-3 pe-1 text-muted">
                  <i class="fa-solid fa-magnifying-glass text-danger"></i>
                </span>
                <input
                  v-model="searchQuery"
                  @input="handleFilterChange"
                  type="text"
                  class="form-control border-0 bg-light py-2 ps-1 pe-2 shadow-none font-sm"
                  :placeholder="langStore.isEnglish ? 'Search dish name, ingredients...' : 'Tìm kiếm tên món ăn, đặc sản...'"
                />
                <button
                  v-if="searchQuery"
                  type="button"
                  class="btn btn-link text-muted p-0 pe-3 text-decoration-none font-xs d-flex align-items-center"
                  @click="clearSearch"
                  title="Xóa tìm kiếm"
                >
                  <i class="fa-solid fa-circle-xmark fs-6"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Sort Selector -->
          <div class="col-lg-3 col-md-6">
            <select
              v-model="selectedSort"
              @change="handleFilterChange"
              class="form-select form-select-sm py-2 rounded-pill font-xs border shadow-2xs text-secondary fw-semibold"
            >
              <option value="DEFAULT">{{ langStore.isEnglish ? 'Sort: Default' : 'Sắp xếp: Mặc định' }}</option>
              <option value="PRICE_ASC">{{ langStore.isEnglish ? 'Price: Low to High' : 'Giá: Thấp đến Cao' }}</option>
              <option value="PRICE_DESC">{{ langStore.isEnglish ? 'Price: High to Low' : 'Giá: Cao đến Thấp' }}</option>
              <option value="NAME_ASC">{{ langStore.isEnglish ? 'Name: A to Z' : 'Tên món: A - Z' }}</option>
            </select>
          </div>

          <!-- 3 Miền Filter (Đặc trưng nhà hàng) -->
          <div class="col-lg-5 d-flex flex-wrap gap-2 justify-content-lg-end align-items-center">
            <button
              @click="setRegion('')"
              :class="['btn btn-sm rounded-pill px-3 py-1.5 fw-bold text-nowrap font-xs', selectedRegion === '' ? 'btn-danger shadow-sm' : 'btn-outline-secondary']"
            >
              {{ langStore.isEnglish ? 'All Regions' : 'Tất cả miền' }}
            </button>
            <button
              @click="setRegion('Bắc')"
              :class="['btn btn-sm rounded-pill px-3 py-1.5 fw-bold text-nowrap font-xs', selectedRegion === 'Bắc' ? 'btn-primary shadow-sm' : 'btn-outline-primary']"
            >
              <i class="fa-solid fa-bowl-food me-1"></i> {{ langStore.isEnglish ? 'North' : 'Miền Bắc' }}
            </button>
            <button
              @click="setRegion('Trung')"
              :class="['btn btn-sm rounded-pill px-3 py-1.5 fw-bold text-nowrap font-xs', selectedRegion === 'Trung' ? 'btn-warning text-dark shadow-sm' : 'btn-outline-warning']"
            >
              <i class="fa-solid fa-pepper-hot me-1"></i> {{ langStore.isEnglish ? 'Central' : 'Miền Trung' }}
            </button>
            <button
              @click="setRegion('Nam')"
              :class="['btn btn-sm rounded-pill px-3 py-1.5 fw-bold text-nowrap font-xs', selectedRegion === 'Nam' ? 'btn-success shadow-sm' : 'btn-outline-success']"
            >
              <i class="fa-solid fa-utensils me-1"></i> {{ langStore.isEnglish ? 'South' : 'Miền Nam' }}
            </button>
          </div>
        </div>

        <!-- Row 2: Categories Filter (Đổ động từ DB Collection Categories) -->
        <div class="pt-3 border-top d-flex align-items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span class="fw-bold fs-7 text-muted me-1 text-nowrap">
            <i class="fa-solid fa-layer-group text-warning me-1"></i>{{ langStore.isEnglish ? 'Categories:' : 'Danh mục:' }}
          </span>
          <button
            @click="setCategory('')"
            :class="['btn btn-sm rounded-pill px-3 py-1 text-nowrap fw-semibold fs-7', selectedCategory === '' ? 'btn-dark' : 'btn-light border']"
          >
            {{ langStore.isEnglish ? 'All Categories' : 'Tất cả danh mục' }}
          </button>
          <button
            v-for="cat in menuStore.categories"
            :key="cat._id"
            @click="setCategory(cat._id)"
            :class="['btn btn-sm rounded-pill px-3 py-1 text-nowrap fw-semibold fs-7', selectedCategory === cat._id ? 'btn-danger shadow-sm' : 'btn-light border']"
          >
            {{ cat.name }}
          </button>
        </div>

        <!-- Active Search / Filter Summary Bar -->
        <div v-if="searchQuery || selectedRegion || selectedCategory" class="pt-2 mt-2 border-top d-flex justify-content-between align-items-center font-xs text-muted">
          <div>
            <span class="fw-bold text-danger"><i class="fa-solid fa-filter me-1"></i>Kết quả:</span>
            Tìm thấy <strong>{{ filteredDishes.length }}</strong> món ăn
            <span v-if="searchQuery">với từ khóa <strong class="text-dark">"{{ searchQuery }}"</strong></span>
            <span v-if="selectedRegion">thuộc <strong>Miền {{ selectedRegion }}</strong></span>
          </div>
          <button @click="resetFilters" class="btn btn-link text-danger font-xs text-decoration-none p-0 fw-bold">
            <i class="fa-solid fa-xmark me-1"></i> Xóa bộ lọc
          </button>
        </div>
      </div>

      <!-- Skeleton Loading State -->
      <DishSkeletonCard
        v-if="menuStore.loading"
        :count="8"
        col-class="col-xl-3 col-lg-4 col-md-6"
      />

      <!-- Dishes Grid -->
      <div v-else-if="paginatedDishes.length > 0">
        <div class="row g-4 mb-4">
          <div v-for="dish in paginatedDishes" :key="dish._id" class="col-xl-3 col-lg-4 col-md-6">
            <div class="card border-0 rounded-4 shadow-sm overflow-hidden h-100 glass-card hover-lift bg-white">
              <div class="position-relative bg-light" style="height: 190px;">
                <img
                  :src="getImageUrl(dish.image)"
                  :alt="dish.name"
                  class="w-100 h-100 object-fit-cover"
                />
                <!-- Nút Yêu Thích (Favorite Button) -->
                <button
                  type="button"
                  @click.stop.prevent="handleToggleFav(dish)"
                  class="btn btn-light btn-sm rounded-circle position-absolute top-0 start-0 m-3 shadow-sm p-0 d-flex align-items-center justify-content-center fav-btn"
                  style="width: 32px; height: 32px; z-index: 2;"
                  :title="authStore.isFavorite(dish._id) ? 'Bỏ yêu thích' : 'Yêu thích món này'"
                >
                  <i :class="[authStore.isFavorite(dish._id) ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart text-secondary']"></i>
                </button>
                <span
                  :class="[
                    'badge position-absolute top-0 end-0 m-3 px-2.5 py-1.5 rounded-pill fs-8 shadow-sm',
                    dish.region === 'Bắc' ? 'bg-primary' : dish.region === 'Trung' ? 'bg-warning text-dark' : 'bg-success'
                  ]"
                >
                  {{ langStore.isEnglish ? 'Region ' : 'Miền ' }}{{ dish.region }}
                </span>
                <span v-if="dish.category" class="badge bg-dark bg-opacity-75 position-absolute bottom-0 start-0 m-3 px-2 py-1 fs-8 rounded-2">
                  {{ dish.category.name || 'Seafood' }}
                </span>
              </div>

              <div class="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                  <h6 class="fw-bold text-dark mb-2 brand-font fs-6">{{ dish.name }}</h6>
                  <p class="text-muted small line-clamp-2 mb-3 leading-snug">{{ dish.description }}</p>
                </div>
                <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-auto">
                  <span class="fw-bold text-danger fs-5">{{ dish.price.toLocaleString('vi-VN') }}đ</span>
                  <router-link :to="`/mon-an/${dish.slug}`" class="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold">
                    {{ langStore.isEnglish ? 'Detail' : 'Chi Tiết' }} <i class="fa-solid fa-chevron-right fs-8 ms-1"></i>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PAGINATION BAR (12 món / trang) -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center pt-3 border-top gap-3">
          <div class="text-muted small">
            {{ langStore.isEnglish ? 'Showing dishes' : 'Hiển thị món' }} <strong>{{ startIndex + 1 }} - {{ Math.min(endIndex, filteredDishes.length) }}</strong> {{ langStore.isEnglish ? 'of' : 'trong tổng số' }} <strong>{{ filteredDishes.length }}</strong> {{ langStore.isEnglish ? 'dishes' : 'món ăn' }}
          </div>

          <nav v-if="totalPages > 1" aria-label="Phân trang món ăn">
            <ul class="pagination pagination-sm mb-0 gap-1 align-items-center">
              <!-- Nút Trang Trước -->
              <li :class="['page-item', currentPage <= 1 ? 'disabled' : '']">
                <button
                  @click="prevPage"
                  :disabled="currentPage <= 1"
                  class="page-item-btn rounded-circle"
                  title="Trang trước"
                >
                  <i class="fa-solid fa-chevron-left"></i>
                </button>
              </li>

              <!-- Danh sách số trang -->
              <li v-for="page in totalPages" :key="page" :class="['page-item', currentPage === page ? 'active' : '']">
                <button
                  @click="goToPage(page)"
                  :class="['page-item-btn rounded-circle fw-bold', currentPage === page ? 'btn-danger text-white border-danger shadow-2xs' : '']"
                >
                  {{ page }}
                </button>
              </li>

              <!-- Nút Trang Sau (Bị khóa khi đến trang cuối) -->
              <li :class="['page-item', currentPage >= totalPages ? 'disabled' : '']">
                <button
                  @click="nextPage"
                  :disabled="currentPage >= totalPages"
                  class="page-item-btn rounded-circle"
                  title="Trang tiếp theo"
                >
                  <i class="fa-solid fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <!-- Empty State (Chỉ hiện khi bộ lọc không khớp món nào) -->
      <div v-else class="text-center py-5 glass-card rounded-5 bg-white shadow-sm">
        <i class="fa-solid fa-utensils display-2 text-muted mb-3 d-block"></i>
        <h4 class="fw-bold text-dark">{{ langStore.isEnglish ? 'No Dishes Found' : 'Không Tìm Thấy Món Ăn Nào' }}</h4>
        <p class="text-muted small">{{ langStore.isEnglish ? 'Please try selecting another region or category' : 'Vui lòng thử chọn lại vùng miền hoặc danh mục khác' }}</p>
        <button @click="resetFilters" class="btn btn-outline-danger rounded-pill px-4 btn-sm">
          {{ langStore.isEnglish ? 'Reset Filters' : 'Thiết Lập Lại Bộ Lọc' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useMenuStore } from "../../stores/menuStore";
import { useLangStore } from "../../stores/langStore";
import { useAuthStore } from "../../stores/authStore";
import { useRoute, useRouter } from "vue-router";
import { getImageUrl } from "../../utils/imageHelper";
import { toast } from "../../composables/useToast";
import DishSkeletonCard from "../../components/common/DishSkeletonCard.vue";

const menuStore = useMenuStore();
const langStore = useLangStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const searchQuery = ref(route.query.search || route.query.q || "");
const selectedRegion = ref(route.query.region || "");
const selectedCategory = ref(route.query.category || "");
const selectedSort = ref("DEFAULT");
const currentPage = ref(1);
const itemsPerPage = 12;

const removeVietnameseTones = (str) => {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

const handleToggleFav = async (dish) => {
  if (!authStore.isAuthenticated) {
    toast.info("Vui lòng đăng nhập để lưu món ăn yêu thích!");
    router.push("/dang-nhap");
    return;
  }
  try {
    const res = await authStore.toggleFavorite(dish._id);
    toast.success(res.message);
  } catch (err) {
    toast.error(err.message);
  }
};

const handleFilterChange = () => {
  currentPage.value = 1;
};

const setRegion = (region) => {
  selectedRegion.value = region;
  handleFilterChange();
};

const setCategory = (categoryId) => {
  selectedCategory.value = categoryId;
  handleFilterChange();
};

const clearSearch = () => {
  searchQuery.value = "";
  handleFilterChange();
  if (route.query.search || route.query.q) {
    const q = { ...route.query };
    delete q.search;
    delete q.q;
    router.replace({ query: q });
  }
};

const resetFilters = () => {
  searchQuery.value = "";
  selectedRegion.value = "";
  selectedCategory.value = "";
  selectedSort.value = "DEFAULT";
  currentPage.value = 1;
  router.replace({ query: {} });
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

  // 7. BONUS ĐỘ CÔ ĐỌNG:
  if (score >= 100) {
    score += Math.max(0, 30 - Math.floor(cleanName.length / 2));
  }

  return score;
};

const filteredDishes = computed(() => {
  const rawQ = searchQuery.value.trim();
  const q = rawQ.toLowerCase();
  const cleanQ = removeVietnameseTones(q);

  let list = (menuStore.dishes || []).filter((dish) => {
    if (selectedRegion.value && dish.region !== selectedRegion.value) {
      return false;
    }
    if (selectedCategory.value) {
      const catId = typeof dish.category === "object" ? dish.category?._id : dish.category;
      if (catId !== selectedCategory.value) return false;
    }
    if (rawQ) {
      const score = calculateRelevanceScore(dish, q, cleanQ);
      return score > 0;
    }
    return true;
  });

  if (selectedSort.value === "PRICE_ASC") {
    list.sort((a, b) => a.price - b.price);
  } else if (selectedSort.value === "PRICE_DESC") {
    list.sort((a, b) => b.price - a.price);
  } else if (selectedSort.value === "NAME_ASC") {
    list.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  } else if (rawQ) {
    // Mặc định khi có tìm kiếm: Sắp xếp theo điểm khớp (Relevance score) từ cao xuống thấp
    list.sort((a, b) => {
      const scoreA = calculateRelevanceScore(a, q, cleanQ);
      const scoreB = calculateRelevanceScore(b, q, cleanQ);
      return scoreB - scoreA;
    });
  }

  return list;
});

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.search !== undefined) {
      searchQuery.value = newQuery.search || "";
    } else if (newQuery.q !== undefined) {
      searchQuery.value = newQuery.q || "";
    }
    if (newQuery.region !== undefined) {
      selectedRegion.value = newQuery.region || "";
    }
    if (newQuery.category !== undefined) {
      selectedCategory.value = newQuery.category || "";
    }
    handleFilterChange();
  }
);

const totalPages = computed(() => Math.max(1, Math.ceil(filteredDishes.value.length / itemsPerPage)));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);

const paginatedDishes = computed(() => {
  return filteredDishes.value.slice(startIndex.value, endIndex.value);
});

// Điều hướng trang an toàn có chốt chặn biên
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 220, behavior: "smooth" });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo({ top: 220, behavior: "smooth" });
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 220, behavior: "smooth" });
  }
};

// Tự động kiểm tra ép trang về phạm vi hợp lệ khi bộ lọc thay đổi
watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = newTotal;
  }
  if (currentPage.value < 1) {
    currentPage.value = 1;
  }
});

onMounted(() => {
  menuStore.fetchCategories();
  menuStore.fetchDishes();
});
</script>

<style scoped>
.page-item-btn {
  width: 34px;
  height: 34px;
  border: 1px solid #dee2e6;
  background: white;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  cursor: pointer;
}
.page-item-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #dc3545;
  color: #dc3545;
}
.page-item-btn:disabled,
.page-item.disabled .page-item-btn {
  opacity: 0.35;
  cursor: not-allowed !important;
  background: #f1f5f9;
  border-color: #e2e8f0;
  color: #94a3b8;
  pointer-events: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>
