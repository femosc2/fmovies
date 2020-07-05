<template>
  <div>
    <input type="text" v-model="search" v-on:keyup="setFilter" autofocus placeholder="Not Yet Implemented" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      filter: [],
    };
  },
  components: {},
  computed: {
    movies() {
      return this.$store.state.movies;
    }
  },
  methods: {
    setFilter() {
        this.$store.commit('setSearch', this.search.toLowerCase())
        this.filter = this.movies.filter((m) => 
            m.Title.toLowerCase().includes(this.search.toLowerCase()) || m.Director.toLowerCase().includes(this.search.toLowerCase()) || m.Plot.toLowerCase().includes(this.search.toLowerCase()) || m.Year.toLowerCase().includes(this.search.toLowerCase())
        )
        this.$store.commit('setFilteredMovies', this.filter);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
  width: 50vw;
  height: 5vh;
  text-align: center;
  font-size: 40px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 20px;
}
</style>
