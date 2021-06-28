import React from 'react';
import { useHistory } from 'react-router-dom';
import { StoreContext } from '../utils/store';
import {
  ThemeProvider,
  makeStyles,
  useTheme,
  Box,
  Button,
  ButtonGroup,
  // Typography,
} from '@material-ui/core';
// import {
//   AccountCircle,
// } from '@material-ui/icons';
// import { StoreContext } from '../utils/store';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

// Component styling used on the Nav bar and its subcomponents
const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#648dae',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
  },
  button: {
    backgroundColor: theme.palette.background.button,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    maxHeight: '37px',
    fontSize: '16px',
  },
  buttonText: {
    fontSize: '13px',
  },
  buttonNav: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.palette.background.button,
    width: '100%',
    justifyContent: 'space-between',
  },
}));

// The Nav component is a subcomponent of the all admin pages, and contains
// useful buttons to navigate within the app.
const Navbar = ({ page }) => {
  const context = React.useContext(StoreContext);
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  // also need own username to navigate to own profile page
  const username = 'me';

  const setToken = context.token[1];
  const baseUrl = context.baseUrl;
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

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.box}>
        <Box className={classes.container}>
          <Box className={classes.buttonNav}>
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
              <Button
                id="home-button"
                variant="text"
                color={page === '/home' ? "primary" : "default"}
                className={classes.buttonText}
                onClick={() => {
                  history.push('/home')
                }}
              >
                Home
              </Button>
              <Button
                id="bookings-button"
                variant="text"
                color={page === '/mybookings' ? "primary" : "default"}
                className={classes.buttonText}
                onClick={() => {
                  history.push('/mybookings')
                }}
              >
                MyBookings
              </Button>
              <Button
                id="listings-button"
                variant="text"
                color={page === '/mylistings' ? "primary" : "default"}
                className={classes.buttonText}
                onClick={() => {
                  history.push('/mylistings')
                }}
              >
                MyListings
              </Button>
              <Button
                id="discover-button"
                variant="text"
                color={page === '/discover' ? "primary" : "default"}
                className={classes.buttonText}
                onClick={() => {
                  history.push('/discover')
                }}
              >
                Discover
              </Button>
            </ButtonGroup>
            <ButtonGroup variant="text" color="primary" aria-label="text profile button group">
              <Button
                id="profile-button"
                variant="text"
                color={page === '/profile/me' ? "primary" : "default"}
                className={classes.buttonText}
                onClick={() => {
                  history.push(`/profile/${username}`)
                }}
              >
                Profile
              </Button>
              <Button
                id="logout-button"
                variant="text"
                color="default"
                className={classes.buttonText}
                onClick={() => {
                  logoutButton()
                }}
              >
                Logout
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

Navbar.propTypes = {
  page: PropTypes.string.isRequired,
};

export default Navbar;
