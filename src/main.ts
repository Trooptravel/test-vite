import { createApp } from "vue";
import App from "./App.vue";
import vue3GMaps from "../src/plugins/gmap-vue3";
import router from "./router";
import { store } from "./store";

import "./assets/css/tailwind.css";

createApp(App)
  .use(store)
  .use(router)
  .use(vue3GMaps, {
    installComponents: true,
    load: {
      key: "AIzaSyANqjdfVKcdJqe1lnXGnqba4rjQ7ucPGo8",
      libraries: "places,geometry",
      v: "weekly",
      language: "en",
    },
  })
  .mount("#app");
