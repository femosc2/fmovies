<template>
  <li>
    <figure
      class="movie"
      :style="{ 'background-image': 'url(' + movie.Poster + ')' }"
      @click="open"
    >
      <div>
        {{ formatRating(movie.FemoRating) }}
      </div>
    </figure>
  </li>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { formatRating } from '@/format';
import { movieSlug } from '@/slug';
import type { Movie } from '@shared/movie';

const props = defineProps<{ movie: Movie }>();
const { movie } = props;
const router = useRouter();

// Navigate to the movie's URL; CatalogView opens the modal from the route.
function open() {
  router.push(`/movie/${movieSlug(movie.Title)}`);
}
</script>

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
  background: linear-gradient(360deg, rgba(44, 62, 80, 0.9) 65%, rgba(0, 212, 255, 0) 100%);
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
    margin-top: -85%;
  }
  div {
    font-size: 6rem;
    padding-top: none;
  }
}
</style>
