<template>
  <div class="ai-chat-wrapper">
    <!-- Floating Trigger Bubble -->
    <transition name="pop-fade">
      <div v-if="!isOpen" class="chat-bubble-container" @click="toggleChat">
        <div class="chat-pulse-ring"></div>
        <button class="chat-floating-btn shadow-lg" title="Trợ lý AI 3 Miền Cua">
          <i class="fa-solid fa-robot-astromech me-1 d-none d-sm-inline"></i>
          <span class="fs-4">🦀</span>
          <span class="badge-online"></span>
        </button>
        <div v-if="showWelcomeHint" class="chat-welcome-hint shadow animate__animated animate__fadeInRight">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <strong class="text-primary-orange small"><i class="fa-solid fa-sparkles me-1"></i>Trợ Lý AI 3 Miền</strong>
            <button type="button" class="btn-close btn-close-xs" @click.stop="showWelcomeHint = false"></button>
          </div>
          <p class="mb-0 text-muted small">Cần tư vấn món ngon, đặt bàn hay <strong>ghép bàn đoàn đông</strong>? Nhắn em ngay nhé!</p>
        </div>
      </div>
    </transition>

    <!-- Chat Box Window -->
    <transition name="slide-up">
      <div v-if="isOpen" class="chat-window shadow-2xl rounded-4">
        <!-- Chat Header -->
        <div class="chat-header text-white p-3 rounded-top-4 d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-2">
            <div class="position-relative">
              <div class="assistant-avatar rounded-circle bg-white text-dark d-flex align-items-center justify-content-center fw-bold shadow-sm">
                🦀
              </div>
              <span class="header-online-dot"></span>
            </div>
            <div>
              <h6 class="mb-0 fw-bold d-flex align-items-center gap-1">
                Trợ Lý AI 3 Miền Cua
                <span class="badge bg-warning text-dark font-xs px-2 py-0.5 rounded-pill">AI 2.0</span>
              </h6>
              <p class="mb-0 font-xs opacity-75">Tư vấn món • Đặt bàn & Ghép bàn tức thì</p>
            </div>
          </div>
          <div class="d-flex align-items-center gap-1">
            <button class="btn btn-sm btn-icon-glass" title="Làm mới cuộc trò chuyện" @click="resetChat">
              <i class="fa-solid fa-arrows-rotate"></i>
            </button>
            <button class="btn btn-sm btn-icon-glass" title="Thu nhỏ" @click="toggleChat">
              <i class="fa-solid fa-chevron-down"></i>
            </button>
          </div>
        </div>

        <!-- Chat Body / Messages -->
        <div class="chat-body p-3" ref="messagesContainer">
          <div v-for="(msg, idx) in messages" :key="idx" class="chat-message mb-3" :class="msg.sender">
            <!-- Avatar -->
            <div class="msg-avatar">
              <span v-if="msg.sender === 'assistant'">🦀</span>
              <span v-else><i class="fa-solid fa-user"></i></span>
            </div>

            <!-- Message Content -->
            <div class="msg-content-box">
              <div class="msg-bubble" :class="msg.sender === 'assistant' ? 'assistant-bubble' : 'user-bubble'">
                <div v-html="formatMarkdown(msg.text)"></div>
                <div class="msg-time font-xs mt-1 text-end opacity-50">{{ msg.time }}</div>
              </div>

              <!-- Dish Recommendations Card -->
              <div v-if="msg.dishes && msg.dishes.length > 0" class="recommend-dishes-box mt-2">
                <div class="row g-2">
                  <div v-for="d in msg.dishes" :key="d._id" class="col-12 col-sm-6">
                    <div class="dish-mini-card p-2 rounded-3 border bg-white shadow-sm d-flex flex-column justify-content-between h-100">
                      <div class="d-flex gap-2">
                        <img :src="d.image || '/images/default-dish.jpg'" :alt="d.name" class="dish-mini-img rounded-2 object-fit-cover" @error="(e) => e.target.src = '/images/default-dish.jpg'" />
                        <div class="flex-grow-1 overflow-hidden">
                          <h6 class="font-xs fw-bold mb-0 text-truncate" :title="d.name">{{ d.name }}</h6>
                          <span class="badge bg-light text-dark font-xs mb-1">{{ d.region }}</span>
                          <div class="text-danger fw-bold font-xs">{{ formatVND(d.price) }}</div>
                        </div>
                      </div>
                      <button class="btn btn-outline-primary btn-xs mt-2 w-100 rounded-pill" @click="selectDishFromRecommendation(d)">
                        <i class="fa-solid fa-plus me-1"></i> Chọn món này
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Booking Preview Card -->
              <div v-if="msg.bookingData" class="booking-preview-card mt-3 p-3 rounded-3 shadow-sm border bg-white">
                <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                  <span class="fw-bold text-primary-orange font-sm">
                    <i class="fa-solid fa-clipboard-check me-1"></i> THÔNG TIN XẾP BÀN
                  </span>
                  <span v-if="msg.bookingData.isCombined" class="badge bg-danger-subtle text-danger font-xs">
                    <i class="fa-solid fa-link me-1"></i> Đã ghép cụm bàn
                  </span>
                  <span v-else class="badge bg-success-subtle text-success font-xs">
                    <i class="fa-solid fa-chair me-1"></i> Bàn đơn
                  </span>
                </div>

                <div class="booking-meta-grid mb-2 font-xs">
                  <div class="meta-item"><i class="fa-solid fa-users text-muted me-1"></i><strong>Số khách:</strong> {{ msg.bookingData.guestsCount }} người</div>
                  <div class="meta-item"><i class="fa-solid fa-clock text-muted me-1"></i><strong>Thời gian:</strong> {{ msg.bookingData.formattedTime }} ({{ msg.bookingData.formattedDate }})</div>
                  <div class="meta-item col-span-2"><i class="fa-solid fa-map-pin text-muted me-1"></i><strong>Vị trí:</strong> <span class="text-primary fw-semibold">{{ msg.bookingData.tableNames }}</span> ({{ msg.bookingData.areaName }})</div>
                </div>

                <!-- Pre-ordered dishes preview -->
                <div v-if="msg.bookingData.preOrderDishes && msg.bookingData.preOrderDishes.length > 0" class="preorder-summary mb-2 p-2 rounded-2 bg-light font-xs">
                  <div class="fw-bold text-muted mb-1 d-flex justify-content-between">
                    <span><i class="fa-solid fa-utensils me-1"></i> Món đặt trước:</span>
                    <span class="text-dark">{{ formatVND(msg.bookingData.preOrderSubtotal) }}</span>
                  </div>
                  <div v-for="(p, pIdx) in msg.bookingData.preOrderDishes" :key="pIdx" class="d-flex justify-content-between text-secondary py-0.5">
                    <span>{{ p.dishName }} x {{ p.quantity }}</span>
                    <span>{{ formatVND(p.price * p.quantity) }}</span>
                  </div>
                </div>

                <!-- Deposit amount -->
                <div v-if="msg.bookingData.depositAmount > 0" class="deposit-tag d-flex justify-content-between align-items-center mb-2 p-2 rounded-2 bg-warning-subtle text-warning-emphasis font-xs">
                  <span><i class="fa-solid fa-shield-halved me-1"></i> Tiền cọc giữ chỗ:</span>
                  <strong class="fs-6 text-danger">{{ formatVND(msg.bookingData.depositAmount) }}</strong>
                </div>

                <!-- Customer form inputs -->
                <div class="customer-quick-form mt-2 pt-2 border-top">
                  <div class="row g-2">
                    <div class="col-6">
                      <label class="font-xs text-muted mb-0">Họ và tên *</label>
                      <input v-model="formCustomerName" type="text" class="form-control form-control-sm font-xs" placeholder="Nhập tên" />
                    </div>
                    <div class="col-6">
                      <label class="font-xs text-muted mb-0">Số điện thoại *</label>
                      <input v-model="formCustomerPhone" type="tel" class="form-control form-control-sm font-xs" placeholder="09xxxxxxx" />
                    </div>
                  </div>
                  <button
                    class="btn btn-orange-gradient w-100 mt-2 btn-sm fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                    :disabled="isSubmittingBooking"
                    @click="handleConfirmBooking(msg.bookingData)"
                  >
                    <span v-if="isSubmittingBooking" class="spinner-border spinner-border-sm"></span>
                    <i v-else class="fa-solid fa-check-circle"></i>
                    Xác Nhận Đặt Bàn Ngay
                  </button>
                </div>
              </div>

              <!-- Booking Success Box -->
              <div v-if="msg.successBooking" class="booking-success-box mt-3 p-3 rounded-3 shadow-sm border bg-white animate__animated animate__fadeIn">
                <div class="text-center mb-2">
                  <div class="success-icon-badge mx-auto mb-1">
                    <i class="fa-solid fa-circle-check text-success fs-2"></i>
                  </div>
                  <h6 class="fw-bold text-success mb-0">Đặt Bàn Thành Công!</h6>
                  <p class="font-xs text-muted mb-1">Mã đặt bàn của bạn:</p>
                  <span class="badge bg-dark font-sm px-3 py-1 letter-spacing-1">{{ msg.successBooking.reservationCode }}</span>
                </div>

                <!-- CheckIn QR -->
                <div v-if="msg.successBooking.checkInQrUrl" class="text-center p-2 rounded-2 bg-light mb-2">
                  <p class="font-xs fw-semibold text-secondary mb-1">Mã QR Check-in khi đến nhà hàng:</p>
                  <img :src="msg.successBooking.checkInQrUrl" alt="CheckIn QR" class="qr-img rounded border bg-white p-1" />
                </div>

                <!-- VietQR Deposit -->
                <div v-if="msg.successBooking.deposit?.qrCodeUrl && msg.successBooking.deposit?.amount > 0" class="text-center p-2 rounded-2 bg-warning-subtle mb-2">
                  <p class="font-xs fw-bold text-danger mb-1">
                    <i class="fa-solid fa-qrcode me-1"></i> Quét mã VietQR chuyển khoản cọc ({{ formatVND(msg.successBooking.deposit.amount) }}):
                  </p>
                  <img :src="msg.successBooking.deposit.qrCodeUrl" alt="VietQR Deposit" class="qr-img-large rounded border bg-white p-1 shadow-sm" />
                  <div class="font-xs text-muted mt-1">
                    STK: <strong>{{ msg.successBooking.deposit.bankInfo?.accountNo }}</strong> ({{ msg.successBooking.deposit.bankInfo?.bankId }})<br />
                    Chủ TK: <strong>{{ msg.successBooking.deposit.bankInfo?.accountName }}</strong>
                  </div>
                </div>

                <div class="d-flex gap-2 mt-2">
                  <router-link to="/profile" class="btn btn-outline-secondary btn-xs flex-grow-1" @click="isOpen = false">
                    <i class="fa-solid fa-list-check me-1"></i> Xem lịch sử
                  </router-link>
                  <button class="btn btn-primary-orange btn-xs flex-grow-1" @click="resetChat">
                    <i class="fa-solid fa-plus me-1"></i> Đặt thêm bàn
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isLoading" class="chat-message assistant mb-3">
            <div class="msg-avatar">🦀</div>
            <div class="msg-bubble assistant-bubble typing-bubble">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
          </div>
        </div>

        <!-- Quick Prompt Chips -->
        <div class="quick-prompts-bar px-3 py-1 d-flex gap-2 overflow-x-auto">
          <button
            v-for="(chip, cIdx) in quickChips"
            :key="cIdx"
            class="badge rounded-pill quick-chip-btn bg-light text-dark border font-xs fw-normal text-nowrap"
            @click="sendQuickPrompt(chip.text)"
          >
            {{ chip.icon }} {{ chip.label }}
          </button>
        </div>

        <!-- Chat Input Bar -->
        <div class="chat-footer p-2 bg-white border-top rounded-bottom-4">
          <form @submit.prevent="sendMessage" class="d-flex align-items-center gap-2">
            <input
              ref="inputField"
              v-model="inputPrompt"
              type="text"
              class="form-control form-control-sm border-0 bg-light rounded-pill px-3 py-2 font-sm"
              placeholder="Nhắn yêu cầu (VD: Đặt bàn 8 người tối mai ghép bàn...)"
              :disabled="isLoading"
            />
            <button
              type="submit"
              class="btn btn-send-chat rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              :disabled="!inputPrompt.trim() || isLoading"
            >
              <i class="fa-solid fa-paper-plane text-white font-xs"></i>
            </button>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import api from "../../services/api";
import { useAuthStore } from "../../stores/authStore";

const authStore = useAuthStore();

const isOpen = ref(false);
const showWelcomeHint = ref(true);
const isLoading = ref(false);
const isSubmittingBooking = ref(false);
const inputPrompt = ref("");
const messagesContainer = ref(null);
const inputField = ref(null);

const formCustomerName = ref("");
const formCustomerPhone = ref("");
const currentDraftBooking = ref(null);

const quickChips = [
  { icon: "🦀", label: "Gợi ý món ngon", text: "Gợi ý cho tôi các món đặc sản hải sản ngon nhất quán" },
  { icon: "🪑", label: "Đặt bàn 4 người tối nay", text: "Đặt bàn 4 người tối nay lúc 19h" },
  { icon: "🔗", label: "Ghép bàn 12 người tối mai", text: "Đặt bàn 12 người tối mai 19h ghép cụm bàn kề nhau và ăn 2 Cua rang me, 1 Lẩu cua đồng" },
  { icon: "🍲", label: "Thực đơn lẩu", text: "Nhà hàng có các món lẩu nào ngon?" },
];

const messages = ref([
  {
    sender: "assistant",
    text: "Chào Anh/Chị! Em là **Trợ Lý AI 3 Miền Cua** 🦀.\n\nEm có thể hỗ trợ Anh/Chị:\n• **Tư vấn món ăn** & đặc sản 3 miền.\n• **Tự động tìm & xếp bàn** chuẩn khung giờ.\n• **Tự động ghép bàn (Ghép cụm kề nhau)** cho đoàn đông 8 - 20 khách.\n• **Đặt trước món ăn (Pre-order)** sẵn sàng khi đến quán.\n\n*Anh/Chị cần hỗ trợ gì cứ nhắn cho em nhé!*",
    time: formatTimeNow(),
  },
]);

function formatTimeNow() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatVND(val) {
  if (!val) return "0đ";
  return Number(val).toLocaleString("vi-VN") + "đ";
}

function formatMarkdown(text) {
  if (!text) return "";
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic *text*
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // Code `code`
  html = html.replace(/`(.*?)`/g, "<code class='bg-light px-1 rounded text-danger font-xs'>$1</code>");
  // Line breaks
  html = html.replace(/\n/g, "<br/>");
  return html;
}

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    showWelcomeHint.value = false;
    syncCustomerInfo();
    scrollToBottom();
    nextTick(() => {
      inputField.value?.focus();
    });
  }
};

const syncCustomerInfo = () => {
  if (authStore.user) {
    formCustomerName.value = authStore.user.name || "";
    formCustomerPhone.value = authStore.user.phone || "";
  }
};

const resetChat = () => {
  messages.value = [
    {
      sender: "assistant",
      text: "Dạ cuộc trò chuyện đã được làm mới! Em có thể giúp gì cho Anh/Chị tiếp theo ạ? 🦀",
      time: formatTimeNow(),
    },
  ];
  currentDraftBooking.value = null;
  scrollToBottom();
};

const sendQuickPrompt = (text) => {
  inputPrompt.value = text;
  sendMessage();
};

const selectDishFromRecommendation = (dish) => {
  const prompt = `Tôi muốn thêm món ${dish.name} vào danh sách đặt trước`;
  inputPrompt.value = prompt;
  sendMessage();
};

const sendMessage = async () => {
  const text = inputPrompt.value.trim();
  if (!text || isLoading.value) return;

  // Add User message
  messages.value.push({
    sender: "user",
    text,
    time: formatTimeNow(),
  });

  inputPrompt.value = "";
  isLoading.value = true;
  scrollToBottom();

  try {
    const payload = {
      prompt: text,
      currentBookingContext: currentDraftBooking.value,
      customerName: formCustomerName.value,
      customerPhone: formCustomerPhone.value,
    };

    const res = await api.post("/chatbot/chat", payload);
    const data = res.data;

    if (data.bookingData) {
      currentDraftBooking.value = data.bookingData;
    }

    messages.value.push({
      sender: "assistant",
      text: data.reply || "Dạ em đã nhận được thông tin ạ!",
      time: formatTimeNow(),
      dishes: data.dishes || null,
      bookingData: data.bookingData || null,
    });
  } catch (err) {
    messages.value.push({
      sender: "assistant",
      text: "Dạ có chút sự cố kết nối tới hệ thống AI. Anh/Chị vui lòng thử lại sau giây lát nhé!",
      time: formatTimeNow(),
    });
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};

const handleConfirmBooking = async (bookingData) => {
  if (!formCustomerName.value.trim() || !formCustomerPhone.value.trim()) {
    alert("Vui lòng nhập đầy đủ Họ tên và Số điện thoại để hoàn tất đặt bàn nhé!");
    return;
  }

  isSubmittingBooking.value = true;
  try {
    const payload = {
      customerName: formCustomerName.value.trim(),
      customerPhone: formCustomerPhone.value.trim(),
      customerEmail: authStore.user?.email || "",
      guestsCount: bookingData.guestsCount,
      startAt: bookingData.startAt,
      endAt: bookingData.endAt,
      tableIds: bookingData.tableIds,
      preOrderDishes: bookingData.preOrderDishes,
      depositAmount: bookingData.depositAmount,
      notes: "Đặt qua Trợ Lý AI 3 Miền Cua",
    };

    const res = await api.post("/chatbot/confirm-booking", payload);
    const data = res.data;

    messages.value.push({
      sender: "assistant",
      text: `🎉 **CHÚC MỪNG QUÝ KHÁCH ĐÃ ĐẶT BÀN THÀNH CÔNG!**\n\nMã đặt bàn của bạn: **${data.reservationCode}**.\nNhà hàng 3 Miền Cua rất hân hạnh được phục vụ bạn!`,
      time: formatTimeNow(),
      successBooking: data,
    });

    currentDraftBooking.value = null;
  } catch (err) {
    const errMsg = err.response?.data?.message || "Đặt bàn chưa thành công, vui lòng thử lại!";
    alert(errMsg);
  } finally {
    isSubmittingBooking.value = false;
    scrollToBottom();
  }
};

onMounted(() => {
  syncCustomerInfo();
});
</script>

<style scoped>
.ai-chat-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1060;
  font-family: inherit;
}

/* Floating button */
.chat-bubble-container {
  position: relative;
  display: flex;
  align-items: center;
}

.chat-floating-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
  border: 3px solid #fff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.chat-floating-btn:hover {
  transform: scale(1.08) rotate(5deg);
  box-shadow: 0 10px 25px rgba(234, 88, 12, 0.45);
}

.chat-pulse-ring {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(234, 88, 12, 0.4);
  animation: pulse-ring 2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
  pointer-events: none;
}

@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 0; }
  100% { transform: scale(0.95); opacity: 0; }
}

.badge-online {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  background-color: #22c55e;
  border: 2px solid #fff;
  border-radius: 50%;
}

.chat-welcome-hint {
  position: absolute;
  right: 75px;
  bottom: 5px;
  width: 250px;
  background: #ffffff;
  border-radius: 12px;
  padding: 10px 12px;
  border: 1px solid #f1f5f9;
  cursor: pointer;
}

.btn-close-xs {
  font-size: 0.6rem;
  padding: 0;
}

/* Chat window */
.chat-window {
  width: 390px;
  max-width: calc(100vw - 32px);
  height: 600px;
  max-height: calc(100vh - 100px);
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.chat-header {
  background: linear-gradient(135deg, #ea580c 0%, #9a3412 100%);
}

.assistant-avatar {
  width: 36px;
  height: 36px;
  font-size: 1.2rem;
}

.header-online-dot {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  background-color: #22c55e;
  border: 2px solid #ea580c;
  border-radius: 50%;
}

.btn-icon-glass {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.btn-icon-glass:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
}

/* Chat body */
.chat-body {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.chat-message {
  display: flex;
  gap: 8px;
  max-width: 90%;
}

.chat-message.assistant {
  align-self: flex-start;
}

.chat-message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fed7aa;
  color: #c2410c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.chat-message.user .msg-avatar {
  background: #e2e8f0;
  color: #475569;
}

.msg-bubble {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 0.85rem;
  line-height: 1.45;
  word-break: break-word;
}

.assistant-bubble {
  background: #ffffff;
  color: #1e293b;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

.user-bubble {
  background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.dish-mini-img {
  width: 48px;
  height: 48px;
}

.qr-img {
  width: 140px;
  height: 140px;
}

.qr-img-large {
  width: 170px;
  height: 170px;
}

.font-xs {
  font-size: 0.75rem;
}

.font-sm {
  font-size: 0.85rem;
}

.btn-xs {
  padding: 2px 8px;
  font-size: 0.75rem;
}

.text-primary-orange {
  color: #ea580c;
}

.btn-orange-gradient {
  background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
  color: #fff;
  border: none;
}

.btn-orange-gradient:hover {
  background: linear-gradient(135deg, #c2410c 0%, #9a3412 100%);
  color: #fff;
}

.btn-send-chat {
  width: 38px;
  height: 38px;
  background: #ea580c;
  border: none;
  transition: all 0.2s;
}

.btn-send-chat:hover:not(:disabled) {
  background: #c2410c;
  transform: scale(1.05);
}

.btn-send-chat:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.quick-chip-btn {
  cursor: pointer;
  transition: all 0.2s;
  padding: 4px 10px;
}

.quick-chip-btn:hover {
  background-color: #ffedd5 !important;
  color: #ea580c !important;
  border-color: #fdba74 !important;
}

/* Typing animation */
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
}

.typing-dot {
  width: 6px;
  height: 6px;
  background: #ea580c;
  border-radius: 50%;
  animation: blink 1.4s infinite both;
}

.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0% { opacity: 0.2; transform: scale(0.8); }
  20% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.2; transform: scale(0.8); }
}

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(30px) scale(0.95);
  opacity: 0;
}

.pop-fade-enter-active, .pop-fade-leave-active {
  transition: all 0.25s ease-out;
}
.pop-fade-enter-from, .pop-fade-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
</style>
