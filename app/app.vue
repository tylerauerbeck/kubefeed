<template>
  <div class="landing-page">
    <NuxtRouteAnnouncer />
    <div class="content">
      <img src="/kubefeed.png" alt="Kubefeed" class="logo" />
      <h1 class="title">KUBEFEED</h1>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.landing-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #2d2d2d;
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
</style>
