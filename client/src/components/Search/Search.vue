<template>
  <div>
    <input
      v-model="search"
      type="text"
      autofocus
      placeholder="Search by title, director, actor, plot or year"
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
/* The poster grid uses a large negative margin (Movie.vue) and paints well above its flow
   position, so unpositioned chrome ends up underneath it. Float the bar like NavTabs/SortBy. */
div {
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 500;
}

input {
  width: 50vw;
  height: 70px;
  text-align: center;
  font-size: 25px;
  background-color: rgba(255, 255, 255, 0.92);
  border: none;
  border-radius: 999px;
  outline: none;
  /* Same floating-pill treatment as NavTabs, so the bar reads over any poster behind it. */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: 0.25s;
}

input::placeholder {
  color: #6b7a8a;
}

input:hover,
input:focus {
  background-color: #fff;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
  transition: 0.25s;
}

@media screen and (max-width: 700px) {
  div {
    display: flex;
    top: 0;
    left: 0;
    transform: none;
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
    box-shadow: none;
  }
}
</style>
