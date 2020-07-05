<template>
    <ul>
      <Movie v-for="movie in movies" :key="movie.title" :movie="movie"/>
    </ul>
</template>

<script>
import Movie from "./components/Movie";
export default {
  name: "HelloWorld",
  props: ["movies"],
  components: {
    Movie
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;
  justify-content: center;
}
</style>
