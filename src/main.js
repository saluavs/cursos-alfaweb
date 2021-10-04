import Vue from "vue";
import Firebase from "firebase";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "material-design-icons-iconfont/dist/material-design-icons.css";

const firebaseConfig = {
  apiKey: "AIzaSyANOZAbiHdc0JhQQG_xK715wsQl7rjJ5TA",
  authDomain: "cursos-99841.firebaseapp.com",
  projectId: "cursos-99841",
  storageBucket: "cursos-99841.appspot.com",
  messagingSenderId: "195137234448",
  appId: "1:195137234448:web:1057ad17c54b946ac70c95",
};
Firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");