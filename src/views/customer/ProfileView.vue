<template>
  <div class="py-5 bg-light min-vh-100">
    <div class="container max-w-6xl">
      <!-- ═══ HEADER ═══ -->
      <div class="text-center max-w-2xl mx-auto mb-4">
        <span class="badge bg-danger bg-opacity-10 text-danger px-3 py-1.5 rounded-pill fw-bold mb-2 fs-8 text-uppercase">
          <i class="fa-solid fa-user-gear me-1"></i> {{ langStore.t('profile.badge') }}
        </span>
        <h1 class="display-6 fw-bold brand-font text-dark mb-1">{{ langStore.t('profile.title') }}</h1>
        <p class="text-muted small mb-0">{{ langStore.t('profile.subtitle') }}</p>
      </div>

      <div class="row g-4">
        <!-- ═══ CỘT TRÁI (COL-LG-4): THẺ THÀNH VIÊN VIP & MENU ĐIỀU HƯỚNG ═══ -->
        <div class="col-lg-4 col-md-5">
          <!-- 1. Thẻ thành viên VIP Card -->
          <div class="vip-member-card p-4 rounded-4 text-white position-relative overflow-hidden mb-3 shadow">
            <div class="vip-bg-decor"></div>
            <div class="d-flex justify-content-between align-items-center position-relative z-1 mb-3">
              <span class="badge bg-dark bg-opacity-40 text-white border border-warning border-opacity-30 rounded-pill px-3 py-1.5 fs-8 fw-bold">
                <i class="fa-solid fa-crown text-warning me-1.5"></i>
                {{ rankInfo?.currentRank?.name || (langStore.isEnglish ? 'Bronze Tier' : 'Hạng Đồng') }}
              </span>
              <span class="badge bg-warning text-dark rounded-pill px-2.5 py-1 fs-8 fw-bold shadow-2xs">
                {{ langStore.isEnglish ? 'Discount' : 'Ưu đãi' }} {{ rankInfo?.currentRank?.discountPercent || 0 }}%
              </span>
            </div>

            <!-- Avatar + Name -->
            <div class="d-flex align-items-center gap-3 position-relative z-1 mb-3">
              <div class="vip-avatar-box rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow">
                <i class="fa-solid fa-user fs-4 text-white"></i>
              </div>
              <div class="min-w-0">
                <div class="d-flex align-items-center gap-1.5">
                  <h5 class="fw-bold mb-0 text-white text-truncate brand-font">{{ profile.name || '---' }}</h5>
                  <span v-if="authStore.user?.role && authStore.user.role !== 'customer'" class="badge bg-danger text-white rounded-pill px-1.5 py-0.5 fs-9 text-uppercase">
                    {{ authStore.user.role }}
                  </span>
                </div>
                <small class="text-white-50 fs-8 d-block text-truncate">{{ profile.email || '---' }}</small>
                <small class="text-warning fs-8 fw-semibold" v-if="profile.phone">
                  <i class="fa-solid fa-phone me-1"></i>{{ profile.phone }}
                </small>
              </div>
            </div>

            <!-- Total Spent & Progress -->
            <div class="pt-3 border-top border-white border-opacity-15 position-relative z-1">
              <div class="d-flex justify-content-between align-items-center small mb-1.5">
                <span class="text-white-50 fs-8">{{ langStore.t('profile.totalSpent') }}:</span>
                <strong class="text-warning fs-7">{{ (profile.totalSpent || 0).toLocaleString('vi-VN') }}đ</strong>
              </div>

              <!-- Progress bar to next rank -->
              <div v-if="rankInfo?.nextRank">
                <div class="progress rounded-pill bg-dark bg-opacity-40" style="height: 6px;">
                  <div
                    class="progress-bar bg-warning"
                    role="progressbar"
                    :style="{ width: Math.min(100, ((profile.totalSpent / (rankInfo.nextRank.minSpent || 1)) * 100)) + '%' }"
                  ></div>
                </div>
                <div class="d-flex justify-content-between fs-9 text-white-50 mt-1">
                  <span>{{ langStore.isEnglish ? 'Next rank:' : 'Lên hạng:' }} <strong>{{ rankInfo.nextRank.name }}</strong></span>
                  <span class="text-warning fw-semibold">{{ (rankInfo.amountToNextRank || 0).toLocaleString('vi-VN') }}đ</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Menu Điều Hướng Dọc (Vertical Tab Menu) -->
          <div class="glass-card p-2.5 rounded-4 bg-white border shadow-2xs mb-3">
            <div class="d-flex flex-column gap-1">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                @click="activeTab = tab.key"
                :class="[
                  'profile-nav-btn btn text-start d-flex align-items-center justify-content-between px-3 py-2.5 rounded-3 border-0 transition-all',
                  activeTab === tab.key ? 'active-tab' : 'text-secondary hover-bg'
                ]"
              >
                <div class="d-flex align-items-center gap-2.5">
                  <div :class="['tab-icon-box rounded-3 d-flex align-items-center justify-content-center', activeTab === tab.key ? 'bg-white text-danger' : 'bg-light text-muted']">
                    <i :class="tab.icon"></i>
                  </div>
                  <span class="fw-semibold fs-7">{{ langStore.t('profile.' + tab.key) || tab.title }}</span>
                </div>
                <span v-if="tab.badge" :class="['badge rounded-pill fs-9 px-2 py-0.5', activeTab === tab.key ? 'bg-white text-danger' : 'bg-light text-muted border']">
                  {{ tab.badge }}
                </span>
                <i v-else class="fa-solid fa-chevron-right fs-9 opacity-50"></i>
              </button>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="d-flex gap-2">
            <router-link to="/dat-ban" class="btn btn-outline-danger btn-sm rounded-pill flex-grow-1 fw-semibold py-2">
              <i class="fa-solid fa-calendar-plus me-1"></i> {{ langStore.isEnglish ? 'Book Table' : 'Đặt Bàn Ngay' }}
            </router-link>
            <button @click="handleLogout" class="btn btn-light btn-sm rounded-pill px-3 py-2 text-muted fw-medium border" title="Đăng xuất">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        </div>

        <!-- ═══ CỘT PHẢI (COL-LG-8): CHI TIẾT TỪNG TAB NỘI DUNG ═══ -->
        <div class="col-lg-8 col-md-7">
          <!-- ── TAB 1: THÔNG TIN CÁ NHÂN ── -->
          <div v-if="activeTab === 'info'" class="glass-card p-4 rounded-4 bg-white border shadow-2xs">
            <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div>
                <h5 class="fw-bold brand-font text-dark mb-0">
                  <i class="fa-solid fa-user-pen text-danger me-2"></i>{{ langStore.isEnglish ? 'Personal Information' : 'Thông Tin Cá Nhân & Liên Hệ' }}
                </h5>
                <small class="text-muted fs-8">{{ langStore.isEnglish ? 'Update your display name and contact phone number.' : 'Cập nhật họ tên và số điện thoại liên lạc khi đặt bàn.' }}</small>
              </div>
            </div>

            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-dark">
                  {{ langStore.isEnglish ? 'Full Name' : 'Họ và tên' }} <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light text-muted border-end-0"><i class="fa-solid fa-user"></i></span>
                  <input v-model="profile.name" type="text" class="form-control border-start-0 fs-7 py-2.5" placeholder="Nhập họ và tên..." />
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold fs-7 text-dark">
                  {{ langStore.isEnglish ? 'Phone Number' : 'Số điện thoại' }} <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light text-muted border-end-0"><i class="fa-solid fa-phone"></i></span>
                  <input v-model="profile.phone" type="tel" class="form-control border-start-0 fs-7 py-2.5" placeholder="Ví dụ: 0988776655" />
                </div>
              </div>

              <div class="col-12">
                <label class="form-label fw-semibold fs-7 text-dark">
                  {{ langStore.isEnglish ? 'Email Address' : 'Địa chỉ Email' }}
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light text-muted border-end-0"><i class="fa-solid fa-envelope"></i></span>
                  <input :value="profile.email" type="email" class="form-control border-start-0 fs-7 py-2.5 bg-light text-muted" disabled />
                  <span class="input-group-text bg-light text-success border-start-0 fs-8 fw-semibold">
                    <i class="fa-solid fa-circle-check me-1"></i> {{ langStore.isEnglish ? 'Verified' : 'Đã kích hoạt' }}
                  </span>
                </div>
                <small class="text-muted fs-9 d-block mt-1">
                  {{ langStore.isEnglish ? 'Email is tied to your account authentication.' : 'Email gắn liền với tài khoản đăng nhập và không thể thay đổi.' }}
                </small>
              </div>
            </div>

            <div class="d-flex justify-content-end pt-2 border-top">
              <button @click="saveInfo" :disabled="saving" class="btn btn-danger rounded-pill px-4 py-2.5 fw-bold shadow-sm">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fa-solid fa-floppy-disk me-1.5"></i>
                {{ langStore.isEnglish ? 'Save Changes' : 'Lưu Thay Đổi Thông Tin' }}
              </button>
            </div>
          </div>

          <!-- ── TAB 2: LỊCH SỬ HÓA ĐƠN DÙNG BỮA (E-RECEIPT HISTORY) ── -->
          <div v-else-if="activeTab === 'invoices'" class="glass-card p-4 rounded-4 bg-white border shadow-2xs">
            <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div>
                <h5 class="fw-bold brand-font text-dark mb-0">
                  <i class="fa-solid fa-file-invoice-dollar text-danger me-2"></i>{{ langStore.isEnglish ? 'Dining & Invoice History' : 'Lịch Sử Hóa Đơn Dùng Bữa' }}
                </h5>
                <small class="text-muted fs-8">{{ langStore.isEnglish ? 'Track all completed dining bills and view/print e-receipts.' : 'Theo dõi toàn bộ các bữa ăn đã hoàn tất thanh toán và tải/in hóa đơn điện tử.' }}</small>
              </div>
              <span class="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1 fs-8 fw-bold">
                {{ invoices.length }} {{ langStore.isEnglish ? 'invoices' : 'hóa đơn' }}
              </span>
            </div>

            <div v-if="invoicesLoading" class="text-center py-5">
              <div class="spinner-border text-danger spinner-border-sm me-2" role="status"></div>
              <span class="text-muted small">Đang tải lịch sử hóa đơn...</span>
            </div>

            <div v-else-if="invoices.length === 0" class="text-center py-5 text-muted">
              <i class="fa-solid fa-receipt display-6 text-secondary opacity-40 mb-2 d-block"></i>
              <p class="small mb-3">{{ langStore.isEnglish ? 'No paid invoices found yet.' : 'Bạn chưa có hóa đơn dùng bữa nào.' }}</p>
              <router-link to="/dat-ban" class="btn btn-danger btn-sm rounded-pill px-4 fw-bold">
                <i class="fa-solid fa-utensils me-1"></i> {{ langStore.isEnglish ? 'Book Table Now' : 'Đặt Bàn Trải Nghiệm Ngay' }}
              </router-link>
            </div>

            <div v-else class="d-flex flex-column gap-3">
              <div
                v-for="inv in invoices"
                :key="inv._id"
                class="p-3.5 rounded-4 border bg-white shadow-2xs hover-border-danger transition-all"
              >
                <div class="d-flex justify-content-between align-items-start gap-2 flex-wrap mb-2 pb-2 border-bottom">
                  <div>
                    <div class="d-flex align-items-center gap-2 mb-1">
                      <strong class="brand-font text-danger fs-6">{{ inv.invoiceCode }}</strong>
                      <span class="badge bg-success bg-opacity-15 text-success rounded-pill px-2.5 py-0.5 fs-9 fw-bold">
                        <i class="fa-solid fa-circle-check me-1"></i>Đã thanh toán
                      </span>
                    </div>
                    <small class="text-muted fs-8 d-block">
                      <i class="fa-solid fa-calendar-check me-1 text-secondary"></i>
                      {{ inv.paidAt ? new Date(inv.paidAt).toLocaleString('vi-VN') : new Date(inv.createdAt).toLocaleString('vi-VN') }}
                      <span v-if="inv.diningSession?.tables?.length">
                        · {{ inv.diningSession.tables.map(t => 'Bàn ' + (t.tableNumber || t)).join(', ') }}
                      </span>
                    </small>
                  </div>

                  <div class="text-end">
                    <span class="text-muted fs-9 d-block">Thực trả</span>
                    <strong class="text-dark brand-font fs-6">{{ (inv.finalAmount || 0).toLocaleString('vi-VN') }}đ</strong>
                  </div>
                </div>

                <!-- Invoice Summary Row -->
                <div class="d-flex justify-content-between align-items-center gap-2 flex-wrap">
                  <div class="d-flex align-items-center gap-2 small text-muted">
                    <span class="badge bg-light text-secondary border rounded-pill px-2.5 py-1 fs-9">
                      {{ paymentMethodLabel(inv.paymentMethod) }}
                    </span>
                    <span v-if="inv.discountAmount > 0" class="text-success fs-9 fw-semibold">
                      <i class="fa-solid fa-tag me-0.5"></i>-{{ inv.discountAmount.toLocaleString('vi-VN') }}đ
                    </span>
                    <span v-if="inv.depositDeducted > 0" class="text-primary fs-9 fw-semibold">
                      <i class="fa-solid fa-money-bill-transfer me-0.5"></i>Đã trừ cọc {{ inv.depositDeducted.toLocaleString('vi-VN') }}đ
                    </span>
                  </div>

                  <div class="d-flex align-items-center gap-2">
                    <button
                      @click="viewInvoice(inv)"
                      class="btn btn-outline-danger btn-sm rounded-pill px-3 fs-8 fw-bold"
                    >
                      <i class="fa-solid fa-receipt me-1"></i> Xem & In Hóa Đơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── TAB 3: MÓN ĂN YÊU THÍCH (FAVORITE DISHES) ── -->
          <div v-else-if="activeTab === 'favorites'" class="glass-card p-4 rounded-4 bg-white border shadow-2xs">
            <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div>
                <h5 class="fw-bold brand-font text-dark mb-0">
                  <i class="fa-solid fa-heart text-danger me-2"></i>{{ langStore.isEnglish ? 'My Favorite Dishes' : 'Danh Sách Món Ăn Yêu Thích' }}
                </h5>
                <small class="text-muted fs-8">{{ langStore.isEnglish ? 'Your saved seafood specialties for quick re-ordering.' : 'Các món đặc sản bạn đã bấm yêu thích để đặt bàn thưởng thức nhanh.' }}</small>
              </div>
              <span class="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1 fs-8 fw-bold">
                {{ favoriteDishes.length }} {{ langStore.isEnglish ? 'dishes' : 'món' }}
              </span>
            </div>

            <div v-if="favoritesLoading" class="text-center py-5">
              <div class="spinner-border text-danger spinner-border-sm me-2" role="status"></div>
              <span class="text-muted small">Đang tải danh sách món yêu thích...</span>
            </div>

            <div v-else-if="favoriteDishes.length === 0" class="text-center py-5 text-muted">
              <i class="fa-solid fa-heart-crack display-6 text-secondary opacity-40 mb-2 d-block"></i>
              <p class="small mb-3">{{ langStore.isEnglish ? 'You have no favorite dishes yet.' : 'Bạn chưa lưu món ăn yêu thích nào.' }}</p>
              <router-link to="/thuc-don" class="btn btn-danger btn-sm rounded-pill px-4 fw-bold">
                <i class="fa-solid fa-utensils me-1"></i> {{ langStore.isEnglish ? 'Explore Menu' : 'Khám Phá Thực Đơn Ngay' }}
              </router-link>
            </div>

            <div v-else class="row g-3">
              <div v-for="dish in favoriteDishes" :key="dish._id" class="col-md-6">
                <div class="card border rounded-4 overflow-hidden h-100 shadow-2xs hover-lift transition-all bg-white">
                  <div class="position-relative" style="height: 140px;">
                    <img
                      :src="getImageUrl(dish.image)"
                      :alt="dish.name"
                      class="w-100 h-100 object-fit-cover"
                      onerror="this.src='/images/dishes/default-dish.jpg'"
                    />
                    <span
                      :class="[
                        'badge position-absolute top-0 end-0 m-2.5 px-2 py-1 rounded-pill fs-9 shadow-sm fw-bold',
                        dish.region === 'Bắc' ? 'bg-primary' : dish.region === 'Trung' ? 'bg-warning text-dark' : 'bg-success'
                      ]"
                    >
                      Miền {{ dish.region }}
                    </span>
                    <button
                      type="button"
                      @click="removeFavorite(dish._id)"
                      class="btn btn-danger btn-sm rounded-circle position-absolute top-0 start-0 m-2.5 shadow-sm p-0 d-flex align-items-center justify-content-center"
                      style="width: 28px; height: 28px;"
                      title="Bỏ thích món này"
                    >
                      <i class="fa-solid fa-heart text-white fs-9"></i>
                    </button>
                  </div>

                  <div class="p-3 d-flex flex-column justify-content-between flex-grow-1">
                    <div>
                      <h6 class="fw-bold text-dark mb-1 brand-font fs-7 text-truncate">{{ dish.name }}</h6>
                      <span class="text-danger fw-bold fs-7">{{ (dish.price || 0).toLocaleString('vi-VN') }}đ</span>
                    </div>

                    <div class="d-flex justify-content-between align-items-center gap-2 pt-2.5 mt-2 border-top">
                      <router-link
                        :to="`/mon-an/${dish.slug || dish._id}`"
                        class="btn btn-light btn-sm rounded-pill px-3 fs-9 fw-bold text-secondary border flex-grow-1"
                      >
                        <i class="fa-solid fa-eye me-1"></i> Chi Tiết
                      </router-link>
                      <router-link
                        to="/dat-ban"
                        class="btn btn-danger btn-sm rounded-pill px-3 fs-9 fw-bold flex-grow-1 shadow-2xs"
                      >
                        <i class="fa-solid fa-calendar-plus me-1"></i> Đặt Bàn
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── TAB 4: LỊCH SỬ ĐẶT BÀN ── -->
          <div v-else-if="activeTab === 'history'" class="glass-card p-4 rounded-4 bg-white border shadow-2xs">
            <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div>
                <h5 class="fw-bold brand-font text-dark mb-0">
                  <i class="fa-solid fa-clock-rotate-left text-danger me-2"></i>{{ langStore.isEnglish ? 'Reservation History' : 'Lịch Sử Đặt Bàn Gần Đây' }}
                </h5>
                <small class="text-muted fs-8">{{ langStore.isEnglish ? 'All your table bookings and pre-orders at 3 Miền Cua.' : 'Toàn bộ các đơn đặt bàn, món ăn đặt trước của bạn.' }}</small>
              </div>
              <span class="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-1 fs-8 fw-bold">
                {{ reservations.length }} {{ langStore.isEnglish ? 'bookings' : 'lượt đặt' }}
              </span>
            </div>

            <div v-if="reservations.length === 0" class="text-center py-5 text-muted">
              <i class="fa-solid fa-calendar-xmark display-6 text-secondary opacity-40 mb-2 d-block"></i>
              <p class="small mb-3">{{ langStore.isEnglish ? 'No reservations found.' : 'Bạn chưa có lượt đặt bàn nào.' }}</p>
              <router-link to="/dat-ban" class="btn btn-danger rounded-pill px-4 fw-bold">
                <i class="fa-solid fa-calendar-check me-1"></i> {{ langStore.isEnglish ? 'Book Table Now' : 'Đặt Bàn Ngay' }}
              </router-link>
            </div>

            <div v-else class="d-flex flex-column gap-2.5">
              <div
                v-for="r in reservations"
                :key="r._id"
                class="p-3 rounded-4 border bg-white shadow-2xs d-flex align-items-center justify-content-between gap-3 flex-wrap hover-border-danger transition-all"
              >
                <div class="d-flex align-items-center gap-3">
                  <div class="p-2.5 bg-danger bg-opacity-10 text-danger rounded-3 text-center" style="min-width: 48px;">
                    <i class="fa-solid fa-calendar-day fs-5"></i>
                  </div>
                  <div>
                    <div class="d-flex align-items-center gap-2 mb-0.5">
                      <strong class="text-dark brand-font fs-7">{{ r.reservationCode }}</strong>
                      <span :class="['badge rounded-pill px-2 py-0.5 fs-9 fw-semibold', statusClass(r.status)]">
                        {{ statusLabel(r.status) }}
                      </span>
                    </div>
                    <small class="text-muted fs-8 d-block">
                      <i class="fa-solid fa-clock me-1 text-danger"></i>
                      {{ new Date(r.startAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) }}
                      · {{ r.guestsCount }} {{ langStore.isEnglish ? 'pax' : 'khách' }}
                      <span v-if="r.tables?.length">· {{ r.tables.map(t => 'Bàn ' + (t.tableNumber || t)).join(', ') }}</span>
                    </small>
                  </div>
                </div>

                <div class="d-flex align-items-center gap-2 flex-wrap">
                  <router-link
                    v-if="r.status === 'ARRIVED'"
                    :to="`/goi-mon?session=${r.session?.sessionCode || r.sessionCode || r.reservationCode}`"
                    class="btn btn-danger btn-sm rounded-pill px-3 fs-8 fw-bold shadow-2xs"
                  >
                    <i class="fa-solid fa-utensils me-1"></i>
                    {{ langStore.isEnglish ? 'Order Dishes' : 'Gọi Món Tại Bàn' }}
                  </router-link>
                  <router-link :to="`/tra-cuu?code=${r.reservationCode}`" class="btn btn-outline-danger btn-sm rounded-pill px-3 fs-8 fw-semibold">
                    <i class="fa-solid fa-receipt me-1"></i>
                    {{ langStore.isEnglish ? 'View Receipt' : 'Chi Tiết & Hóa Đơn' }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- ── TAB 5: SỔ ĐỊA CHỈ ── -->
          <div v-else-if="activeTab === 'address'" class="glass-card p-4 rounded-4 bg-white border shadow-2xs">
            <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div>
                <h5 class="fw-bold brand-font text-dark mb-0">
                  <i class="fa-solid fa-map-location-dot text-danger me-2"></i>{{ langStore.isEnglish ? 'Address Book' : 'Sổ Địa Chỉ Giao Hàng & Nhận Quà' }}
                </h5>
                <small class="text-muted fs-8">{{ langStore.isEnglish ? 'Manage your delivery and member gift addresses.' : 'Quản lý địa chỉ giao món tận nơi hoặc quà tri ân thành viên.' }}</small>
              </div>
              <button @click="addAddress" class="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold">
                <i class="fa-solid fa-plus me-1"></i> {{ langStore.isEnglish ? 'Add Address' : 'Thêm Địa Chỉ' }}
              </button>
            </div>

            <div v-if="profile.addresses.length === 0" class="text-center py-5 text-muted">
              <i class="fa-solid fa-location-dot display-6 text-secondary opacity-40 mb-2 d-block"></i>
              <p class="small mb-2">{{ langStore.isEnglish ? 'No saved addresses yet.' : 'Bạn chưa lưu địa chỉ nào.' }}</p>
              <button @click="addAddress" class="btn btn-danger btn-sm rounded-pill px-3 fw-bold">
                <i class="fa-solid fa-plus me-1"></i> {{ langStore.isEnglish ? 'Add First Address' : 'Thêm Địa Chỉ Đầu Tiên' }}
              </button>
            </div>

            <div v-else class="d-flex flex-column gap-3 mb-3">
              <div v-for="(addr, idx) in profile.addresses" :key="idx" class="p-3 rounded-4 border bg-light bg-opacity-40">
                <div class="d-flex justify-content-between align-items-center mb-2 pb-1.5 border-bottom">
                  <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-danger rounded-pill px-2.5 py-1 fs-9 fw-bold">#{{ idx + 1 }}</span>
                    <input v-model="addr.title" type="text" class="form-control form-control-sm fw-bold border-0 bg-transparent p-0" placeholder="Tên gợi nhớ (Nhà riêng, Cơ quan...)" style="max-width: 220px;" />
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <div class="form-check m-0">
                      <input v-model="addr.isDefault" type="checkbox" class="form-check-input" :id="`def-${idx}`" />
                      <label class="form-check-label fs-9 fw-semibold text-muted cursor-pointer" :for="`def-${idx}`">
                        {{ langStore.isEnglish ? 'Default' : 'Mặc định' }}
                      </label>
                    </div>
                    <button @click="removeAddress(idx)" class="btn btn-outline-danger btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center" style="width: 26px; height: 26px;" title="Xóa">
                      <i class="fa-solid fa-trash-can fs-9"></i>
                    </button>
                  </div>
                </div>

                <div class="row g-2">
                  <div class="col-12">
                    <input v-model="addr.addressDetail" type="text" class="form-control form-control-sm fs-8" placeholder="Số nhà, tên đường chi tiết..." />
                  </div>
                  <div class="col-md-4">
                    <input v-model="addr.ward" type="text" class="form-control form-control-sm fs-8" placeholder="Phường / Xã" />
                  </div>
                  <div class="col-md-4">
                    <input v-model="addr.district" type="text" class="form-control form-control-sm fs-8" placeholder="Quận / Huyện" />
                  </div>
                  <div class="col-md-4">
                    <input v-model="addr.city" type="text" class="form-control form-control-sm fs-8" placeholder="Tỉnh / Thành phố" />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="profile.addresses.length > 0" class="d-flex justify-content-end pt-2 border-top">
              <button @click="saveInfo" :disabled="saving" class="btn btn-danger rounded-pill px-4 py-2.5 fw-bold shadow-sm">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fa-solid fa-floppy-disk me-1.5"></i>
                {{ langStore.isEnglish ? 'Save Addresses' : 'Lưu Danh Sách Địa Chỉ' }}
              </button>
            </div>
          </div>

          <!-- ── TAB 6: ĐỔI MẬT KHẨU ── -->
          <div v-else-if="activeTab === 'password'" class="glass-card p-4 rounded-4 bg-white border shadow-2xs">
            <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div>
                <h5 class="fw-bold brand-font text-dark mb-0">
                  <i class="fa-solid fa-shield-halved text-danger me-2"></i>{{ langStore.isEnglish ? 'Security & Password' : 'Bảo Mật & Đổi Mật Khẩu' }}
                </h5>
                <small class="text-muted fs-8">{{ langStore.isEnglish ? 'Ensure your account stays secure with a strong password.' : 'Đảm bảo tài khoản được an toàn bằng mật khẩu độ dài tối thiểu 6 ký tự.' }}</small>
              </div>
            </div>

            <div class="max-w-md space-y-3 mb-4">
              <div>
                <label class="form-label fw-semibold fs-7 text-dark">
                  {{ langStore.isEnglish ? 'Current Password' : 'Mật khẩu hiện tại' }} <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light text-muted border-end-0"><i class="fa-solid fa-lock"></i></span>
                  <input
                    v-model="passwordForm.currentPassword"
                    :type="showPass ? 'text' : 'password'"
                    class="form-control border-start-0 border-end-0 fs-7 py-2.5"
                    placeholder="••••••••"
                  />
                  <button @click="showPass = !showPass" class="input-group-text bg-light text-muted border-start-0" type="button">
                    <i :class="showPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                  </button>
                </div>
              </div>

              <div>
                <label class="form-label fw-semibold fs-7 text-dark">
                  {{ langStore.isEnglish ? 'New Password' : 'Mật khẩu mới (tối thiểu 6 ký tự)' }} <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <span class="input-group-text bg-light text-muted border-end-0"><i class="fa-solid fa-key"></i></span>
                  <input
                    v-model="passwordForm.newPassword"
                    :type="showPass ? 'text' : 'password'"
                    class="form-control border-start-0 border-end-0 fs-7 py-2.5"
                    placeholder="••••••••"
                  />
                  <button @click="showPass = !showPass" class="input-group-text bg-light text-muted border-start-0" type="button">
                    <i :class="showPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-end pt-2 border-top">
              <button @click="changePassword" :disabled="saving" class="btn btn-danger rounded-pill px-4 py-2.5 fw-bold shadow-sm">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fa-solid fa-key me-1.5"></i>
                {{ langStore.isEnglish ? 'Update Password' : 'Đổi Mật Khẩu Ngay' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ E-INVOICE MODAL ═══ -->
    <EInvoiceModal
      v-if="selectedInvoice"
      :invoice="selectedInvoice"
      @close="selectedInvoice = null"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../services/api";
import { useAuthStore } from "../../stores/authStore";
import { useReservationStore } from "../../stores/reservationStore";
import { useLangStore } from "../../stores/langStore";
import { toast } from "../../composables/useToast";
import { getImageUrl } from "../../utils/imageHelper";
import EInvoiceModal from "../../components/customer/EInvoiceModal.vue";

const router = useRouter();
const authStore = useAuthStore();
const langStore = useLangStore();
const reservationStore = useReservationStore();

const activeTab = ref("info");
const saving = ref(false);
const showPass = ref(false);

const reservations = ref([]);
const invoices = ref([]);
const invoicesLoading = ref(false);
const favoriteDishes = ref([]);
const favoritesLoading = ref(false);
const selectedInvoice = ref(null);
const rankInfo = ref(null);

const profile = reactive({
  name: "",
  email: "",
  phone: "",
  totalSpent: 0,
  addresses: [],
});

const passwordForm = reactive({ currentPassword: "", newPassword: "" });

const tabs = computed(() => [
  { key: "info", title: "Thông Tin", icon: "fa-solid fa-id-card", badge: null },
  { key: "invoices", title: "Lịch Sử Hóa Đơn", icon: "fa-solid fa-file-invoice-dollar", badge: invoices.value.length ? `${invoices.value.length}` : null },
  { key: "favorites", title: "Món Yêu Thích", icon: "fa-solid fa-heart", badge: favoriteDishes.value.length ? `${favoriteDishes.value.length}` : null },
  { key: "history", title: "Lịch Sử Đặt Bàn", icon: "fa-solid fa-clock-rotate-left", badge: reservations.value.length ? `${reservations.value.length}` : null },
  { key: "address", title: "Sổ Địa Chỉ", icon: "fa-solid fa-location-dot", badge: profile.addresses.length ? `${profile.addresses.length}` : null },
  { key: "password", title: "Đổi Mật Khẩu", icon: "fa-solid fa-shield-halved", badge: null },
]);

const statusClass = (s) => ({
  CONFIRMED: "bg-success text-white",
  ARRIVED: "bg-primary text-white",
  CANCELLED: "bg-danger text-white",
  COMPLETED: "bg-secondary text-white",
  PENDING: "bg-warning text-dark",
})[s] || "bg-secondary text-white";

const statusLabel = (s) => ({
  CONFIRMED: langStore.isEnglish ? "Confirmed" : "Đã Xác Nhận",
  PENDING: langStore.isEnglish ? "Pending" : "Chờ Xác Nhận",
  ARRIVED: langStore.isEnglish ? "Seated" : "Đã Vào Bàn",
  CANCELLED: langStore.isEnglish ? "Cancelled" : "Đã Hủy",
  COMPLETED: langStore.isEnglish ? "Completed" : "Hoàn Tất",
})[s] || s;

const paymentMethodLabel = (method) => {
  switch (method) {
    case "CASH": return "Tiền mặt";
    case "BANK_TRANSFER": return "Chuyển khoản VietQR";
    case "CARD": return "Quẹt thẻ POS";
    case "MOMO": return "Ví MoMo";
    case "VNPAY": return "VNPay QR";
    default: return method || "Tiền mặt";
  }
};

const loadProfile = async () => {
  try {
    const [resUser, resRank] = await Promise.all([
      api.get("/auth/me"),
      api.get("/ranks/me").catch(() => ({ data: { data: null } })),
    ]);
    const u = resUser.data.data.user;
    profile.name = u.name || "";
    profile.email = u.email || "";
    profile.phone = u.phone || "";
    profile.totalSpent = u.totalSpent || 0;
    profile.addresses = u.addresses || [];
    authStore.user = u;
    localStorage.setItem("user", JSON.stringify(u));
    rankInfo.value = resRank.data.data;
  } catch (err) {
    toast.error("Không tải được hồ sơ: " + err.message);
  }
};

const loadInvoices = async () => {
  invoicesLoading.value = true;
  try {
    const res = await api.get("/invoices/my-invoices?limit=50");
    invoices.value = res.data.data?.invoices || [];
  } catch (err) {
    console.error("Lỗi tải hóa đơn:", err);
  } finally {
    invoicesLoading.value = false;
  }
};

const loadFavorites = async () => {
  favoritesLoading.value = true;
  try {
    const favs = await authStore.fetchFavorites();
    favoriteDishes.value = favs.filter(Boolean);
  } catch (err) {
    console.error("Lỗi tải món yêu thích:", err);
  } finally {
    favoritesLoading.value = false;
  }
};

const removeFavorite = async (dishId) => {
  try {
    await authStore.toggleFavorite(dishId);
    favoriteDishes.value = favoriteDishes.value.filter((d) => (d._id || d) !== dishId);
    toast.success("Đã bỏ món khỏi danh sách yêu thích");
  } catch (err) {
    toast.error(err.message);
  }
};

const viewInvoice = (inv) => {
  selectedInvoice.value = inv;
};

const saveInfo = async () => {
  saving.value = true;
  try {
    const res = await api.patch("/users/me", {
      name: profile.name.trim(),
      phone: profile.phone ? profile.phone.trim() : undefined,
      addresses: profile.addresses,
    });
    toast.success(langStore.isEnglish ? "Profile updated successfully!" : "Cập nhật thông tin thành công!");
    if (res.data?.data?.user) {
      authStore.user = res.data.data.user;
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
    }
    await loadProfile();
  } catch (err) {
    toast.error(err.response?.data?.message || (langStore.isEnglish ? "Update failed!" : "Cập nhật thất bại!"));
  } finally {
    saving.value = false;
  }
};

const addAddress = () => {
  profile.addresses.push({ title: "", addressDetail: "", ward: "", district: "", city: "", isDefault: false });
  activeTab.value = "address";
};

const removeAddress = (idx) => {
  profile.addresses.splice(idx, 1);
};

const changePassword = async () => {
  if (!passwordForm.currentPassword || !passwordForm.newPassword) {
    toast.error(langStore.isEnglish ? "Please enter current and new password" : "Vui lòng nhập mật khẩu hiện tại và mật khẩu mới");
    return;
  }
  if (passwordForm.newPassword.length < 6) {
    toast.error(langStore.isEnglish ? "New password must be at least 6 characters" : "Mật khẩu mới phải có tối thiểu 6 ký tự");
    return;
  }
  saving.value = true;
  try {
    await api.patch("/users/me/password", passwordForm);
    toast.success(langStore.isEnglish ? "Password changed successfully!" : "Đổi mật khẩu thành công!");
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
  } catch (err) {
    toast.error(err.response?.data?.message || (langStore.isEnglish ? "Password change failed!" : "Đổi mật khẩu thất bại!"));
  } finally {
    saving.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
  toast.success(langStore.isEnglish ? "Logged out." : "Đã đăng xuất.");
  router.push("/");
};

onMounted(async () => {
  await loadProfile();
  loadInvoices();
  loadFavorites();
  reservationStore.fetchMyReservations().then(() => {
    reservations.value = reservationStore.myReservations;
  });
});
</script>

<style scoped>
/* VIP Member Card Luxury Theme */
.vip-member-card {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #b91c1c 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.vip-bg-decor {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  pointer-events: none;
}
.vip-avatar-box {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  border: 2px solid rgba(255, 255, 255, 0.8);
}
.backdrop-blur {
  backdrop-filter: blur(8px);
}

/* Nav button styles */
.profile-nav-btn {
  font-size: 0.82rem;
}
.tab-icon-box {
  width: 32px;
  height: 32px;
  transition: all 0.2s ease;
}
.active-tab {
  background: #dc2626 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
}
.active-tab .tab-icon-box {
  background: rgba(255, 255, 255, 0.2) !important;
  color: #ffffff !important;
}
.hover-bg:hover {
  background: #f8fafc;
  color: #dc2626 !important;
}
.hover-border-danger:hover {
  border-color: #dc2626 !important;
  transform: translateY(-1px);
}
.hover-lift:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08) !important;
}
.shadow-2xs {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}
</style>
