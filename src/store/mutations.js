import * as types from './mutation-types'

export default {
  [types.STREAM_STATUS] (state, payload) {
    state.STREAM_STATUS = payload
  },
  [types.SHARE_LINK] (state, payload) {
    state.SHARE_LINK = payload
  },
  [types.SETTINGS] (state, payload) {
    state.resolution = payload.resolution
    state.framerate = payload.framerate
  },
  // initialize store from localStorage
  initialiseStore (state) {
    // check if the store exists
    if (localStorage.getItem('store')) {
      // replace the state object with the current local storage
      this.replaceState(
        Object.assign(state, JSON.parse(localStorage.getItem('store')))
      )
    }
  },
}
