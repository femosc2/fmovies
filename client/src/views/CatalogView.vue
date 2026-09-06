<template>
  <div id="app">
    <SortBy />
    <Search />
    <Movies />
    <MovieOverlay />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
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
