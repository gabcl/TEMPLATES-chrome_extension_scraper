import React, { useEffect, useState } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Divider from '@mui/material/Divider';

import Navbar from './components/Navbar';
import ConnectionStatus from './components/ConnectionStatus';
import Routes from './Routes';
import { Message } from '../../models/Message';
import { DataFrame } from '../../models/DataFrame';

// --------------------------------------------------------
// Theme
// --------------------------------------------------------
// Colors
const colors = {
  'Midnight Dream': '#004054',
};

// Light theme
const light = {
  palette: {
    primary: {
      main: colors['Midnight Dream'],
    },
    mode: 'light',
  },
  typography: {
    fontFamily: 'Ubuntu Bold 700',
  },
};

// Dark theme
const dark = {
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: 'Ubuntu Bold 700',
  },
};

// --------------------------------------------------------
// App - App with all components
// --------------------------------------------------------

/** Application */
function App() {
  // Check if OS is set to dark theme.
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Dark theme state.
  const [isDarkTheme, setIsDarkTheme] = useState(prefersDarkMode);

  // Message between extension components.
  const [message, setMessage] = useState<Message>({
    type: 'initial',
    track: [],
    tabId: 123,
    content: new DataFrame(),
  });

  // Connection is ready after the panel receives the first message from contentScript.
  // Tab is ready when its status is "complete".
  const [connectionStatus, setConnectionStatus] = useState({
    connectionReady: false,
    tabReady: false,
  });

  // Connection port.
  const [backgroundPageConnectionPort] = useState(
    chrome.runtime.connect({
      name: 'Panel',
    })
  );

  /**
   * Sends a message to backgroundScript.
   */
  function postMessage(
    connectionPort: chrome.runtime.Port,
    status: {
      connectionReady: boolean;
      tabReady: boolean;
    }
  ) {
    if (status.connectionReady && status.tabReady) {
      let message = {
        type: 'content',
        track: ['panelScript'],
        tabId: chrome.devtools.inspectedWindow.tabId,
        content: new DataFrame(),
      };
      // console.log('Posting message...');
      connectionPort.postMessage(message);
    }
  }

  // /**
  //  * Send message to sandbox and listen for response.
  //  *
  //  * @param  messageData  Data sent with message.
  //  */
  // async function postMessageSandbox(message: Message): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     // Setup communication channel
  //     const channel = new MessageChannel();

  //     // onMessage listener
  //     channel.port1.onmessage = ({ data }) => {
  //       // console.log('Panel: Received a response from sandbox!');
  //       channel.port1.close();
  //       if (data.error) {
  //         const error = data.error;
  //         reject(error);
  //       } else {
  //         const result = data.result;
  //         resolve(result);
  //       }
  //     };

  //      // Send message to sandbox
  //     (document?.getElementById('theFrame') as HTMLIFrameElement).contentWindow?.postMessage(
  //       message,
  //       '*',
  //       [channel.port2]
  //     );
  //   });
  // }

  /**
   * After component mounts hook.
   */
  useEffect(() => {
    /**
     * Sends message to backgroundScript to initiate connection.
     */
    async function initConnection() {
      let queryOptions = { active: true, lastFocusedWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);

      if (tab) {
        if (!tab.url?.startsWith('chrome://')) {
          setConnectionStatus((oldStatus) => ({ ...oldStatus, tabReady: true }));
          // console.log('Panel: Sending message to background', backgroundPageConnectionPort);
          backgroundPageConnectionPort.postMessage({
            type: 'init',
            track: ['Panel'],
            tabId: chrome.devtools.inspectedWindow.tabId,
            sender: 'Panel',
            content: new DataFrame(),
          });
        } else {
          // setTabReady(false);
          setConnectionStatus((oldStatus) => ({ ...oldStatus, tabReady: false }));
        }
      }
    }

    /**
     * Sends message to backgroundScript to initiate connection.
     */
    function tabListener() {
      chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status === 'complete') {
          initConnection();
        } else {
          setConnectionStatus((oldStatus) => ({ ...oldStatus, tabReady: false }));
        }
      });
    }

    /**
     * Listen messages from backgroundScript
     */
    function messageListener() {
      backgroundPageConnectionPort.onMessage.addListener(function (message) {
        // console.log('Panel: Received a message from backgroundScript.', message);
        // Received init message back from content.
        // Set connection as ready.
        if (message.type === 'init') {
          setConnectionStatus((oldStatus) => ({ ...oldStatus, connectionReady: true }));
        }
        // All message is serilized to json.
        // Need to convert back the content to DataFrame.
        message.content = DataFrame.from(message.content);

        // Hendle messages
        // Update 'message' state.
        setMessage(message);
      });
    }

    // Sends message to backgroundScript to initiate connection.
    initConnection();

    // Tab update listener
    tabListener();

    // Listen messages from backgroundScript
    messageListener();
  }, [backgroundPageConnectionPort]);

  /**
   * Hook to set up dark theme, based on OS preference
   */
  useEffect(() => {
    setIsDarkTheme(prefersDarkMode);
  }, [prefersDarkMode]);

  return (
    <ThemeProvider
      theme={isDarkTheme ? createTheme(dark as ThemeOptions) : createTheme(light as ThemeOptions)}
    >
      <CssBaseline />
      <Navbar isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />
      <ConnectionStatus connectionStatus={connectionStatus} />
      <Divider sx={{ mt: 1, mb: 0.5 }} />
      <Routes
        message={message}
        postMessage={postMessage}
        backgroundPageConnectionPort={backgroundPageConnectionPort}
        connectionStatus={connectionStatus}
      />
    </ThemeProvider>
  );
}

export default App;
