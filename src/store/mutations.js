import * as types from './mutation-types'

export default {
  [types.STREAM_STATUS] (state, payload) {
    state.STREAM_STATUS = payload
  }
}
