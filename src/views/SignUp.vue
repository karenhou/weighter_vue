<template>
    <div class="container sign-up">
        <form class="form-signup" @submit.prevent="signup">
            <div class="text-center mb-4">
                <img class="mb-4" src="#" alt="" width="72" height="72">
                <h1 class="h3 mb-3 font-weight-normal">Sign up Tables</h1>
            </div>

            <div class="form-label-group">
                <label for="email">Email address</label>
                <input v-model="email" type="email" class="form-control" placeholder="Email address" required="true" autofocus="">
                <span v-show="errors.has('email')">{{ errors.first('email') }}</span>
            </div>

            <div class="form-label-group">
                <label for="password">Password</label>
                <input v-model="password" type="password" class="form-control" placeholder="Password" required="true">
                <span v-show="errors.has('password')">{{ errors.first('password') }}</span>
            </div>
            <p v-if="feedback" class="text-danger text-center">{{ feedback }}</p>
            <div class="form-label-group">
                <label for="alias">Alias</label>
                <input v-model="alias" type="text" class="form-control" placeholder="Alias" required="true" autofocus="">
            </div>
            <p class="btns text-center">
                <button class="btn btn-primary my-2" @click="signup">SignUp</button>
                <router-link to="/login" class="btn btn-primary my-2">Login</router-link>
            </p>
            <!--router-link to="/newprofile" class="btn btn-dark my-2">test</router-link-->
        </form>
        
    </div>
</template>
<script>
/* eslint-disable */
import slugify from 'slugify'
import db from '@/firebase/init'
import firebase from 'firebase'
import functions from 'firebase/functions'
import { required, minLength} from 'vuelidate/lib/validators'

export default {
    name: 'SignUp',
    data() {
        return {
            email: null,
            password: null,
            alias: null,
            feedback: null,
            slug: null
        }
    },
    validations: {
        email: {
            required,
            minLength: minLength(4)
        },
        password: {
            required
        },
       
    },
    methods: {
        signup() {
            if(this.alias && this.email && this.password) {
                this.slug = slugify(this.alias, {
                    replacement: '-',
                    remove: /[$*_+.()'"!\-:@]/g,
                    lower: true
                })
                let checkAlias = firebase.functions().httpsCallable('checkAlias')
                checkAlias({ slug: this.slug }).then(result => {
                    if(!result.data.unique) {
                        this.feedback = 'This alias is already in use'
                    } else {
                        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                        .then(cred => {
                            db.collection('users').doc(this.slug).set({
                                alias: this.alias,
                                user_id: cred.user.uid
                            })
                            console.log(cred.user.uid)
                        }).then(() => {
                            this.$router.push({ name: 'Profile'})
                        }).catch(err=> {
                            console.log(err)
                            this.feedback = err.message
                        })
                        this.feedback = 'This alias is available'
                    }
                })
            } else {
                this.feedback = 'you must enter all fields'
            }
        }
    }
}
</script>

<style>
.sign-up {
    padding-top: 1em;
}

.sign-up .form-signup {
    width: 100%;
    max-width: 420px;
    padding: 15px;
    margin: auto;
    border: solid 2px black;
}

.btns button {
    margin: 5px;
}
</style>

