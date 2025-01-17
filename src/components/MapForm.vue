<template>
  <div class="flex justify-center items-center mt-3">
    <form
      @submit.prevent="handleSubmit"
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
        :disabled="isLoading"
        class="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {{ isLoading ? "Loading..." : "Submit" }}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    moveToLocation: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: "",
      locationOptions: [],
      selectedLocation: null,
      isLoading: false,
    };
  },
  methods: {
    async fetchLocationOptions() {
      if (this.searchQuery.length > 0) {
        const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
        const url = `maps-api/maps/api/place/autocomplete/json?input=${this.searchQuery}&key=${apiKey}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          this.locationOptions = data.predictions || [];
        } catch (error) {
          console.error("Error fetching location options:", error);
        }
      } else {
        this.locationOptions = [];
      }
    },
    async fetchLocationDetails(placeId) {
      const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
      const url = `/maps-api/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data.result.geometry.location;
      } catch (error) {
        console.error("Error fetching location details:", error);
        return null;
      }
    },
    selectLocation(option) {
      this.selectedLocation = option;
      this.searchQuery = option.description;
    },
    async handleSubmit() {
      if (!this.selectedLocation) return;
      this.isLoading = true;
      try {
        const location = await this.fetchLocationDetails(
          this.selectedLocation.place_id
        );
        if (location) {
          await this.moveToLocation(location.lat, location.lng);
        }
      } catch (error) {
        console.error("Error during submit:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
