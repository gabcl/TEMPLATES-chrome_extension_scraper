// Set up message event handler:
window.addEventListener(
  'message',
  function (event: any) {
    if (event.origin.startsWith('chrome-extension')) {
      // console.log('Sandbox: Received a message.', event.data);

      // Send result back
      event.ports[0].postMessage({ result: 'From sandbox' });
    }
  },
  false
);
