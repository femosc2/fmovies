<template>
  <div>
    <input type="text" v-model="search" v-on:keyup="setFilter" autofocus placeholder="Search for a movie, parts of the plot or release year" />
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
    },
    query() {
      return this.search.toLowerCase()
    }
  },
  methods: {
    setFilter() {
        this.$store.commit('setSearch', this.search.toLowerCase())
        this.filter = this.movies.filter((m) => 
            m.Title.toLowerCase().includes(this.query) || m.Director.toLowerCase().includes(this.query) || m.Plot.toLowerCase().includes(this.query) || m.Year.toLowerCase().includes(this.query)
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

@media screen and (max-width: 700px) {
  div {
    display: flex;
    top: 0;
    z-index: 500;
    position: fixed;
    width: 100%;
    background-color: rgba(0,0,0, 0.8);
    height: 8vh;
    box-shadow: 0px 9px 16px 0px rgba(0,0,0,0.75);
  }
  input {
    align-self: center;
    justify-self: center;;
    width: 100%;
    font-size: 13px;
    border-radius: 0;
  }
  }
</style>
