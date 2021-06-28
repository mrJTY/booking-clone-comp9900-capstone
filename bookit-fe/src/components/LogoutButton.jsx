import React from 'react';
import { useHistory } from 'react-router-dom';
import { StoreContext } from '../utils/store';
import axios from 'axios';
import {
  ThemeProvider,
  Button,
  Box,
  Tooltip,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.background.button,
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    maxHeight: '37px',
  },
  buttonText: {
    fontSize: '13px',
  },
}));

// The Logout subcomponent is a button wrapper which ensures that the
// appropriate API is called upon the user pressing 'Logout'
const Logout = () => {
  const context = React.useContext(StoreContext);
  const [token, setToken] = context.token;
  const baseUrl = context.baseUrl;
  const history = useHistory();
  // sends a POST API request confirming an admin logging out
  const logoutButton = () => {
    axios({
      method: 'POST',
      url: `${baseUrl}/auth/logout`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        // Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        // unset the authorization token
        setToken(null);
        // navigate to the Login screen
        history.push('/login');
      })
      .catch((error) => {
        let errorText = '';
        error.response.data.error !== undefined
          ? errorText = error.response.data.error
          : errorText = 'Invalid Auth token'
        toast.error(
          errorText, {
            position: 'top-right',
            hideProgressBar: true,
            style: {
              backgroundColor: '#cc0000',
              opacity: 0.8,
              textAlign: 'center',
              fontSize: '18px'
            }
          }
        );
        setToken(null);
        history.push('/login');
      })
  }
  // Material UI classes as defined above
  const classes = useStyles();
  // retrieves the dark theme
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.button}>
        <Tooltip title="Logout" aria-label="logout">
          <Button
            variant="text"
            onClick={logoutButton}
            className={classes.buttonText}
          >
            Logout
          </Button>
        </Tooltip>
      </Box>
    </ThemeProvider>
  )
}

export default Logout;
