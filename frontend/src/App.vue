<template>
  <div>
    <Home></Home>
    <router-view />
    <!--custom directives to home-->
  </div>
</template>

<script>
// import axios from "axios";
import Home from "./views/Home.vue";

export default {
  name: "App",
  component: {
    Home,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: lightgrey;
}
</style>
