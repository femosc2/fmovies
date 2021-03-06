import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    movies: [],
    movieOverlay: [],
    filteredMovies: [],
    search: "",
    sortBy: 'rating',
  },
  mutations: {
    setMovies(state, movies) {
      state.movies = movies;
    },
    setMovieOverlay(state, movie) {
      state.movieOverlay = movie;
    },
    setFilteredMovies(state, movies) {
      state.filteredMovies = movies;
    },
    setSearch(state, search) {
      state.search = search;
    },
    setSortBy(state, sort) {
      state.sortBy = sort;
    }
    },
  actions: {
  },
  modules: {
  },
  getters: {
    movieOverlay(state) {
      return state.movieOverlay;
    },
    filteredMovies(state) {
      return state.filteredMovies;
    }
  }
})
