<template>
  <div id="app">
    <RouterLink class="stats-link" to="/statistics">📊 Statistics</RouterLink>
    <SortBy />
    <Search />
    <Movies />
    <MovieOverlay />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useMoviesStore } from '@/stores/movies';
import SortBy from '@/components/SortBy/SortBy.vue';
import Search from '@/components/Search/Search.vue';
import Movies from '@/components/Movies/Movies.vue';
import MovieOverlay from '@/components/MovieOverlay/MovieOverlay.vue';

const movies = useMoviesStore();

onMounted(() => {
  movies.fetchMovies();
});
</script>

<style scoped>
.stats-link {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 100;
  color: #fff;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 15px;
  opacity: 0.6;
  transition: opacity 0.25s;
}
.stats-link:hover {
  opacity: 1;
}
@media screen and (max-width: 700px) {
  .stats-link {
    top: auto;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.85;
  }
}
</style>
