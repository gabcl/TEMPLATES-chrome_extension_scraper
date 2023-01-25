import * as React from 'react';
import Button from '@mui/material/Button';
import ContentTable from '../components/ContentTable';
import { Message } from '../../../models/Message';

interface HomePanelProps {
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
 * Home page.
 *
 * @param  props.backgroundPageConnectionPort Connection port.
 * @param  props.connectionStatus Connection status.
 * @param  props.message Message state.
 * @param  props.postMessage Function that sends message to Content script.
 * @return JSX.Element
 */
function HomePanel(props: HomePanelProps) {
  return (
    <>
      <Button
        variant="contained"
        onClick={() =>
          props.postMessage(props.backgroundPageConnectionPort, props.connectionStatus)
        }
      >
        Scrape it!
      </Button>
      {props.message.content?.hasData && <ContentTable content={props.message.content} />}
    </>
  );
}

export default HomePanel;
