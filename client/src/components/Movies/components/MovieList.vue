<template>
  <ul>
    <Movie v-for="movie in movies" :key="movie.Title" :movie="movie" />
  </ul>
</template>

<script setup lang="ts">
import Movie from './components/Movie.vue';
import type { Movie as MovieType } from '@shared/movie';

defineProps<{ movies: MovieType[] }>();
</script>

<style scoped>
ul {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;
  justify-content: center;
}
</style>
