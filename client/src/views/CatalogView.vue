<template>
  <div id="app">
    <SortBy />
    <Search />
    <Movies />
    <MovieOverlay />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMoviesStore } from '@/stores/movies';
import { movieSlug } from '@/slug';
import SortBy from '@/components/SortBy/SortBy.vue';
import Search from '@/components/Search/Search.vue';
import Movies from '@/components/Movies/Movies.vue';
import MovieOverlay from '@/components/MovieOverlay/MovieOverlay.vue';

const movies = useMoviesStore();
const route = useRoute();

// Keep the detail modal in sync with the URL (/movie/:slug). Works for direct deep links too.
function syncOverlayFromRoute() {
  const slug = route.params.slug;
  if (typeof slug === 'string' && slug) {
    const match = movies.movies.find((m) => movieSlug(m.Title) === slug);
    if (match) movies.openOverlay(match);
    else movies.closeOverlay();
  } else {
    movies.closeOverlay();
  }
}

onMounted(async () => {
  if (!movies.loaded) await movies.fetchMovies();
  syncOverlayFromRoute();
});

watch(() => route.params.slug, syncOverlayFromRoute);
watch(() => movies.loaded, (loaded) => loaded && syncOverlayFromRoute());
</script>

