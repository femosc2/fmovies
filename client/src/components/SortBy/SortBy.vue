<template>
  <div>
    <h2>Sort By</h2>
    <button :class="{ active: movies.sortBy === 'rating' }" @click="movies.setSortBy('rating')">
      Rating
    </button>
    <button :class="{ active: movies.sortBy === 'watched' }" @click="movies.setSortBy('watched')">
      Recently Watched
    </button>
  </div>
</template>

<script setup lang="ts">
import { useMoviesStore } from '@/stores/movies';

const movies = useMoviesStore();
</script>

<style lang="scss" scoped>
div {
  position: fixed;
  display: block;
  top: 0;
  right: 0;
  background-color: none;
  height: 250px;
  width: 250px;
  color: #fff;
  opacity: 0.5;
  transition: 0.25s;
  &:hover {
    opacity: 1;
    transition: 0.25s;
  }
}

.active {
  background-color: rgba(255, 255, 255, 1);
  transition: 0.25s;
}

button {
  border: 0;
  background: none;
  border: 1px solid #2c3e50;
  font-size: 25px;
  color: #000;
  background-color: rgba(255, 255, 255, 0.2);
  height: 150px;
  width: 150px;
  text-align: center;
  left: 0;
  border-radius: 50%;
}

@media screen and (max-width: 700px) {
  div {
    position: relative;
    width: 100vw;
    height: 100px;
    margin-top: 75px;
    opacity: 1;
    display: flex;
  }
  h2 {
    font-size: 15px;
    display: none;
  }
  button {
    border-radius: 0;
    width: 50%;
    height: 100px;
  }
}
</style>
