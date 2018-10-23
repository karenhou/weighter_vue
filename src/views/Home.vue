<template>
  <div class="home">
    <div class="container">
      <h1 class="text-center">Weighter</h1>
      <p class="description text-muted text-center">Welcome to Weighter where you can keep track of your weights</p>
      <app-login/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/Login'

export default {
  name: 'Home',
  components: {
    appLogin: Login
  },
  created() {
      // console.log('is auth? in login', this.$store.getters.isAuthenticated)
      if(this.$store.getters.isAuthenticated) {
          this.$router.push({ name: 'profile', params: {id: this.$store.getters.user.user_id}})
      }
  }
}
</script>

<style>
.home {
  margin-top: 2em;
}

.home .description {
  margin-bottom: 5px;
}
.home a {
  margin: 5px;
}
</style>

