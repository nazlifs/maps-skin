<template>
  <div id="app">
    <h1>Google Maps with Location Form</h1>
    <!-- Komponen Form -->
    <MapForm @update-location="updateLocation" />

    <!-- Komponen Peta -->
    <GoogleMap :location="currentLocation" />
  </div>
</template>

<script>
import MapForm from './components/MapForm.vue';
import GoogleMap from './components/GoogleMap.vue';

export default {
  name: 'App',
  components: {
    MapForm,
    GoogleMap,
  },
  data() {
    return {
      currentLocation: { lat: -6.200000, lng: 106.816666 }, // Default lokasi (Jakarta)
    };
  },
  methods: {
    updateLocation(newLocation) {
      this.currentLocation = newLocation; // Perbarui lokasi berdasarkan data dari form
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 20px;
}
</style>
