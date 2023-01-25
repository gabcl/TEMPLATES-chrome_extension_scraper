import { parserIt } from './modules/parser';

// -------------------------------------------------
// Listen to messages from backgroundScript
// -------------------------------------------------
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'init') {
    // console.log('Content: Received a message from backgroundScript', message);
    message['track'].push('Content');
    sendResponse(message);
    // console.log('Content: Sending message to backgroundScript.', message);
  }

  if (message.type === 'content') {
    // console.log('Content: Received a message from backgroundScript', message);
    message['track'].push('Content');
    message['content'] = parserIt();
    sendResponse(message);
    // console.log('Content: Sending message to backgroundScript.', message);
  }
});
