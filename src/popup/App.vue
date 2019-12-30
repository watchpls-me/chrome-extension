<template>
    <router-view></router-view>
</template>

<script>
  import store from '../store'

  // subscribe to store updates
  store.subscribe((mutation, state) => {
    // store the state object as a JSON string
    localStorage.setItem('store', JSON.stringify(state))
  })

  // when local storage updates, sync store
  window.onstorage = () => {
    store.commit('initialiseStore')
  }

  export default {
    data () {
      return {}
    }
  }
</script>


