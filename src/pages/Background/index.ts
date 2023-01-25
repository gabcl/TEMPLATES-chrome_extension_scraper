let lostMessages: Array<any> = [];

/**
 * Sends message to Background to initiate connection.
 * @param lostMessages Lost messages to send.
 */
function sendLostMessages(lostMessages: Array<any>) {
  console.log('Background: Sending lost messages...');
  for (let i = 0; i < lostMessages.length; i++) {
    if (lostMessages[i].sender.tab) {
      if (lostMessages[i].sender.tab.id in connections) {
        // Send message
        connections[lostMessages[i].sender.tab.id].postMessage(lostMessages[i].message);

        // Remove message resent
        lostMessages.splice(i, 1);
      } else {
        console.log(
          'Background: Tab not found in connection list.',
          lostMessages[i].message,
          lostMessages[i].sender
        );
      }
    } else {
      console.log(
        'Background: sender.tab not defined.',
        lostMessages[i].message,
        lostMessages[i].sender
      );
    }
  }
}

// -------------------------------------------------
// Connection (from devtools panel) listener
// -------------------------------------------------
// Keep track of connections Port objects
let connections: { [key: string]: chrome.runtime.Port } = {};

// onConnect listener
chrome.runtime.onConnect.addListener(function (port) {
  // Connection handler
  let extensionListener = function (message: any, port: chrome.runtime.Port) {
    // Init connection
    if (message.type === 'init') {
      // Retrieve connection Port variable
      connections[message.tabId] = port;

      // resend messages sent before the connection was alive
      if (lostMessages.length > 0) {
        sendLostMessages(lostMessages);
      }
    }

    // Send message to contentScript
    if (message.type === 'init' || message.type === 'content') {
      // console.log('Background: Sending message to contentSript;', message);
      message['track'].push('Background');

      (async () => {
        // const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        const response: any = await chrome.tabs.sendMessage(message.tabId, message);
        if (response) {
          response['track'].push('Background');
          // console.log(
          //   'Background: Received a response from contentSript, relaying to Panel;',
          //   response
          // );
          connections[response.tabId].postMessage(response);
        }
      })();
    }
  };

  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(extensionListener);

  // Remove listenter on disconnection
  port.onDisconnect.addListener(function (port) {
    console.log('Background: Port disconnected.');
    port.onMessage.removeListener(extensionListener);

    let tabs = Object.keys(connections);
    for (let i = 0; i < tabs.length; i++) {
      if (connections[tabs[i]] === port) {
        delete connections[tabs[i]];
        break;
      }
    }
  });
});

// -------------------------------------------------
// Listen to messages from contentScript -> relay to devtools panel
// -------------------------------------------------
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // console.log('Background: Received a message from contentSript.', message);

  // Messages from content scripts should have sender.tab set
  if (sender.tab) {
    if (sender.tab.id && sender.tab.id in connections) {
      message['track'].push('Background');
      connections[sender.tab.id].postMessage(message);
      // console.log('Background: Relaying message to devtools panel.', message);
    } else {
      console.log('Background: Tab not found in connection list.', message, sender, connections);
      lostMessages.push({ message, sender });
    }
  } else {
    console.log('Background: sender.tab not defined.', message, sender);
  }
  return true;
});
