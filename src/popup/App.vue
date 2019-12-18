<template>
    <router-view></router-view>
</template>

<script>
  import store from '../store'
  // subscribe to store updates
  store.subscribe((mutation, state) => {
    // Store the state object as a JSON string
    localStorage.setItem('store', JSON.stringify(state))
  })

  export default {
    data () {
      return {}
    }
  }
</script>


