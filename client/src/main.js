import Vue from 'vue'
import App from './App.vue'
import store from './store'
import dotenv from "dotenv"
import firebase from "firebase";

Vue.config.productionTip = false

dotenv.config();

const config = {
  apiKey: process.env.VUE_APP_FIREBASE_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
};

firebase.initializeApp(config);

export const db = firebase.database();

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
