<template>
<div v-if="movies.length !== 0">
  <MovieList :movies="movies" />
</div>
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
</style>
