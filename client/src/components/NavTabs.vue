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
  gap: 6px;
  background: rgba(0, 0, 0, 0.25);
  padding: 6px;
  border-radius: 999px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}
.tab {
  padding: 11px 26px;
  border-radius: 999px;
  color: #fff;
  text-decoration: none;
  font-size: 17px;
  font-weight: 600;
  opacity: 0.7;
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
