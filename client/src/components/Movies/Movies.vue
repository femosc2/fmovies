<template>
  <section>
    <MovieList v-if="movies.displayMovies.length !== 0" :movies="movies.displayMovies" />
    <div v-else-if="movies.loaded">
      <p>No Movies found!</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useMoviesStore } from '@/stores/movies';
import MovieList from './components/MovieList.vue';

const movies = useMoviesStore();
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
div {
  margin-top: 100px;
}
@media screen and (max-width: 700px) {
  div {
    margin-top: 150px;
  }
}
</style>
