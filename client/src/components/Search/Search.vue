<template>
  <div>
    <input
      v-model="search"
      type="text"
      autofocus
      placeholder="Search for a movie, parts of the plot or release year"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useMoviesStore } from '@/stores/movies';

const movies = useMoviesStore();
const search = ref('');

// Filtering/sorting are pure store getters now — we just push the query into the store.
watch(search, (value) => movies.setSearch(value));
</script>

<style scoped>
input {
  width: 50vw;
  height: 70px;
  text-align: center;
  font-size: 25px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 20px;
}

@media screen and (max-width: 700px) {
  div {
    display: flex;
    top: 0;
    z-index: 500;
    position: fixed;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    height: 8vh;
    box-shadow: 0px 9px 16px 0px rgba(0, 0, 0, 0.75);
  }
  input {
    align-self: center;
    justify-self: center;
    width: 100%;
    font-size: 15px;
    border-radius: 0;
  }
}
</style>
