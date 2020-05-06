import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    movies: []
  },
  mutations: {
    setMovies(state, movies) {
      state.movies = movies;
    }
  },
  actions: {
  },
  modules: {
  }
})
