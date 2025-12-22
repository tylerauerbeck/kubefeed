<template>
  <div class="landing-page">
    <NavBar />
    <div class="content">
      <img src="/kubefeed.png" alt="Kubefeed" class="logo" />
      <h1 class="title">KUBEFEED</h1>
      <p class="subtitle">Your Source for Kubernetes Release Details</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
</script>

<style scoped>
.landing-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #2d2d2d;
  position: relative;
}

.header {
  position: fixed;
  top: 0;
  right: 0;
  padding: 2rem;
  z-index: 10;
}

.header-icons {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.icon-link {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
  text-decoration: none;
}

.icon-link:hover {
  opacity: 0.7;
}

.icon-link svg {
  width: 24px;
  height: 24px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.logo {
  max-width: 300px;
  width: 100%;
  height: auto;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin: 0;
  letter-spacing: 0.3em;
}

.subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.05em;
}
</style>
