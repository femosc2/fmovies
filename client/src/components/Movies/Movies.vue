<template>
<section>
<div v-if="movies.length !== 0">
  <MovieList  v-if="filteredMovies.length === 0 && search === ''" :movies="movies" />
  <MovieList  v-if="filteredMovies.length !== 0" :movies="filteredMovies" />
</div>
<div v-if="movies.length === 0">
  <p> No Movies found!</p>
</div>
</section>
</template>

<script>
import MovieList from './components/MovieList';
export default {
  name: 'HelloWorld',
  components: {
    MovieList,
  },
  computed: {
    movies() {
      return this.$store.state.movies;
    },
    filteredMovies() {
      return this.$store.state.filteredMovies;
    },
    search() {
      return this.$store.state.search;
    }
  },
  watch: {
    movies() {
      return this.$store.state.movies;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  margin-top: 7%;
}
</style>
