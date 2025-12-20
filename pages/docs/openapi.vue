<template>
  <div>
    <ApiReference : configuration="config" />
  </div>
</template>

<script setup lang="ts">
import { ApiReference } from '@scalar/api-reference'
import '@scalar/api-reference/style.css'

const config = {
  spec: {
    url: '/openapi.json'
  },
  theme: 'default', // or 'alternate', 'moon', 'purple', 'solarized'
}
</script>
