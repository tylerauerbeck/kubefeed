<template>
  <div>
    <ClientOnly>
      <component 
        v-if="config && ApiReference" 
        :is="ApiReference" 
        :configuration="config" 
      />
      <div v-else>Loading... </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Component } from 'vue'

const config = ref<any>(null)
const ApiReference = ref<Component | null>(null)

onMounted(async () => {
  try {
    // Fetch the OpenAPI spec
    const response = await fetch('/openapi.json')
    const spec = await response.json()
    
    // Dynamically import ApiReference component
    const module = await import('@scalar/api-reference')
    await import('@scalar/api-reference/style.css')
    
    ApiReference.value = module.ApiReference
    
    // Set config with the fetched spec
    config.value = {
      spec: {
        content: spec  // Use content instead of url
      },
      theme: 'default'
    }
  } catch (error) {
    console.error('Failed to load API documentation:', error)
  }
})
</script>
