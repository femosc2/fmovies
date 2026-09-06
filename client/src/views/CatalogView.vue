<template>
  <div id="app">
    <div class="nav-wrap"><NavTabs /></div>
    <SortBy />
    <Search />
    <Movies />
    <MovieOverlay />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useMoviesStore } from '@/stores/movies';
import NavTabs from '@/components/NavTabs.vue';
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
.nav-wrap {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 100;
}
@media screen and (max-width: 700px) {
  .nav-wrap {
    top: auto;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
