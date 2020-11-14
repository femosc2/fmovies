<template>
<li>
  <figure class="movie"
  v-bind:style="{ 'background-image': 'url(' + movie.Poster + ') ' }"
  @click="setMovieOverlay()">
  <div>
    {{ movie.FemoRating }}
  </div>
  </figure>
</li>
</template>

<script>
export default {
  name: "HelloWorld",
  props: ["movie"],
  methods: {
    setMovieOverlay() {
      this.$store.commit('setMovieOverlay', this.movie);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" scoped>

.movie {
    background-size: contain;
    background-repeat: no-repeat;
    width: 200px;
    height: 400px;
    padding: 0;
    margin: 0;
    margin-top: -55%;
    cursor: pointer;
}

div {
  background: linear-gradient(360deg, rgba(44,62,80, 0.9) 65%, rgba(0,212,255,0) 100%);
  overflow: none;
  height: inherit;
  width: inherit;
  text-align: center;
  padding-top: 66%;
  font-size: 6rem;
  color: white;
}

@media screen and (max-width: 700px) {
  .movie {
    width: 50vw;
  }
  div {
    font-size: 6rem;
  }
  }
</style>
