<template>
  <v-app-bar color="primary" dark prominent class="px-4">
    <v-icon>mdi-bank</v-icon>
    <v-toolbar-title>Synthetic Data Generator</v-toolbar-title>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppHeader",
};
</script>

<style scoped>
.v-app-bar {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%) !important;
  width: 100vw !important;
}
</style>
