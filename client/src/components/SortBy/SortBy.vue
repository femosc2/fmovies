<template>
<div>
  <h2>Sort By</h2>
  <button @click="setSortBy('rating')">Rating</button>
  <br />
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
<style lang="scss" scoped>

div {
  position: fixed;
  top: 0;
  right: 0;
  background-color: none;
  height: 250px;
  width: 250px;
  color: #fff;
  opacity: 0.25;
  transition: 0.25s;
  &:hover {
    opacity: 1;
    transition: 0.25s;
  }
}

button {
  border: 0;
  background: none;
  border: 1px solid #2c3e50;
  font-size: 25px;
  color: #000;
  background-color: rgba(255,255,255, 0.80); 
  height: 150px;
  width: 150px;
  text-align: center;
  left: 0;
  border-radius: 50%;
}

@media screen and (min-width: 700px) {
  }
</style>
