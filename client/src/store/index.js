import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    movies: [],
    movieOverlay: [],
    filteredMovies: [],
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
