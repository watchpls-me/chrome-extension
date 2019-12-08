global.browser = require('webextension-polyfill')
import store from './store'

alert(`Hello ${store.getters.STREAM_STATUS}!`)

var onMessageListener = function(message, sender, sendResponse) {
    switch(message.type) {
        case "bglog":
            console.log(message.obj);
        break;
    }
    return true;
}
chrome.runtime.onMessage.addListener(onMessageListener);

