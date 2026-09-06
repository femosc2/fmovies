<template>
  <div class="stats">
    <header>
      <h1>fmovies</h1>
      <NavTabs />
    </header>

    <p v-if="!movies.loaded" class="loading">Crunching the numbers…</p>
    <p v-else-if="s.totalMovies === 0" class="loading">No movies yet.</p>

    <template v-else>
      <!-- Hero numbers -->
      <section class="cards">
        <div class="card">
          <span class="big">{{ s.totalMovies }}</span>
          <span class="cap">movies watched</span>
        </div>
        <div class="card">
          <span class="big">{{ s.totalRuntimeLabel }}</span>
          <span class="cap">total watch time</span>
        </div>
        <div class="card">
          <span class="big">{{ s.avgFemoRating.toFixed(1) }}</span>
          <span class="cap">Felix's avg rating</span>
        </div>
        <div class="card">
          <span class="big">{{ s.avgImdbRating.toFixed(1) }}</span>
          <span class="cap">avg IMDb rating</span>
        </div>
        <div class="card">
          <span class="big">{{ s.avgRuntimeMinutes }}<small> min</small></span>
          <span class="cap">avg runtime</span>
        </div>
      </section>

      <div class="grid">
        <section class="panel">
          <h2>Most-watched actors</h2>
          <BarChart :items="s.topActors" />
        </section>
        <section class="panel">
          <h2>Most-watched directors</h2>
          <BarChart :items="s.topDirectors" />
        </section>
        <section class="panel">
          <h2>Movies by decade</h2>
          <BarChart :items="s.byDecade" />
        </section>
        <section class="panel">
          <h2>Genres</h2>
          <BarChart :items="s.byGenre" />
        </section>
        <section class="panel">
          <h2>Felix's rating distribution</h2>
          <BarChart :items="s.femoDistribution" />
        </section>
        <section v-if="s.watchedByYear.length > 1" class="panel">
          <h2>Movies added by year</h2>
          <BarChart :items="s.watchedByYear" />
        </section>
      </div>

      <div class="grid">
        <section class="panel">
          <h2>Felix loved more than IMDb</h2>
          <MovieStatList :items="s.mostOverrated" :fmt="signed" />
        </section>
        <section class="panel">
          <h2>Loved the same as IMDb</h2>
          <MovieStatList :items="s.sameAsImdb" :fmt="signed" />
        </section>
        <section class="panel">
          <h2>Felix liked less than IMDb</h2>
          <MovieStatList :items="s.mostUnderrated" :fmt="signed" />
        </section>
      </div>

      <section class="superlatives">
        <div v-if="s.longest" class="super">
          <span class="cap">Longest</span>
          <strong>{{ s.longest.Title }}</strong>
          <span>{{ s.longest.Runtime }}</span>
        </div>
        <div v-if="s.shortest" class="super">
          <span class="cap">Shortest</span>
          <strong>{{ s.shortest.Title }}</strong>
          <span>{{ s.shortest.Runtime }}</span>
        </div>
        <div v-if="s.oldest" class="super">
          <span class="cap">Oldest</span>
          <strong>{{ s.oldest.Title }}</strong>
          <span>{{ s.oldest.Year }}</span>
        </div>
        <div v-if="s.newest" class="super">
          <span class="cap">Newest</span>
          <strong>{{ s.newest.Title }}</strong>
          <span>{{ s.newest.Year }}</span>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useMoviesStore } from '@/stores/movies';
import { computeStats } from '@/stats';
import NavTabs from '@/components/NavTabs.vue';
import BarChart from '@/components/Stats/BarChart.vue';
import MovieStatList from '@/components/Stats/MovieStatList.vue';

const movies = useMoviesStore();
const s = computed(() => computeStats(movies.movies));

const signed = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1)}`;

onMounted(() => {
  if (!movies.loaded) movies.fetchMovies();
});
</script>

<style scoped>
.stats {
  min-height: 100vh;
  padding: 24px;
  max-width: 1100px;
  margin: 0 auto;
  color: #fff;
  text-align: left;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.loading {
  text-align: center;
  opacity: 0.7;
  margin-top: 15vh;
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}
.card {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.card .big {
  font-size: 26px;
  font-weight: 700;
  color: #42b983;
  line-height: 1.1;
}
.card .big small {
  font-size: 14px;
  font-weight: 400;
  opacity: 0.7;
}
.cap {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.6;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
.panel {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  padding: 18px;
}
.panel h2 {
  font-size: 15px;
  margin: 0 0 14px;
  opacity: 0.9;
}
.superlatives {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}
.super {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.super strong {
  font-size: 16px;
}
.super span:last-child {
  opacity: 0.7;
  font-size: 14px;
}
</style>
