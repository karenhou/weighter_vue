<template>
  <div>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
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
