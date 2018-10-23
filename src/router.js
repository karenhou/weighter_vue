import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Profile from './views/Profile.vue'
import SignUp from './views/SignUp.vue'
import firebase from 'firebase'

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: Profile/*,
      meta: {
        requiresAuth: true
      }*/
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    { path: '*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {
  // check to see if route requires auth
  if(to.matched.some(rec => rec.meta.requiresAuth)){
    // check auth state of user
    let user = firebase.auth().currentUser;
    if(user){
      // user signed in, proceed to route
      next()
    } else {
      // no user signed in, redirect to login
      next({ name: 'Home' })
    }
  } else {
    next()
  }
})

export default router
