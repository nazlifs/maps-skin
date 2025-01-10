<template>
  <div id="app" class="min-h-screen bg-gray-800 text-white py-8 px-4">
    <h1 class="text-3xl font-semibold mb-6 text-center">Google Maps with Location Form</h1>

    <div class="max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
      <MapForm @update-location="updateLocation" />
    </div>

    <div class="mt-6">
      <GoogleMap :location="currentLocation" />
    </div>
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
      currentLocation: { lat: -6.200000, lng: 106.816666 }, 
    };
  },
  methods: {
    updateLocation(newLocation) {
      this.currentLocation = newLocation;
    },
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
