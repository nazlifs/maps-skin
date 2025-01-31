<template>
  <div>
    <button
      @click="toggleSelect"
      class="bg-gray-800 text-white hover:text-gray-200"
    >
      Tampilkan Radius
    </button>
    <select
      v-if="showSelect"
      v-model="selectedRadius"
      @change="updateRadius"
      class="bg-gray-800 text-white hover:text-gray-200"
    >
      <option
        v-for="radius in radiuss"
        :key="radius"
        :value="radius"
        class="bg-gray-800 text-white"
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
    map: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showSelect: false,
      selectedRadius: 1,
      radiuss: Array.from({ length: 20 }, (_, i) => i + 1),
      circle: null,
    };
  },
  watch: {
    center: {
      immediate: true,
      handler(newCenter) {
        this.updateCircle(newCenter);
      },
    },
  },
  mounted() {
    this.updateCircle();
  },
  methods: {
    toggleSelect() {
      this.showSelect = !this.showSelect;
    },
    updateRadius() {
      this.updateCircle();
    },
    updateCircle() {
      if (this.circle) {
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
    },
  },
  // beforeUnmount() {
  //   if (this.circle) {
  //     this.circle.setMap(null);
  //   }
  // },...
};
</script>
