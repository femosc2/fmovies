import { defineStore } from 'pinia';
import { ref, get } from 'firebase/database';
import { db } from '@/firebase';
import type { Movie } from '@shared/movie';

type SortBy = 'rating' | 'watched';

interface MoviesState {
  movies: Movie[];
  search: string;
  sortBy: SortBy;
  overlay: Movie | null;
  loaded: boolean;
}

export const useMoviesStore = defineStore('movies', {
  state: (): MoviesState => ({
    movies: [],
    search: '',
    sortBy: 'rating',
    overlay: null,
    loaded: false,
  }),

  getters: {
    // Pure, non-mutating sort (the old code sorted the store array in place). Copy first.
    sortedMovies(state): Movie[] {
      const copy = [...state.movies];
      if (state.sortBy === 'watched') {
        return copy.sort((a, b) => Date.parse(b.Watched) - Date.parse(a.Watched));
      }
      return copy.sort((a, b) => Number(b.FemoRating) - Number(a.FemoRating));
    },

    // Search across Title/Director/Plot/Year. Empty search => full (sorted) list. This replaces
    // the old dual `movies`/`filteredMovies` arrays and the `length === 0`-means-"no search" hack.
    displayMovies(): Movie[] {
      const q = this.search.trim().toLowerCase();
      const list = this.sortedMovies;
      if (!q) return list;
      return list.filter(
        (m) =>
          m.Title.toLowerCase().includes(q) ||
          m.Director.toLowerCase().includes(q) ||
          m.Plot.toLowerCase().includes(q) ||
          m.Year.toLowerCase().includes(q),
      );
    },
  },

  actions: {
    async fetchMovies() {
      const snap = await get(ref(db, '/'));
      this.movies = snap.exists() ? (Object.values(snap.val()) as Movie[]) : [];
      this.loaded = true;
    },
    setSearch(search: string) {
      this.search = search;
    },
    setSortBy(sortBy: SortBy) {
      this.sortBy = sortBy;
    },
    openOverlay(movie: Movie) {
      this.overlay = movie;
    },
    closeOverlay() {
      this.overlay = null;
    },
  },
});
