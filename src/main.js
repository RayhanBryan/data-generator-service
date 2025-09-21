import "./style.css";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import App from "./App.vue";

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#667eea",
          secondary: "#764ba2",
          accent: "#f093fb",
          error: "#f5576c",
          info: "#4facfe",
          success: "#00f2fe",
          warning: "#FFC107",
        },
      },
    },
  },
});

const app = createApp(App);

app.use(vuetify);

app.mount("#app");
