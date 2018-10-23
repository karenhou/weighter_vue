import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import db from '@/firebase/init'
import router from './router'
import moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    accessToken: null,
    authorized: false,
    histories: []
  },
  mutations: {
    authUser(state, userData) {
      state.accessToken = userData.accessToken
      state.authorized = userData.authorized
    },
    storeUser(state, userData) {
        state.user = userData
    },
    clearUser(state) {
      state.user = null
      state.authorized = false
      state.accessToken = null
    },
    storeHistory(state, userData) {
      state.histories.push(userData)
    },
    clearHistory(state) {
      state.histories = []
    }
  },
  actions: {
    editWeight({dispatch}, userData) {
      db.collection('history').doc(userData.id).update({
        weight: userData.weight,
        fat: userData.fat
      }).then(()=> {
        console.log('edit complete')
        dispatch('getHistories')
      }).catch(err => {
          console.log(err)
      })
    },
    deleteWeight({dispatch}, userData) {
      db.collection('history').doc(userData.id).delete()
        .then(() => {
            console.log('delete')
            // this.histories = this.histories.filter(history => {
            //     return history.id != id
            // })
            //this.$router.go(this.$route.params.id);
            dispatch('getHistories')
        })
    },
    addWeight({dispatch, state}, userData) {
      db.collection('history').add({
        timestamp: Date.now(),
        weight: userData.weight,
        fat: userData.fat,
        user_id: state.user.user_id
      }).then(()=> {
        dispatch('getHistories')
        console.log('add complete')
      }).catch(err => {
        console.log(err)
      })
    },
    getHistories({commit, state}) {
        commit('clearHistory')
        let ref = db.collection('history').where('user_id', '==', state.user.user_id).orderBy('timestamp')
        
        ref.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if(change.type) {
                    let doc = change.doc
                    // this.histories.push({
                    //     id: doc.id,
                    //     fat: parseInt(doc.data().fat),
                    //     weight: parseInt(doc.data().weight),
                    //     timestamp: moment(doc.data().timestamp).format('lll')
                    // })
                    let history = {
                      id: doc.id,
                      fat: parseInt(doc.data().fat),
                      weight: parseInt(doc.data().weight),
                      timestamp: moment(doc.data().timestamp).format('lll')
                    }
                    commit('storeHistory', history)
                    
                }
                
            });
        });
    },
    signUp({commit, dispatch}, userData) {
      firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password)
      .then(cred => {
          db.collection('users').doc(userData.slug).set({
              alias: userData.alias,
              user_id: cred.user.uid
          }).then(() => {
              commit('storeUser', {
                user_id: cred.user.uid,
                email: cred.user.email
              })
    
              commit('authUser', {
                accessToken: cred.qa,
                authorized: true,
              })
              dispatch('getHistories');
              router.push({ name: 'profile', params: {id: cred.user.uid}})
          }).catch(err => {
            console.log('set data err ', err)
          })
      }).catch(err=> {
          console.log('sign up err ', err)
          // this.feedback = err.message
      });
      
      // this.feedback = 'This alias is available'
      
    },
    login({commit, state, dispatch}, userData) {
      firebase.auth().signInWithEmailAndPassword(userData.email, userData.password)
        .then(cred => {
            // console.log('in store login cred ', cred)
            commit('storeUser', {
              user_id: cred.user.uid,
              email: cred.user.email
            })

            commit('authUser', {
              accessToken: cred.qa,
              authorized: true,
            })
            dispatch('getHistories');
            router.push({ name: 'profile', params: {id: state.user.user_id}})
        }).catch(err => {
            console.log('err in store login ', err.message)
        })
    },
    logout({commit}) {
      firebase.auth().signOut().then(() => {
        // Sign-out successful.
        commit('clearUser')
        localStorage.removeItem('myToken')
        localStorage.removeItem('user_id')
      }).catch(error => {
        // An error happened.
        console.log('logout ', error)
      });
      
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isAuthenticated(state) {
      return state.authorized
    },
    historyList(state) {
      return state.histories
    }
  }
})
