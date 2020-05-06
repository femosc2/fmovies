<template>
<li>
  <figure class="movie"
  v-bind:style="{ 'background-image': 'url(' + movie.Poster + ') ' }">
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
}

div {
  background: linear-gradient(360deg, rgba(0,0,0, 0.8) 65%, rgba(0,212,255,0) 100%);
  overflow: none;
  height: inherit;
  width: inherit;
  text-align: center;
  padding-top: 66%;
  font-size: 6rem;
  color: red;
}
</style>
