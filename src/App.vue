<script setup>
import GoogleMap from './components/GoogleMap.vue';
</script>

<template>
  <div class="container">
    <header>
      <h1>Welcome to My Google Maps App</h1>
    </header>
    <main>
      <GoogleMap msg="Google Maps Component" />
    </main>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  color: #333;
}

header {
  margin-bottom: 2rem;
  text-align: center;
}

header h1 {
  font-size: 2rem;
  color: #333;
}

main {
  width: 100vh;
  max-width: 1200px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 8px;
}
</style>
