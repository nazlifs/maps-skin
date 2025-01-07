import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Vue3Geolocation from "vue3-geolocation";

const app = createApp(App);

app.use(Vue3Geolocation);
app.mount("#app");
