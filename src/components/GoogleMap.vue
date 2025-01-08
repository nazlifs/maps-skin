<template>
  <div>
    <GoogleMap 
      :api-key="googleMapsApiKey" 
      style="width: 100%; height: 500px" 
      :center="center" 
      :zoom="15" 
      @ready="onMapReady">
    </GoogleMap>
  </div>
</template>

<script>
import { GoogleMap } from 'vue3-google-map';
import axios from 'axios';

export default {
  components: {
    GoogleMap,
  },
  data() {
    return {
      googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
      center: {
        lat: -6.1751,
        lng: 106.8650,
      },
      map: null,
      markers: [],
    };
  },
  methods: {
    async fetchAccommodations() {
      console.log("Fetching accomodation..")
      try {
        const response = await axios.get(
          "https://mapping-staging-11d8643b0e13.herokuapp.com/accommodations.json?_variant=map_data"
        );
        console.log("Response received:", response)
        console.log("Response received:", response.data)
        const accommodations = response.data;

        // Tambahkan marker untuk setiap akomodasi
        accommodations.forEach((accommodation) => {
          if (accommodation.latitude && accommodation.longitude) {
            const marker = new google.maps.marker.AdvancedMarkerElement({
              map: this.map,
              position: {
                lat: parseFloat(accommodation.latitude),
                lng: parseFloat(accommodation.longitude),
              },
              title: accommodation.name || "Accommodation",
            });

            this.markers.push(marker);
          }
        });
      } catch (error) {
        console.error("Error fetching accommodations:", error);
      }
    },
    onMapReady(map) {
      this.map = map;
      this.fetchAccommodations(); // Fetch data saat peta siap
    },
  },
  created() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  },
};
</script>
