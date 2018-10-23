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
    histories: [],
    chartData: []
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
      state.histories = []
      state.chartData = []
    },
    storeHistory(state, userData) {
      state.histories.push(userData)
    },
    clearHistory(state) {
      state.histories = []
    },
    clearChartData(state) {
      state.chartData = []
    },
    storeChartData(state, userData) {
      state.chartData.push(userData)
    }
  },
  actions: {
    editWeight({dispatch}, userData) {
      db.collection('history').doc(userData.id).update({
        weight: userData.weight,
        fat: userData.fat
      }).then(()=> {
        // console.log('edit complete')
        dispatch('getHistories')
      }).catch(() => {
          // console.log(err)
      })
    },
    deleteWeight({dispatch}, userData) {
      db.collection('history').doc(userData.id).delete()
        .then(() => {
            // console.log('delete')
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
        // console.log('add complete')
      }).catch(() => {
        // console.log(err);
      })
    },
    getHistories({commit, state}) {
        commit('clearHistory')
        
        let tempf = {}
        let tempw = {}
        let ref = db.collection('history').where('user_id', '==', state.user.user_id).orderBy('timestamp')
        
        ref.onSnapshot(snapshot => {
          // console.log('snapshot')
            snapshot.docChanges().forEach(change => {
              // console.log('type ' , change.type)
                if(change.type === 'added') {
                    let doc = change.doc
                    let history = {
                      id: doc.id,
                      fat: parseInt(doc.data().fat),
                      weight: parseInt(doc.data().weight),
                      timestamp: moment(doc.data().timestamp).format('lll')
                    }
                    commit('storeHistory', history)

                    let time = moment(doc.data().timestamp).format('lll')
                    tempf[time] = parseInt(doc.data().fat)
                    tempw[time] = parseInt(doc.data().weight)
                }
            });
            commit('clearChartData')

            commit('storeChartData', {
              name: 'Weight',
              data: tempw
            })
    
            commit('storeChartData', {
              name: 'Fat',
              data: tempf
            })
        });

        
    },
    setLogoutTimer({dispatch}, expirationTime) {
      setTimeout(() => {
        dispatch('logout')
      }, expirationTime*1000);
    },
    loginWithCreditials({commit, dispatch}){
      const token = localStorage.getItem('myToken')
      const email = localStorage.getItem('myEmail')
      const user_id = localStorage.getItem('user_id')

      if(!token) {return}
      const expirationDate = localStorage.getItem('expirationDate')
      const now = new Date()

      if(now >= expirationDate) {
        return
      }
      commit('authUser', {
        accessToken: token,
        authorized: true
      });
      commit('storeUser', {
        user_id: user_id,
        email: email,
      });

      dispatch('getHistories')
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
            
            cred.user.getIdTokenResult().then(x => {
              localStorage.setItem('myToken', x.token);
              localStorage.setItem('expirationDate', x.expirationDate);
              localStorage.setItem('myEmail', cred.user.email);
              
              dispatch('setLogoutTimer', 3600*1000)
            })

            dispatch('getHistories');
            router.push({ name: 'profile', params: {id: cred.user.uid}})
          }).catch(() => {
            // console.log('set data err ', err)
          })
      }).catch(()=> {
          // console.log('sign up err ', err)
      });
    },
    login({commit, dispatch}, userData) {
      firebase.auth().signInWithEmailAndPassword(userData.email, userData.password)
        .then(cred => {
            cred.user.getIdTokenResult().then(x => {
              localStorage.setItem('myToken', x.token);
              localStorage.setItem('myEmail', cred.user.email);
              localStorage.setItem('expirationDate', x.expirationDate);
              localStorage.setItem('user_id', cred.user.uid)
              commit('authUser', {
                accessToken: x.token,
                authorized: true
              });

              commit('storeUser', {
                user_id: cred.user.uid,
                email: cred.user.email
              });

              dispatch('setLogoutTimer', 3600);
            })

            dispatch('getHistories');
            router.push({ name: 'profile', params: {id: cred.user.uid}})
        }).catch(() => {
            // console.log('err in store login ', err.message)
        })
    },
    logout({commit}) {
      firebase.auth().signOut().then(() => {
        // Sign-out successful.
        commit('clearUser')
        localStorage.removeItem('myToken')
        localStorage.removeItem('user_id')
        localStorage.removeItem('myEmail')
        localStorage.removeItem('expirationDate')
        router.replace('/')
      }).catch(() => {
        // An error happened.
        // console.log('logout ', error)
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
    },
    chartDataList(state) {
      return state.chartData
    }
  }
})
