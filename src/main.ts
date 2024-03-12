import "./index.css";
import 'primeicons/primeicons.css'

import { createApp } from "vue";
import App from "./App.vue";
import store from "./components/store";

const app = createApp(App);

app.use(store);

app.mount("#app");
