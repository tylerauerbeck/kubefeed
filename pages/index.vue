<template>
  <div class="landing-page">
    <header class="header">
      <div class="header-icons">
        <NuxtLink to="/" class="icon-link active" aria-label="Home">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </NuxtLink>
        <NuxtLink to="/docs" class="icon-link" aria-label="Documentation">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </NuxtLink>
        <a href="https://github.com/tylerauerbeck/kubefeed" class="icon-link" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
      </div>
    </header>
    <div class="content">
      <img src="/kubefeed.png" alt="Kubefeed" class="logo" />
      <h1 class="title">KUBEFEED</h1>
      <p class="subtitle">Your Source for Kubernetes Release Details</p>
    </div>
  </div>
</template>

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
