<template>
    <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#">{{ alias }}'s wall</a>
        <ul class="navbar-nav px-3">
            <li class="nav-item text-nowrap">
                <button class="btn btn-danger" v-if="authorized" @click="onLogout">Signout</button>
                
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: 'Navbar',
    props: ['alias'],
    computed: {
        currentUser: function() {
            return this.$store.getters.user.uid
        },
        authorized() {
            return this.$store.getters.isAuthenticated
        }
    },
    data() {
        return {

        }
    },
    methods: {
        onLogout() {
            this.$store.dispatch('logout')
            this.$router.push({ name: 'home'})
        }
    }
}
</script>

<style>
.nav-bar .form-signin{
    width: 100%;
    max-width: 420px;
    padding: 15px;
    margin: auto;
    border: solid 2px black;
}
</style>
