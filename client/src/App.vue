<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Movies />
  </div>
</template>

<script>
import Movies from './components/Movies/Movies.vue'
import { db } from "./main";

export default {
  name: 'App',
  components: {
    Movies,
  },
  created() {
    db.ref('/').once('value').then((data) => {
      this.$store.commit('setMovies', Object.values(data.toJSON()));
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
  background-color: black;
}
</style>
