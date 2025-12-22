<template>
  <div class="docs-page">
    <header class="header">
      <div class="header-content">
        <div class="header-icons">
          <NuxtLink to="/" class="icon-link" aria-label="Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </NuxtLink>
          <NuxtLink to="/docs" class="icon-link active" aria-label="Documentation">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </NuxtLink>
          <NuxtLink to="/docs/openapi" class="icon-link" aria-label="Swagger">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 3h6" />
            <path d="M10 3v4l-5.2 9.4A2 2 0 0 0 6.6 20h10.8a2 2 0 0 0 1.8-3.6L14 7V3" />
            <path d="M8 15h8" />
            <circle cx="12" cy="17.5" r="0.5" />
            <circle cx="10.5" cy="13.5" r="0.5" />
            <circle cx="13.5" cy="13.5" r="0.3" />
          </svg>
        </NuxtLink>
          <a href="https://github.com/tylerauerbeck/kubefeed" class="icon-link" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
        </div>
      </div>
    </header>
    
    <main class="main-content">
      <aside class="sidebar">
        <h3 class="sidebar-header">Documentation</h3>
        <nav class="sidebar-nav">
          <NuxtLink to="/docs/what-is-it" class="sidebar-link">What Is It</NuxtLink>
          <NuxtLink to="/docs/how-to-use-it" class="sidebar-link">How To Use It</NuxtLink>
          <NuxtLink to="/docs/questions" class="sidebar-link">Questions</NuxtLink>
        </nav>
      </aside>
      
      <div class="docs-container">
        <h1>What Is It</h1>
        
        <section class="docs-section">
          <h2 id="overview">Overview</h2>
          <p>Kubefeed is a tool for tracking Kubernetes releases and updates. It provides a simple JSON feed API that makes it easy to stay up-to-date with the latest Kubernetes versions.</p>
        </section>

        <section class="docs-section">
          <h2 id="key-features">Key Features</h2>
          <ul>
            <li>Track official Kubernetes releases</li>
            <li>JSON feed API for easy integration</li>
            <li>Filter by release status (draft, pre-release, etc.)</li>
          </ul>
        </section>

        <section class="docs-section">
          <h2 id="why-use-kubefeed">Why Use Kubefeed?</h2>
          <p>Stay informed about Kubernetes releases without having to manually check GitHub or other sources. Kubefeed aggregates release information and provides it in an easy-to-consume format.</p>
        </section>
      </div>

      <aside class="toc-sidebar">
        <h3 class="toc-header">On This Page</h3>
        <nav class="toc-nav">
          <a href="#overview" class="toc-link">Overview</a>
          <a href="#key-features" class="toc-link">Key Features</a>
          <a href="#why-use-kubefeed" class="toc-link">Why Use Kubefeed?</a>
        </nav>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.docs-page {
  min-height: 100vh;
  background-color: #2d2d2d;
  color: white;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(45, 45, 45, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
}

.header-content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
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

.icon-link.active {
  opacity: 1;
  border-bottom: 2px solid white;
}

.icon-link svg {
  width: 24px;
  height: 24px;
}

.main-content {
  display: flex;
  padding-top: 80px;
  padding-bottom: 4rem;
  max-width: 1400px;
  margin: 0 auto;
  gap: 3rem;
}

.sidebar {
  position: sticky;
  top: 100px;
  width: 250px;
  min-width: 250px;
  height: fit-content;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-left: 2rem;
}

.sidebar-header {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  color: white;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 1rem;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
  border-left: 2px solid transparent;
  padding-left: 1rem;
}

.sidebar-link:hover {
  color: white;
  border-left-color: white;
}

.sidebar-link.router-link-active {
  color: white;
  border-left-color: white;
}

.docs-container {
  flex: 1;
  max-width: 800px;
  padding: 2rem;
}

.docs-container h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  letter-spacing: 0.05em;
}

.docs-container h2 {
  scroll-margin-top: 100px;
}

.docs-section {
  margin-bottom: 3rem;
}

.docs-section h2 {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffffff;
}

.docs-section p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
}

.docs-section ul {
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  padding-left: 2rem;
}

.docs-section li {
  margin-bottom: 0.5rem;
}

.toc-sidebar {
  position: sticky;
  top: 100px;
  width: 200px;
  min-width: 200px;
  height: fit-content;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-right: 2rem;
}

.toc-header {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  color: white;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.toc-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.25rem 0;
  transition: color 0.2s ease;
  border-left: 2px solid transparent;
  padding-left: 1rem;
}

.toc-link:hover {
  color: white;
  border-left-color: white;
}
</style>