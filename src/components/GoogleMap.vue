<template>
  <div>
    <GoogleMap :api-key="googleMapsApiKey" style="width: 100%; height: 500px" :center="center" :zoom="15">
      <Marker :option= "{position: center}" />
    </GoogleMap>
  </div>
</template>

<script>
import { GoogleMap, Marker } from 'vue3-google-map';

export default {
  components: {
    GoogleMap,
    Marker
  },
  data() {
    return {
      googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY, // Ganti dengan API Key Anda
      center: {
        lat: -6.1751,  // Koordinat lat untuk Jakarta, ganti sesuai kebutuhan
        lng: 106.8650  // Koordinat lng untuk Jakarta, ganti sesuai kebutuhan
      }
    };
  },
  created() {
    // Mendapatkan lokasi pengguna jika diizinkan
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }
}
</script>
