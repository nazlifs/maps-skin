<template>
  <div>
    <div id="map" style="width: 100%; height: 500px;"></div>
  </div>
</template>

<script>
export default {
  name: 'GoogleMap',
  mounted() {
    if (window.google) {
      this.initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      window.initMap = this.initMap;
    }
  },
  methods: {
    initMap() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            const map = new google.maps.Map(document.getElementById('map'), {
              center: { lat: latitude, lng: longitude }, 
              zoom: 14,
            });

            new google.maps.Marker({
              position: { lat: latitude, lng: longitude },
              map: map,
              title: 'Your Location',
            });
          },
          () => {
            alert("Gagal mendapatkan lokasi Anda.");
            this.loadDefaultMap();
          }
        );
      } else {
        alert("Geolocation tidak didukung oleh browser Anda.");
        this.loadDefaultMap();
      }
    },
    loadDefaultMap() {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -6.200000, lng: 106.816666 }, 
        zoom: 10,
      });

      new google.maps.Marker({
        position: { lat: -6.200000, lng: 106.816666 },
        map: map,
        title: 'Jakarta',
      });
    },
  },
};
</script>

<style scoped>
#map {
  border: 1px solid #ccc;
}
</style>
