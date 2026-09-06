<template>
  <nav class="tabs">
    <RouterLink to="/" class="tab">Movies</RouterLink>
    <RouterLink to="/statistics" class="tab">Statistics</RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.tabs {
  display: inline-flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.08);
  padding: 4px;
  border-radius: 999px;
}
.tab {
  padding: 7px 18px;
  border-radius: 999px;
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  opacity: 0.65;
  transition: 0.2s;
  white-space: nowrap;
}
.tab:hover {
  opacity: 1;
}
.tab.router-link-exact-active {
  background: #42b983;
  opacity: 1;
}
</style>
