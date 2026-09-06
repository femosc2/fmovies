<template>
  <ol class="list">
    <li v-for="{ movie, value } in items" :key="movie.Title">
      <img
        v-if="movie.Poster && movie.Poster !== 'N/A'"
        :src="movie.Poster"
        alt=""
        loading="lazy"
        @error="onImgError"
      />
      <span v-else class="noimg" />
      <span class="title" :title="movie.Title">{{ movie.Title }} <em>({{ movie.Year }})</em></span>
      <span class="value">{{ fmt(value) }}</span>
    </li>
    <p v-if="!items.length" class="empty">No data.</p>
  </ol>
</template>

<script setup lang="ts">
import type { RankedMovie } from '@/stats';

defineProps<{
  items: RankedMovie[];
  fmt: (v: number) => string;
}>();

// Hide broken poster URLs (some legacy records have dead links).
function onImgError(e: Event) {
  (e.target as HTMLImageElement).style.visibility = 'hidden';
}
</script>

<style scoped>
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.list li {
  display: grid;
  grid-template-columns: 32px 1fr auto;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}
img,
.noimg {
  width: 32px;
  height: 48px;
  object-fit: cover;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
}
.title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.title em {
  opacity: 0.6;
  font-style: normal;
}
.value {
  font-weight: 700;
  color: #42b983;
  font-variant-numeric: tabular-nums;
}
.empty {
  opacity: 0.6;
}
</style>
