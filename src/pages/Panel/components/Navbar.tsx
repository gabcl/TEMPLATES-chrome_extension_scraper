import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack/Stack';
import Icon from '@mui/material/Icon';
import logo from '../../../assets/icon/icon-128.png';

interface NavbarProps {
  isDarkTheme: boolean;
  setIsDarkTheme: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Navigation bar.
 *
 * @param props.isDarkTheme Whether is dark theme or not.
 * @param props.setIsDarkTheme Dark theme setter function.
 * @param props.panel Current Panel.
 * @param props.handlePanelChange Panel change handler.
 * @return JSX.Element
 */
function Navbar(props: NavbarProps) {
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl" disableGutters={true} sx={{ px: 1 }}>
        <Toolbar disableGutters sx={{ zIndex: 'tooltip', color: 'white', mt: 0.7 }} color="primary">
          {/* ----------- Icon -----------*/}
          <Icon
            sx={{
              display: 'flex',
              height: '10',
              width: 'inherit',
              align: 'center',
            }}
          >
            <img alt="Logo" src={logo} />
          </Icon>
          {/* ----------- Name -----------*/}
          <Box sx={{ ml: 1 }}>
            <Typography variant="h6" sx={{ lineHeight: 1 }}>
              Chrome Scraper
            </Typography>
          </Box>
          {/* ----------- Darkmode switch -----------*/}
          <FormGroup sx={{ ml: 1 }}>
            <Stack justifyContent="center" alignItems="center">
              <Typography fontSize="small">Dark</Typography>
              <Switch
                checked={props.isDarkTheme}
                color="info"
                size="small"
                onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
                  props.setIsDarkTheme(checked)
                }
              />
            </Stack>
          </FormGroup>
        </Toolbar>
      </Container>
      <Box
        sx={{
          mt: 1,
          width: '100%',
          height: 5,
          background: '#C0143C',
        }}
      />
    </AppBar>
  );
}
export default Navbar;
