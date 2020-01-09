global.browser = require('webextension-polyfill')
import { randanimal, randanimalSync } from 'randanimal'

import store from './store'

const RTCMultiConnection = require('rtcmulticonnection')
const connection = new RTCMultiConnection()
// temporary backend solution
connection.socketURL = 'https://rtc.watchpls.me/'
const shareUrl = 'https://watchpls.me/r/'

import * as io from 'socket.io-client'
window.io = io // needed due to issue within webrtc

// sync store to memory
store.commit('initialiseStore')
store.subscribe((mutation, state) => {
  localStorage.setItem('store', JSON.stringify(state))
})

// when local storage updates, sync store
window.onstorage = () => {
  store.commit('initialiseStore')
}

// reset stream variables in case of sync issues
store.dispatch('setStreaming', false)
store.dispatch('setLink', '')


let desktopCaptureId = null
let localStream = null

var onMessageListener = function (message, sender, sendResponse) {
  let response = {}
  switch (message.type) {
    case 'bglog':
      console.log(message.obj)
      break

    case 'startStream':
      requestCapture()
      break

    case 'endStream':
      cancelCapture()
      break

    default:
      break
  }
  sendResponse(response)
  return true
}
chrome.runtime.onMessage.addListener(onMessageListener)


function requestCapture (options) {
  const sources = ['screen', 'window', 'tab', 'audio']
  desktopCaptureId = chrome.desktopCapture.chooseDesktopMedia(sources, (streamId, opts) => {
    // if access rejected
    if (!streamId) {
      console.log('Desktop capture rejected')
      return
    }

    const constraints = {
      audio: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: streamId,
          echoCancellation: true
        },
        optional: [{
          googDisableLocalEcho: false // https://www.chromestatus.com/feature/5056629556903936
        }]
      },
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: streamId,
          minFrameRate: store.state.framerate,
          maxFrameRate: store.state.framerate
        },
        optional: []
      }
    }

    // null = no max height (fit screen)
    if (store.state.resolution)
      constraints.video.mandatory.maxHeight = store.state.resolution

    // create stream
    navigator.webkitGetUserMedia(constraints, gotStream, getUserMediaError)
  })
}

async function gotStream (stream) {
  localStream = stream
  localStream.oninactive = function () {
    if (localStream && localStream.active === false && store.getters.STREAM_STATUS)
      cancelCapture()
  }
  console.log(stream)

  connection.autoCloseEntireSession = true

  // this must match the viewer page
  connection.socketMessageEvent = 'desktopCapture'

  connection.password = null

  connection.enableLogs = false
  connection.session = {
    audio: true,
    video: true,
    data: true,
    oneway: true
  }

  connection.candidates = {
    stun: true,
    turn: true
  }

  connection.iceProtocols = {
    tcp: true,
    udp: true
  }

  connection.optionalArgument = {
    optional: [],
    mandatory: {}
  }

  // create room id
  const roomid = await randanimal(2).then(name => { return name.replace(/\s/g, '') })
  connection.channel = connection.sessionid = connection.userid = roomid

  // www.rtcmulticonnection.org/docs/sdpConstraints/
  connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false
  }

  connection.onstream = connection.onstreamended = await function (event) {
    try {
      event.mediaElement.pause()
      delete event.mediaElement
    } catch (e) {}
  }

  // www.RTCMultiConnection.org/docs/dontCaptureUserMedia/
  connection.dontCaptureUserMedia = true

  // www.RTCMultiConnection.org/docs/attachStreams/
  await connection.attachStreams.push(stream)

  connection.socketCustomEvent = connection.sessionid

  // open stream connection
  await connection.open(connection.sessionid, function () {})

  // set stream to true
  store.dispatch('setStreaming', !store.state.STREAM_STATUS)
  store.dispatch('setLink', `${shareUrl}${connection.channel}`)

}

function getUserMediaError (e) {
  console.log(e)
  chrome.windows.create({
    url: 'data:text/html,<h1>getUserMediaError: ' + e + '</pre>',
    type: 'popup',
    width: screen.width / 2,
    height: 170
  })
}

function cancelCapture () {
  if (desktopCaptureId)
    chrome.desktopCapture.cancelChooseDesktopMedia(desktopCaptureId)
  if (localStream) {
    localStream.stop()
    localStream = null
    connection.close()
    connection.attachStreams = []
    connection.closeSocket()
  }
  store.dispatch('setStreaming', false)
  store.dispatch('setLink', '')
}
