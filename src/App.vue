<template>
  <v-app>
    <v-main>
      <DataGeneratorComponent />
    </v-main>
  </v-app>
</template>

<script>
import DataGeneratorComponent from "./components/DataGeneratorComponent.vue";

export default {
  name: "App",
  components: {
    DataGeneratorComponent,
  },
};
</script>

<style>
html,
body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  overflow-x: hidden;
}

.v-application {
  width: 100% !important;
  padding: 0 !important;
}

.v-main {
  padding: 0 !important;
  width: 100% !important;
}

.v-app-bar {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 1000 !important;
}
</style>
