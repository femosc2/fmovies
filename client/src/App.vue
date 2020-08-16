<template>
  <div id="app">
    <Search />
    <Movies />
    <MovieOverlay />
  </div>
</template>

<script>
import Movies from './components/Movies/Movies.vue'
import MovieOverlay from './components/MovieOverlay/MovieOverlay'
import Search from './components/Search/Search'
import { db } from "./main";

export default {
  name: 'App',
  components: {
    Movies,
    MovieOverlay,
    Search
  },
  created() {
    db.ref('/').once('value').then((data) => {
      this.$store.commit('setMovies', Object.values(data.toJSON()).sort((a, b) => b.FemoRating - a.FemoRating));
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background-color: #2c3e50;
}
</style>
