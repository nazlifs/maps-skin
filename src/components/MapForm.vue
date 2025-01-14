<template>
  <div class="flex justify-center items-center mt-3">
    <form
      @submit.prevent="handleSubmit"
      action="https://mapping-staging-11d8643b0e13.herokuapp.com/accommodations/new?_variant=api_test"
      method="POST"
      class="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg text-black"
    >
      <label for="address" class="block text-gray-700 font-semibold mb-2">
        Enter Address:
      </label>
      <input
        type="text"
        id="address"
        v-model="searchQuery"
        @input="fetchLocationOptions"
        placeholder="Enter an address"
        required
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <ul
        v-if="locationOptions.length > 0"
        class="border border-gray-300 rounded-lg mt-2 max-h-40 overflow-auto"
      >
        <li
          v-for="option in locationOptions"
          :key="option.place_id"
          @click="selectLocation(option)"
          class="p-2 hover:bg-gray-200 cursor-pointer"
        >
          {{ option.description }}
        </li>
      </ul>

      <button
        type="submit"
        class="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      locationOptions: [],
      selectedLocation: null,
      locationData: {
        name: "",
        longitude: "",
        latitude: "",
      },
    };
  },
  methods: {
    async fetchLocationOptions() {
      if (this.searchQuery.length > 2) {
        const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
        const url = `maps-api/maps/api/place/autocomplete/json?input=${this.searchQuery}&key=${apiKey}`;

        try {
          const response = await fetch(url);
          const data = await response.json();
          this.locationOptions = data.predictions || [];
        } catch (error) {
          console.error("Error fetching location options:", error);
        }
      }
    },
    async storeLocationData() {
      if (this.selectedLocation) {
        const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
        const placeId = this.selectedLocation.place_id;
        const url = `maps-api/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

        try {
          const response = await fetch(url);
          const data = await response.json();
          const location = data.result.geometry.location;

          this.locationData.name = this.selectedLocation.description;
          this.locationData.longitude = location.lng;
          this.locationData.latitude = location.lat;
        } catch (error) {
          console.error("Error fetching location details:", error);
        }
      }
    },

    selectLocation(option) {
      this.selectedLocation = option;
      console.log("selected location", option);
    },

    handleSubmit() {
      const locationData = {
        name: this.locationData.name,
        longitude: this.locationData.longitude,
        latitude: this.locationData.latitude,
      };
      console.log("Submitting data:", this.locationData);
    },
  },
};
</script>

<style scoped></style>
