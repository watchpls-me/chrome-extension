import * as types from './mutation-types'

export const setStreaming = ({commit}, payload) => {
  commit(types.STREAM_STATUS, payload)
}

export const setLink = ({commit}, payload) => {
  commit(types.SHARE_LINK, payload)
}

export const setSettings = ({commit}, payload) => {
  commit(types.SETTINGS, payload)
}