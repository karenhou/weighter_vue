<template>
    <div class="container login">
        <form class="form-login" @submit.prevent="login">
            <div class="text-center mb-4">
                <img class="mb-4" src="#" alt="" width="72" height="72">
                <h1 class="h3 mb-3 font-weight-normal">Login Tables</h1>
            </div>

            <div class="form-label-group">
                <label for="email">Email address</label>
                <input type="email" class="form-control" placeholder="Email address" required="" autofocus="" v-model="email">
            </div>

            <div class="form-label-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" placeholder="Password" required="" v-model="password">
            </div>
            <p v-if="feedback" class="text-danger text-center">{{ feedback }}</p>
            <p class="btns text-center">
                <router-link to="/signup" class="btn btn-primary my-2">SignUp</router-link>
                <button class="btn btn-primary my-2" @click="login">Login</button>
            </p>
        </form>
    </div>
</template>
<script>
/* eslint-disable */
import firebase from 'firebase'

export default {
    name: 'Login',
    data() {
        return {
            email: null,
            password: null,
            feedback: null
        }
    },
    methods: {
        login() {
            if(this.email && this.password) {
                this.$store.dispatch('login', {email: this.email, password: this.password})
                // this.$router.push({ name: 'Profile', params: {id: this.$store.getters.user.uid}})
            }
           // if(this.email && this.password) {
            //     firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            //     .then(cred => {
            //         this.$router.push({ name: 'Profile', params: {id: cred.user.uid}})
            //     }).catch(err => {
            //         this.feedback = err.message
            //     })
            //     this.feedback = null
            // } else {
            //     this.feedback = 'please fill in both fields'
            // }
        },
        signup() {
            this.$router.push({ name: 'signup'})
        }
    }
}
</script>

<style>
.login {
    padding-top: 1em;
}

.login .form-login {
    width: 100%;
    max-width: 420px;
    padding: 15px;
    margin: auto;
    border: solid 2px black;
}
</style>

