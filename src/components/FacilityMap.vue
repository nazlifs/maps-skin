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
import { ref } from "vue";

export default {
  name: "FacilityMap",
  setup(_, { emit }) {
    const searchQuery = ref("");
    const locationOptions = ref([]);
    const selectedLocation = ref(null);
    const isLoading = ref(false);

    const fetchLocationOptions = async () => {
      if (searchQuery.value.length > 0) {
        const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
        const url = `maps-api/maps/api/place/autocomplete/json?input=${searchQuery.value}&key=${apiKey}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          locationOptions.value = data.predictions || [];
        } catch (error) {
          console.error("Error fetching location options:", error);
        }
      } else {
        locationOptions.value = [];
      }
    };

    const fetchLocationDetails = async (placeId) => {
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
    };

    const selectLocation = (option) => {
      selectedLocation.value = option;
      searchQuery.value = option.description;
    };

    const handleSubmit = async () => {
      if (!selectedLocation.value) return;
      isLoading.value = true;
      try {
        const location = await fetchLocationDetails(
          selectedLocation.value.place_id
        );
        if (location) {
          emit("location-selected", location);
        }
      } catch (error) {
        console.error("Error during submit:", error);
      } finally {
        isLoading.value = false;
        searchQuery.value = "";
        locationOptions.value = [];
        selectLocation.value = null;
      }
    };

    return {
      searchQuery,
      locationOptions,
      selectedLocation,
      isLoading,
      fetchLocationOptions,
      selectLocation,
      handleSubmit,
    };
  },
};
</script>
