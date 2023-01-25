import * as React from 'react';
import { Message } from '../../models/Message';
import Home from './pages/Home';

interface RoutesProps {
  backgroundPageConnectionPort: chrome.runtime.Port;
  connectionStatus: {
    connectionReady: boolean;
    tabReady: boolean;
  };
  message: Message;
  postMessage(
    connectionPort: chrome.runtime.Port,
    status: {
      connectionReady: boolean;
      tabReady: boolean;
    }
  ): void;
}

/**
 * Pages routing configuration.
 *
 * @param  props.backgroundPageConnectionPort Connection port.
 * @param  props.connectionStatus Connection status.
 * @param  props.message Message state.
 * @param  props.postMessage Function that sends message to Content script.
 * @return JSX.Element.
 */
function Routes(props: RoutesProps) {
  return (
    <Home
      message={props.message}
      postMessage={props.postMessage}
      backgroundPageConnectionPort={props.backgroundPageConnectionPort}
      connectionStatus={props.connectionStatus}
    />
  );
}

export default Routes;
