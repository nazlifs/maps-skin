<template>
  <div>
    <div id="map" style="width: 100%; height: 500px; position: relative;"></div>
  </div>
</template>

<script>
export default {
  name: "GoogleMap",
  mounted() {
    if (window.google) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      window.initMap = this.initMap;
    }
  },
  methods: {
    async initMap() {
      const customStyles = [
        {
          elementType: "geometry",
          stylers: [{ color: "#ebe3cd" }],
        },
        {
          elementType: "labels.text.fill",
          stylers: [{ color: "#523735" }],
        },
        {
          elementType: "labels.text.stroke",
          stylers: [{ color: "#f5f1e6" }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#c9b2a6" }],
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#dfd2ae" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#f5f1e6" }],
        },
      ];

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            const map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: latitude, lng: longitude },
              zoom: 14,
              styles: customStyles,
            });

            new google.maps.Marker({
              position: { lat: latitude, lng: longitude },
              map: map,
              title: "Your Location",
            });

            await this.addAccommodations(map);
          },
          () => {
            alert("Gagal mendapatkan lokasi Anda.");
            this.loadDefaultMap(customStyles);
          }
        );
      } else {
        alert("Geolocation tidak didukung oleh browser Anda.");
        this.loadDefaultMap(customStyles);
      }
    },
    loadDefaultMap(styles) {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -6.200000, lng: 106.816666 },
        zoom: 10,
        styles: styles,
      });

      new google.maps.Marker({
        position: { lat: -6.200000, lng: 106.816666 },
        map: map,
        title: "Jakarta",
      });

      this.addAccommodations(map);
    },
    async addAccommodations(map) {
      try {
        const response = await fetch('/api/accommodations.json?_variant=map_data');
        
        if (!response.ok) {
          throw new Error("Gagal memuat data akomodasi.");
        }

        const accommodations = await response.json();
        console.log(accommodations);
        
        let accommodationList = [];
        if (Array.isArray(accommodations.records)) {
          accommodationList = accommodations.records;
        } else {
          throw new Error("Data akomodasi tidak sesuai format yang diharapkan");
        }

        accommodationList.forEach((accommodation) => {
          const { locationLatitude, locationLongitude, name } = accommodation;
          const lat = parseFloat(locationLatitude);
          const lng = parseFloat(locationLongitude);

          console.log("Adding marker at", lat, lng);
          console.log("Parsed lat:", lat, "Parsed lng:", lng);

          if (!isNaN(lat) && !isNaN(lng)) {
            setTimeout(() => {
              new google.maps.Marker({
                position: { lat: lat, lng: lng },
                map: map,
                title: name || "Akomodasi",
              });
            }, 500); // Tunggu setengah detik untuk memastikan peta ter-load
          } else {
            console.warn("Koordinat tidak valid:", lat, lng);
          }
        });
      } catch (error) {
        console.error(error.message);
        alert("Terjadi kesalahan saat memuat data akomodasi.");
      }
    },
  },
};
</script>

<style scoped>
#map {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
}
</style>
