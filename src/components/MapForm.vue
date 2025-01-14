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

      <input type="hidden" name="location_name" value="locationData.name" />
      <input
        type="hidden"
        name="location_longitude"
        value="locationData.longitude"
      />
      <input
        type="hidden"
        name="location_latitude"
        value="locationData.latitude"
      />

      <button
        type="submit"
        disable="isLoading"
        class="w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :disable="isLoading"
      >
        {{ isLoading ? "Loading..." : "Submit" }}
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
      isLoading: false,
    };
  },
  watch: {
    searchQuery(newQuery) {
      if (!newQuery) {
        this.locationOptions = [];
      }
    },
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
      this.searchQuery = option.description;
    },

    async handleSubmit() {
      this.isLoading = true;
      await this.storeLocationData();
      console.log("submit data:", this.locationData);

      setTimeout(() => {
        this.isLoading = false;
        console.log("submit selesai");

        (this.searchQuery = ""),
          (this.locationData = []),
          (this.selectedLocation = null);
        this.locationData = {
          name: "",
          longitude: "",
          latitude: "",
        };
      }, 2000);
    },
  },
};
</script>

<style scoped></style>
