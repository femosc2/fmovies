<template>
  <div id="app">
    <SortBy />
    <Search />
    <Movies />
    <MovieOverlay />
  </div>
</template>

<script>
import Movies from './components/Movies/Movies.vue'
import MovieOverlay from './components/MovieOverlay/MovieOverlay'
import Search from './components/Search/Search'
import SortBy from './components/SortBy/SortBy'
import { db } from "./main";

export default {
  name: 'App',
  components: {
    Movies,
    MovieOverlay,
    Search,
    SortBy
  },
  data() {
    return {
      unSortedMovies: []
    }
  },
  created() {
    db.ref('/').once('value').then((data) => {
      this.unSortedMovies = Object.values(data.toJSON());
      this.$store.commit('setMovies', this.unSortedMovies.sort((m1, m2)=> m2.FemoRating - m1.FemoRating))
    })
  },
  computed: {
    movies() {
      return this.$store.state.movies;
    },
  },
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
