global.browser = require('webextension-polyfill')
import store from './store'

alert(`Hello ${store.getters.STREAM_STATUS}!`)
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

function getAspectRatio(w, h) {
  function gcd(a, b) {
    return (b == 0) ? a : gcd(b, a % b)
  }
  const r = gcd(w, h)
  return (w / r) / (h / r)
}

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
          maxWidth: 1920,
          maxHeight: 1080,
          minAspectRatio: getAspectRatio(1920, 1080),
          maxAspectRatio: getAspectRatio(1920, 1080),
          minFrameRate: 64,
          maxFrameRate: 128
        },
        optional: []
      }
    }

    navigator.webkitGetUserMedia(constraints, gotStream, getUserMediaError)

  })
  console.log('cap id ' + desktopCaptureId)
}

function gotStream (stream) {
  localStream = stream
  console.log(stream)
  // TODO: handle stream here
}

function getUserMediaError(e) {
  chrome.windows.create({
    url: "data:text/html,<h1>getUserMediaError: " + JSON.stringify(e, null, '<br>') + "</h1><br>Constraints used:<br><pre>" + JSON.stringify(constraints, null, '<br>') + '</pre>',
    type: 'popup',
    width: screen.width / 2,
    height: 170
  })
}

// TODO: properly handle stopping capture on all sources
function cancelCapture () {
  if (desktopCaptureId)
    chrome.desktopCapture.cancelChooseDesktopMedia(desktopCaptureId)
  localStream = null
}
