<template>
  <div class="d-flex flex-column min-vh-100 position-relative">
    <Navbar />
    <main class="flex-grow-1">
      <router-view></router-view>
    </main>
    <Footer />
    <!-- AI Chatbot Assistant for Online Customers -->
    <ChatWidget />
  </div>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import ChatWidget from "../components/customer/ChatWidget.vue";
</script>
