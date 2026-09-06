<template>
  <div class="app-nav"><NavTabs /></div>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavTabs from '@/components/NavTabs.vue';
</script>

<style>
/* Persistent app-wide navigation, identical on every route. */
.app-nav {
  position: fixed;
  top: 18px;
  left: 18px;
  z-index: 1000;
}
@media screen and (max-width: 700px) {
  .app-nav {
    top: auto;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
  }
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background-color: #2c3e50;
}

body {
  margin: 0;
  background-color: #2c3e50;
}
</style>
