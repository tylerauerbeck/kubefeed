<script setup lang="ts">
import DocsSidebar from '../../components/DocsSidebar.vue';

</script>

<template>
  <div class="docs-page">
    <NavBar />
    
    <main class="main-content">
      <DocsSidebar />
      
      <div class="docs-container">
        <h1>How To Use It</h1>
        
        <section class="docs-section">
          <h2 id="getting-started">Getting Started</h2>
          <p>Using Kubefeed is simple. The API provides a JSON endpoint that you can query to get information about Kubernetes releases.</p>
        </section>

        <section class="docs-section">
          <h2 id="api-endpoint">API Endpoint</h2>
          <p>Access the feed at:</p>
          <pre><code>/api/feeds/json</code></pre>
        </section>

        <section class="docs-section">
          <h2 id="query-parameters">Query Parameters</h2>
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Description</th>
                <th>Type</th>
                <th>Default</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>draft</strong></td>
                <td>Filter by draft status</td>
                <td>boolean</td>
                <td>false</td>
              </tr>
              <tr>
                <td><strong>prerelease</strong></td>
                <td>Filter by pre-release status</td>
                <td>boolean</td>
                <td>false</td>
              </tr>
              <tr>
                <td><strong>notes</strong></td>
                <td>Include release notes</td>
                <td>boolean</td>
                <td>false</td>
              </tr>
              <tr>
                <td><strong>supported</strong></td>
                <td>Filter for supported Kubernetes versions (latest 3 minor releases)</td>
                <td>boolean</td>
                <td>false</td>
              </tr>
              <tr>
                <td><strong>latest</strong></td>
                <td>When used with <strong>supported</strong>, returns only the latest patch release for each supported minor version. If <strong>prerelease</strong> is also set, it will include the latest pre-release as well.</td>
                <td>boolean</td>
                <td>false</td>
              </tr>
              <tr>
                <td><strong>before</strong></td>
                <td>Filter for releases before a specific date (YYYYMMDD). Can be used in conjunction with the <strong>after</strong> parameter to get releases between a set of dates.</td>
                <td>string</td>
                <td>null</td>
              </tr>
              <tr>
                <td><strong>after</strong></td>
                <td>Filter for releases after a specific date (YYYYMMDD). Can be used in conjunction with the <strong>before</strong> parameter to get releases between a set of dates.</td>
                <td>string</td>
                <td>null</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="docs-section">
          <h2 id="example-usage">Example Usage</h2>
          <p>Fetch all stable releases:</p>
          <pre><code>GET /api/feeds/json</code></pre>
          <p>Fetch stable releases including drafts and pre-releases):</p>
          <pre><code>GET /api/feeds/json?draft=true&prerelease=true</code></pre>
          <p>Fetch releases including release notes:</p>
          <pre><code>GET /api/feeds/json?notes=true</code></pre>
          <p>Fetch releases before a specific date:</p>
          <pre><code>GET /api/feeds/json?before=20240101</code></pre>
          <p>Fetch releases after a specific date:</p>
          <pre><code>GET /api/feeds/json?after=20230101</code></pre>
          <p>Fetch releases between two dates:</p>
          <pre><code>GET /api/feeds/json?after=20230101&before=20231231</code></pre>
          <p>Fetch currently supported releases:</p>
          <pre><code>GET /api/feeds/json?supported=true</code></pre>
          <p>Get latest supported releases</p>
          <pre><code>GET /api/feeds/json?supported=true&latest=true</code></pre>
          <p>Get latest supported releases including prereleases</p>
          <pre><code>GET /api/feeds/json?supported=true&latest=true&prerelease=true</code></pre>
        </section>

        <section class="docs-section">
          <h2 id="getting-started">Want To Experiment?</h2>
          <p>
            Kubefeed provides a Swagger UI where you can start playing around with the different parameters.
            Take any of the above examples you're interested in and give them a whirl
            <NuxtLink to="/docs/openapi" class="my-link-white">here</NuxtLink>
          </p>
          
        </section>
      </div>

      <aside class="toc-sidebar">
        <h3 class="toc-header">On This Page</h3>
        <nav class="toc-nav">
          <a href="#getting-started" class="toc-link">Getting Started</a>
          <a href="#api-endpoint" class="toc-link">API Endpoint</a>
          <a href="#query-parameters" class="toc-link">Query Parameters</a>
          <a href="#example-usage" class="toc-link">Example Usage</a>
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

.docs-section pre {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1rem 0;
}

.docs-section code {
  color: #a8dadc;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
}

.docs-section table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.docs-section table th {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 600;
  text-align: left;
  padding: 1rem;
  font-size: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.docs-section table td {
  padding: 1rem;
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 1rem;
}

.docs-section table tr:last-child td {
  border-bottom: none;
}

.docs-section table tr:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.docs-section table td strong {
  color: #a8dadc;
  font-family: 'Courier New', monospace;
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

.my-link-white {
  color: white;
}
</style>

<!-- <script lang="ts">
import NavBar from '../components/NavBar.vue'
</script> -->