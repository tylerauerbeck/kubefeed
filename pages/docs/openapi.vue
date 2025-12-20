<template>
  <div>
    <ClientOnly>
      <div id="swagger-ui"></div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(async () => {
  if (process.client) {
    // Dynamically import Swagger UI
    const SwaggerUIBundle = (await import('swagger-ui-dist')).SwaggerUIBundle
    const SwaggerUIStandalonePreset = (await import('swagger-ui-dist')).SwaggerUIStandalonePreset
    
    // Import CSS
    await import('swagger-ui-dist/swagger-ui.css')
    
    // Initialize Swagger UI
    SwaggerUIBundle({
      url: '/openapi.json',
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      layout: 'BaseLayout',
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
      displayRequestDuration: true,
      tryItOutEnabled: true
    })
  }
})
</script>

<style>
/* Optional: Add some styling */
#swagger-ui {
  font-family: sans-serif;
}
</style>
