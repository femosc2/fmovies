<template>
<div>
  <h2>Sort By:</h2>
  <button @click="setSortBy('rating')">Rating</button>
  <button @click="setSortBy('watched')">Recently Watched</button>
</div>
</template>

<script>
export default {
  name: "HelloWorld",
  methods: {
    setSortBy(sortBy) {
      this.$store.commit('setSortBy', sortBy);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" scoped>

div {
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;  
}

@media screen and (min-width: 700px) {
  }
</style>
