<template>
  <section>
    <div v-if="movies.length !== 0">
      <MovieList
        v-if="filteredMovies.length === 0 && search === ''"
        :movies="movies"
      />
      <MovieList v-if="filteredMovies.length !== 0" :movies="filteredMovies" />
    </div>
    <div v-if="movies.length === 0">
      <p>No Movies found!</p>
    </div>
  </section>
</template>

<script>
import MovieList from "./components/MovieList";
export default {
  name: "HelloWorld",
  components: {
    MovieList,
  },
  data() {
    return {
      sortedMovies: [],
    };
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
    },
    sortBy() {
      return this.$store.state.sortBy;
    },
  },
  watch: {
    sortBy() {
      if (this.$store.state.sortBy === "rating") {
        this.sortedMovies = this.$store.state.movies.sort(
          (m1, m2) => m2.FemoRating - m1.FemoRating
        );
      } else {
        this.sortedMovies = this.$store.state.movies.sort(
          (m1, m2) => Date.parse(m2.Watched) - Date.parse(m1.Watched)
        );
      }
    },
    movies() {
      let actors = [];
      let directors = [];
      let actorCount = {};
      let directorCount = {};
      this.movies.forEach((m) => {
        Object.values(m.Actors).forEach((a) => {
          actors = [...actors, a.trim()];
        });
      });

      actors.forEach((a) => {
        actorCount[a] = actorCount[a] ? (actorCount[a] += 1) : 1;
      });
      const sortedActors = Object.entries(actorCount).sort(([, a], [, b]) => b - a);

      console.log(sortedActors);

      this.movies.forEach(m => {
        directors = [...directors, m.Director]
      });

       directors.forEach((a) => {
        directorCount[a] = directorCount[a] ? (directorCount[a] += 1) : 1;
      });

      const sortedDirectors = Object.entries(directorCount).sort(([, a], [, b]) => b - a);

      console.log(sortedDirectors);

    },
  },
};
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
  margin-top: 100px;
}
@media screen and (max-width: 700px) {
  div {
    margin-top: 150px;
  }
}
</style>
