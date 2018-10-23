<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {

    }
  },
  created() {
    this.$store.dispatch('loginWithCreditials')
  }
}
</script>


<style>
.app {
  font-family: 'Gaegu', cursive;
}
</style>
