<template>
  <div class="upload-form">
    <div class="row">
      <select v-model="mode">
        <option value="title">By title</option>
        <option value="imdbId">By IMDb ID</option>
      </select>
      <input
        v-model.trim="lookup"
        type="text"
        :placeholder="mode === 'title' ? 'e.g. Inception' : 'e.g. tt1375666'"
        @keyup.enter="preview"
      />
      <button :disabled="!lookup || loading" @click="preview">Preview</button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="result" class="preview">
      <img v-if="result.Poster && result.Poster !== 'N/A'" :src="result.Poster" alt="poster" />
      <div class="meta">
        <h3>{{ result.Title }} ({{ result.Year }})</h3>
        <p>{{ result.Genre }} · {{ result.Runtime }}</p>
        <p>Dir: {{ result.Director }}</p>
        <p>IMDb: {{ result.imdbRating }}</p>

        <label>
          My rating (FemoRating)
          <input v-model.trim="rating" type="number" min="0" max="10" step="0.1" />
        </label>

        <button :disabled="!rating || saving" @click="submit">
          {{ saving ? 'Saving…' : 'Add to catalog' }}
        </button>
      </div>
    </div>

    <p v-if="success" class="success">✓ Added “{{ success }}” to the catalog.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { previewOmdb, addMovie, ApiError } from '@/api';
import { useMoviesStore } from '@/stores/movies';
import type { OmdbResponse } from '@shared/movie';

const movies = useMoviesStore();

const mode = ref<'title' | 'imdbId'>('title');
const lookup = ref('');
const rating = ref('');
const result = ref<OmdbResponse | null>(null);
const loading = ref(false);
const saving = ref(false);
const error = ref('');
const success = ref('');

function message(e: unknown): string {
  if (e instanceof ApiError) return `${e.message} (${e.status})`;
  return e instanceof Error ? e.message : 'Something went wrong';
}

async function preview() {
  error.value = '';
  success.value = '';
  result.value = null;
  loading.value = true;
  try {
    result.value = await previewOmdb(
      mode.value === 'title' ? { title: lookup.value } : { imdbId: lookup.value },
    );
  } catch (e) {
    error.value = message(e);
  } finally {
    loading.value = false;
  }
}

async function submit() {
  error.value = '';
  success.value = '';
  saving.value = true;
  try {
    const saved = await addMovie({
      ...(mode.value === 'title' ? { title: lookup.value } : { imdbId: lookup.value }),
      rating: rating.value,
    });
    success.value = saved.Title;
    result.value = null;
    lookup.value = '';
    rating.value = '';
    await movies.fetchMovies(); // refresh the catalog
  } catch (e) {
    error.value = message(e);
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.upload-form {
  max-width: 640px;
  margin: 0 auto;
  color: #fff;
  text-align: left;
}
.row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.row input {
  flex: 1;
  padding: 8px;
}
select,
button,
input {
  font-size: 16px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #567;
}
button {
  cursor: pointer;
  background: #42b983;
  color: #fff;
  border: none;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.preview {
  display: flex;
  gap: 16px;
  background: rgba(255, 255, 255, 0.06);
  padding: 16px;
  border-radius: 8px;
}
.preview img {
  width: 140px;
  height: auto;
  border-radius: 6px;
}
.meta label {
  display: block;
  margin: 12px 0;
}
.meta label input {
  display: block;
  margin-top: 4px;
  width: 120px;
}
.error {
  color: #ff6b6b;
}
.success {
  color: #42b983;
}
</style>
