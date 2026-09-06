<template>
  <div v-if="movies.overlay" class="overlay" @click.self="close">
    <div class="modal">
      <button class="close" aria-label="Close" @click="close">×</button>

      <img
        v-if="hasPoster"
        class="poster"
        :src="movies.overlay.Poster"
        :alt="movies.overlay.Title"
        @error="posterFailed = true"
      />
      <div v-else class="poster noimg">No poster</div>

      <div class="info">
        <h1>{{ movies.overlay.Title }} <span class="year">({{ movies.overlay.Year }})</span></h1>
        <p class="meta">
          <span v-if="movies.overlay.Runtime && movies.overlay.Runtime !== 'N/A'">{{ movies.overlay.Runtime }}</span>
          <span v-if="genres">· {{ genres }}</span>
        </p>

        <div class="ratings">
          <span class="rating"><small>IMDb</small> {{ movies.overlay.ImdbRating }}</span>
          <span class="rating felo"><small>Felix</small> {{ formatRating(movies.overlay.FemoRating) }}</span>
        </div>

        <p><strong>Director:</strong> {{ movies.overlay.Director }}</p>
        <p v-if="actors"><strong>Starring:</strong> {{ actors }}</p>
        <p class="plot">{{ movies.overlay.Plot }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useMoviesStore } from '@/stores/movies';
import { formatRating } from '@/format';

const movies = useMoviesStore();
const router = useRouter();
const posterFailed = ref(false);

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && movies.overlay) close();
}
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));

// Reset the broken-poster flag whenever a different movie is opened.
watch(
  () => movies.overlay?.Title,
  () => (posterFailed.value = false),
);

const hasPoster = computed(() => {
  const p = movies.overlay?.Poster;
  return !posterFailed.value && !!p && p !== 'N/A';
});

const asList = (v: unknown): string =>
  Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean).join(', ') : v ? String(v) : '';

const genres = computed(() => asList(movies.overlay?.Genre));
const actors = computed(() => asList(movies.overlay?.Actors));

function close() {
  // Navigate back to the catalog; CatalogView clears the overlay from the route.
  router.push('/');
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 90000;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow-y: auto;
}
.modal {
  position: relative;
  display: flex;
  gap: 28px;
  width: 100%;
  max-width: 860px;
  max-height: 88vh;
  overflow-y: auto;
  background: #1f2d3a;
  border-radius: 12px;
  padding: 28px;
  text-align: left;
  color: #fff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
/* Uniform poster box regardless of source image dimensions. */
.poster {
  width: 240px;
  height: 360px;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
}
.poster.noimg {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  opacity: 0.5;
}
.info {
  flex: 1;
  min-width: 0; /* allow text to wrap instead of overflowing */
}
.info h1 {
  margin: 0 0 6px;
  font-size: 26px;
  line-height: 1.2;
}
.year {
  opacity: 0.65;
  font-weight: 400;
}
.meta {
  opacity: 0.75;
  margin: 0 0 16px;
}
.ratings {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
}
.rating {
  background: rgba(255, 255, 255, 0.08);
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 18px;
}
.rating small {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.6;
  text-transform: uppercase;
  margin-right: 4px;
}
.rating.felo {
  background: rgba(66, 185, 131, 0.2);
  color: #6ee7b0;
}
.info p {
  margin: 8px 0;
  line-height: 1.5;
}
.plot {
  margin-top: 16px;
  opacity: 0.9;
  overflow-wrap: anywhere;
}
.close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  color: #fff;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.close:hover {
  opacity: 1;
}
@media screen and (max-width: 700px) {
  .modal {
    flex-direction: column;
    align-items: center;
    gap: 18px;
    padding: 20px;
  }
  .info {
    width: 100%;
  }
  .info h1 {
    font-size: 22px;
  }
}
</style>
