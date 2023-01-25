import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

interface ConnectionStatusProps {
  connectionStatus: {
    connectionReady: boolean;
    tabReady: boolean;
  };
}

/**
 * Alert indicating status of connection and tab. Indicates when the app is ready.
 *
 * @param  props.connectionStatus Status of the connection and the tab loading.
 * @return JSX.Element.
 */
function ConnectionStatus(props: ConnectionStatusProps) {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      {!props.connectionStatus.connectionReady && (
        <Alert severity="error">Connection is not ready.</Alert>
      )}
      {props.connectionStatus.connectionReady && !props.connectionStatus.tabReady && (
        <Alert severity="info">Waiting for tab to complete loading...</Alert>
      )}
      {props.connectionStatus.connectionReady && props.connectionStatus.tabReady && (
        <Alert severity="success">Ready to go!</Alert>
      )}
    </Stack>
  );
}

export default ConnectionStatus;
