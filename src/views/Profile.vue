<template>
    <div class="profile">
        <app-navbar></app-navbar>
        <app-sidebar></app-sidebar>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

export default {
    name: 'profile',
    data() {
        return {
        }
    },
    components: {
        appNavbar: Navbar,
        appSidebar: Sidebar
    },
    created() {
        if(!this.$store.getters.isAuthenticated) {
            this.$router.replace('/')
        }
    }
}
</script>

