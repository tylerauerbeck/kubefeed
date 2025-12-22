<template>
  <div class="docs-page">
    <NavBar />
    
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
        <h1>Questions</h1>
        
        <section class="docs-section">
          <h2 id="frequently-asked-questions">Frequently Asked Questions</h2>
          
          <div class="faq-item">
            <h3>How often is the data updated?</h3>
            <p>The release data is updated regularly to reflect the latest Kubernetes releases from the official GitHub repository.</p>
          </div>

          <div class="faq-item">
            <h3>Is this an official Kubernetes project?</h3>
            <p>No, Kubefeed is an independent project that tracks official Kubernetes releases. It is not affiliated with or endorsed by the Kubernetes project.</p>
          </div>

          <div class="faq-item">
            <h3>Can I contribute?</h3>
            <p>Yes! Kubefeed is open source. Visit our <a href="https://github.com/tylerauerbeck/kubefeed" target="_blank" rel="noopener noreferrer">GitHub repository</a> to contribute or report issues.</p>
          </div>

          <div class="faq-item">
            <h3>What data format is returned?</h3>
            <p>The API returns data in JSON format, making it easy to integrate with any application or service.</p>
          </div>
        </section>

        <section class="docs-section">
          <h2 id="need-more-help">Need More Help?</h2>
          <p>If you have questions that aren't answered here, please open an issue on our <a href="https://github.com/tylerauerbeck/kubefeed/issues" target="_blank" rel="noopener noreferrer">GitHub repository</a>.</p>
        </section>
      </div>

      <aside class="toc-sidebar">
        <h3 class="toc-header">On This Page</h3>
        <nav class="toc-nav">
          <a href="#frequently-asked-questions" class="toc-link">Frequently Asked Questions</a>
          <a href="#need-more-help" class="toc-link">Need More Help?</a>
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
  margin-bottom: 1.5rem;
  color: #ffffff;
}

.docs-section p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
}

.docs-section a {
  color: #a8dadc;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-bottom-color 0.2s ease;
}

.docs-section a:hover {
  border-bottom-color: #a8dadc;
}

.faq-item {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-item h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #ffffff;
}

.faq-item p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
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