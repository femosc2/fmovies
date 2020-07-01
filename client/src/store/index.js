import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    movies: [],
    movieOverlay: [],
  },
  mutations: {
    setMovies(state, movies) {
      state.movies = movies;
    },
    setMovieOverlay(state, movie) {
      state.movieOverlay = movie;
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    movieOverlay(state) {
      return state.movieOverlay;
    }
  }
})
