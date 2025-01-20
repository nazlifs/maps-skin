<template>
  <div>
    <div id="map" style="width: 100%; height: 500px; position: relative"></div>
    <MapForm :moveToLocation="moveToLocation" />
  </div>
</template>

<script>
import customStyles from "./mapStyle";
import Homestay from "../assets/icons/homestay.svg";
import Apartment from "../assets/icons/apartment.svg";
import RoomingHouse from "../assets/icons/rooming-house.svg";
import { Loader } from "@googlemaps/js-api-loader";
import MapForm from "./MapForm.vue";

export default {
  name: "GoogleMap",
  props: {
    location: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      map: null,
      markers: [],
      accommodations: [],
      transportMarkers: [],
    };
  },
  watch: {
    location(newLocation) {
      this.moveToLocation(newLocation.lat, newLocation.lng);
    },
  },

  mounted() {
    if (window.google) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAP_API_KEY
      }&libraries=places&callback=initMap`;
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
        zoom: 17,
        styles: styles,
      });

      new google.maps.Marker({
        position: this.center,
        map: this.map,
        title: "Your Location",
      });

      this.loadAllNearbyPlace();

      this.map.addListener("idle", () => {
        this.updateVisibleMarkers();
      });
    },

    moveToLocation(lat, lng) {
      const newCenter = { lat, lng };
      this.map.setCenter(newCenter);

      new google.maps.Marker({
        position: newCenter,
        map: this.map,
        title: "selected location",
      });
    },

    async loadAllNearbyPlace() {
      await this.loadAccomodations();
      await this.loadpublicTransport();
    },

    async loadpublicTransport() {
      try {
        if (!google || !google.maps || !google.maps.places) {
          throw new Error("Google Maps Places API tidak tersedia.");
        }
        const service = new google.maps.places.PlacesService(this.map);

        console.log("center location:", this.center);
        service.nearbySearch(
          {
            location: this.center,
            radius: 2000,
            type:
              // "hospital",
              // "pharmacy",
              "transit_station",
            // "subway_station",
            // "train_station",
          },
          (result, status) => {
            console.log("google places status:", status);
            console.log("data marker", result);

            if (status === google.maps.places.PlacesServiceStatus.OK) {
              this.transportMarkers.forEach((marker) => marker.setMap(null));
              this.transportMarkers = [];

              if (result && Array.isArray(result)) {
                result.forEach((place) => {
                  if (place.geometry && place.geometry.location) {
                    const marker = new google.maps.Marker({
                      position: place.geometry.location,
                      map: this.map,
                      title: place.name,
                      icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    });
                    this.transportMarkers.push(marker);
                  }
                });
              } else {
                console.error("Data transport tidak valid:", result);
                alert(
                  "Data transport tidak sesuai dengan format yang diharapkan."
                );
              }
            } else {
              console.error(`Error fetching transport data: ${status}`);
              alert(`Terjadi kesalahan dalam mencari transportasi: ${status}`);
            }
          }
        );
      } catch (error) {
        console.error("Error fetching transport", error);
        alert("Terjadi kesalahan saat mengambil data transportasi.");
      }
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
