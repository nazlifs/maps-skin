<template>
  <div id="app" class="min-h-screen bg-gray-800 text-white py-8 px-4">
    <h1 class="text-3xl font-semibold mb-3 text-center">
      Google Maps with Location Form
    </h1>

    <div class="max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
      <MapForm @location-selected="updateLocation" />
    </div>

    <div class="mt-3">
      <GoogleMap :location="currentLocation" />
    </div>
  </div>
</template>

<script>
import MapForm from "./components/FacilityMap.vue";
import GoogleMap from "./components/GoogleMap.vue";
import "font-awesome/css/font-awesome.css";

export default {
  name: "App",
  components: {
    MapForm,
    GoogleMap,
  },
  data() {
    return {
      currentLocation: { lat: -37.80476169700978, lng: 144.96632398787355 },
    };
  },
  methods: {
    updateLocation(location) {
      this.currentLocation = location;
    },
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
