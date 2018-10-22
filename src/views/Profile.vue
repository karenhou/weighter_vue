<template>
    <div class="profile">
        <app-navbar v-if="user" :alias="user.alias"/>
        <app-sidebar v-if="user" :user_id="user.user_id"/>
    </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import Table from '@/components/Table.vue'
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
    name: 'Profile',
    data() {
        return {
            profile: null,
            feedback: null,
            user: null,
        }
    },
    components: {
        appNavbar: Navbar,
        appSidebar: Sidebar,
        appTable: Table
    },
    created(){
        let ref = db.collection('users')

        // get current user
        ref.where('user_id', '==', firebase.auth().currentUser.uid).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                this.user = doc.data(),
                this.user.id = doc.id
            })
        }).catch(err => {
            console.log(err)
        })
        // profile data
        ref.doc(this.$route.params.id).get()
        .then(user => {
            this.profile = user.data()
        })
    }
}
</script>

