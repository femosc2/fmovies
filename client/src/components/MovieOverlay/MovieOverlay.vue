<template>
  <div v-if="movies.overlay" id="overlay" @click="movies.closeOverlay()">
    <section id="movieInfo">
      <h1>{{ movies.overlay.Title }} ({{ movies.overlay.Year }})</h1>
      <h3>Runtime: {{ movies.overlay.Runtime }}</h3>
      <ul id="genre">
        <li v-for="genre in movies.overlay.Genre" :key="genre">{{ genre }}</li>
      </ul>
      <h2>Director: {{ movies.overlay.Director }}</h2>
      <h2>Starring:</h2>
      <ul>
        <li v-for="actor in movies.overlay.Actors" :key="actor">{{ actor }}</li>
      </ul>
      <h2>IMDB rating: {{ movies.overlay.ImdbRating }}</h2>
      <h2>My rating: {{ formatRating(movies.overlay.FemoRating) }}</h2>
      <p>{{ movies.overlay.Plot }}</p>
    </section>
    <img :src="movies.overlay.Poster" />
    <div @click="movies.closeOverlay()">X</div>
  </div>
</template>

<script setup lang="ts">
import { useMoviesStore } from '@/stores/movies';
import { formatRating } from '@/format';

const movies = useMoviesStore();
</script>

<style scoped>
#overlay {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  z-index: 90000;
  position: fixed;
  top: 0;
  overflow: hidden;
  color: white;
}

img {
  right: 60%;
  transform: scale(1.5);
  position: absolute;
  top: 25%;
}

#movieInfo {
  text-align: left;
  margin-left: 50%;
  margin-top: 10%;
}

ul {
  list-style: none;
}

#genre {
  display: inline-flex;
}

li {
  padding: 2px 5px 2px 5px;
}

@media screen and (max-width: 700px) {
  img {
    transform: scale(0.5);
    left: -12%;
    top: 0%;
  }

  h1 {
    font-size: 20px;
  }
  h2 {
    font-size: 14px;
  }
  h3 {
    font-size: 12px;
  }
  #genre {
    display: block;
  }
  p {
    font-size: 15px;
  }
}
</style>
