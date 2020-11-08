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
      console.log(this.unSortedMovies.sort((a, b) => Date.parse(b.Watched) > Date.parse(a.Watched)));
      console.log(Date.parse(this.unSortedMovies[1].Watched))
      console.log(Date.parse(this.unSortedMovies[0].Watched))
      this.$store.commit('setMovies', this.unSortedMovies.sort((a, b) => b.Watched - a.Watched));
    })
  },
  computed: {
    movies() {
      return this.$store.state.movies;
    },
    sortBy() {
      return this.$store.state.sortBy;
    }
  },
  watch: {
    sortBy() {
      if (this.$store.state.sortBy === 'rating') {
        return this.$store.commit('setMovies', this.unSortedMovies.sort((a, b) => b.FemoRating - a.FemoRatings ));
      } else if (this.$store.state.sortBy === 'watched') {
        return this.$store.commit('setMovies', this.unSortedMovies);
      }
    }
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
