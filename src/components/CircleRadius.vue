<template>
  <div>
    <button
      @click="toggleSelect"
      class="bg-gray-800 text-white hover:text-gray-200"
    >
      Tampilkan Radius
    </button>
    <select
      class="bg-gray-800 text-white hover:text-gray-200"
      v-if="showSelect"
      v-model="selectedRadius"
      @change="updateRadius"
    >
      <option
        class="bg-gray-800 text-white hover:text-gray-200"
        v-for="radius in radiuss"
        :key="radius"
        :value="radius"
      >
        {{ radius }} km
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "CircleRadius",
  props: {
    center: {
      type: Object,
      required: true,
    },
    radius: {
      type: Number,
      required: true,
    },
    map: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      circle: null,
      showSelect: false,
      isDrawing: false,
      selectedRadius: this.radius / 1000,
      radiuss: Array.from({ length: 20 }, (_, i) => i + 1),
    };
  },
  mounted() {
    if (window.google && this.map) {
      this.drawCircle();
    } else {
      const checkGoogleInterval = setInterval(() => {
        if (window.google && this.map) {
          this.drawCircle();
          clearInterval(checkGoogleInterval);
        }
      }, 100);
    }
  },
  methods: {
    toggleSelect() {
      this.showSelect = !this.showSelect;
    },
    drawCircle() {
      if (this.circle) {
        console.log("menghapus lingkaran sebelumnya", this.circle);
        this.circle.setMap(null);
        this.circle = null;
      }
      this.circle = new google.maps.Circle({
        strokeColor: "#4938fd",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#4938fd",
        fillOpacity: 0.35,
        map: this.map,
        center: this.center,
        radius: this.selectedRadius * 1000,
      });
      console.log("lingkaran baru dibuat:", this.circle);
      this.isDrawing = false;
    },
    updateRadius() {
      this.drawCircle();
    },
  },
};
</script>
