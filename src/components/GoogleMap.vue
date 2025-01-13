<template>
  <div>
    <div id="map" style="width: 100%; height: 500px; position: relative"></div>
  </div>
</template>

<script>
import customStyles from "./mapStyle";
import Homestay from "../assets/icons/homestay.svg";
import Apartment from "../assets/icons/apartment.svg";
import RoomingHouse from "../assets/icons/rooming-house.svg";

export default {
  name: "GoogleMap",
  data() {
    return {
      map: null,
      center: { lat: -6.2, lng: 106.816666 },
      markers: [],
      accommodations: [],
    };
  },

  mounted() {
    if (window.google) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAP_API_KEY
      }&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      window.initMap = this.initMap;
    }
  },
  methods: {
    async initMap() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            this.initializeMap(customStyles);
          },
          () => {
            alert("Gagal mendapatkan lokasi Anda.");
            this.initializeMap(customStyles);
          }
        );
      } else {
        alert("Geolocation tidak didukung oleh browser Anda.");
        this.initializeMap(customStyles);
      }
    },
    initializeMap(styles) {
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: this.center,
        zoom: 14,
        styles: styles,
      });

      new google.maps.Marker({
        position: this.center,
        map: this.map,
        title: "Your Location",
      });

      this.loadAccomodations();

      this.map.addListener("idle", () => {
        this.updateVisibleMarkers();
      });
    },
    async loadAccomodations() {
      try {
        const response = await fetch(
          "/api/accommodations.json?_variant=map_data"
        );
        if (!response.ok) throw new Error("Gagal memuat data akomodasi.");

        const accommodations = await response.json();
        if (!Array.isArray(accommodations.records)) {
          throw new Error(
            "Data akomodasi tidak sesuai format yang diharapkan."
          );
        }

        this.accommodations = accommodations.records;
        this.updateVisibleMarkers();
      } catch (error) {
        console.error(error.message);
        alert("Terjadi kesalahan saat memuat data akomodasi.");
      }
    },
    updateVisibleMarkers() {
      if (!this.map) return;

      const bounds = this.map.getBounds();
      if (!bounds) return;

      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];

      const parser = new DOMParser();
      const homestay = parser.parseFromString(
        Homestay,
        "image/svg+xml"
      ).documentElement;

      const icons = {
        serviced_apartments: {
          color: "#000000",
          icon: Apartment,
        },
        homestay: {
          color: "#000000",
          icon: Homestay,
        },
        unregistered_rooming_house: {
          color: "#000000",
          icon: RoomingHouse,
        },
      };

      const categoryIcons = {
        serviced_apartments: Apartment,
        homestay: Homestay,
        unregistered_rooming_house: RoomingHouse,
      };

      this.accommodations.forEach((accommodation) => {
        const { locationLatitude, locationLongitude, locationName, category } =
          accommodation;
        const lat = parseFloat(locationLatitude);
        const lng = parseFloat(locationLongitude);

        if (bounds.contains({ lat, lng })) {
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map: this.map,
            title: `${locationName} (${category})`,
            color: icons[category]?.color,
            scaledSize: new google.maps.Size(50, 50),
            icon:
              icons[category]?.icon ||
              "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
          });
          this.markers.push(marker);
        }
      });
    },
  },
};
</script>

<!-- <style scoped>
#map {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
}
</style> -->
