<template>
  <div class="docs-page">
    <NavBar />
    
    <main class="main-content">
      <DocsSidebar />
      
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

.main-content {
  display: flex;
  padding-top: 80px;
  padding-bottom: 4rem;
  max-width: 1400px;
  margin: 0 auto;
  gap: 3rem;
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