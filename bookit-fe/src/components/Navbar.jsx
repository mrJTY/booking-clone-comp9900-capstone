import React from 'react';
import { useHistory } from 'react-router-dom';
import { StoreContext } from '../utils/store';
import BookitLogo from '../assets/bookit-logo.png';
import {
  ThemeProvider,
  makeStyles,
  useTheme,
  Box,
  Button,
  ButtonGroup,
  Tooltip,
  Typography,
  Grid,
} from '@material-ui/core';
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
  backDiv: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.palette.background.button,
    justifyContent: 'flex-start',
    width: '100%',
  },
  navHeader: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  navHeaderText: {
    color: 'pink',
    paddingLeft: '6px',
  },
  img: {
    maxHeight: '24px',
    maxWidth: '24px',
  },
}));

// The Nav component is a subcomponent of the all admin pages, and contains
// useful buttons to navigate within the app.
const Navbar = ({ page }) => {
  const context = React.useContext(StoreContext);
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const token = context.token[0];
  // also need own username to navigate to own profile page
  const user = 'me';
  const setUsername = context.username[1];
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
        "Authorization": `JWT ${token}`,
      }
    })
      .then(() => {
        // unset the authorization token
        setToken(null);
        // navigate to the Login screen
        history.push('/login');
        // unset the username
        setUsername(null);
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
        // unset the username
        setUsername(null);
      })
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.box}>
        <Box className={classes.container}>

          {/* <Box className={classes.buttonNav}> */}
          <Grid
            container
            spacing={0}
            // direction="row"
            alignItems="center"
            justify="center"
            align="center"
          >


            <Grid container item xs={4} align="center" justify="flex-start">
              <Box className={classes.backDiv}>
                <Tooltip title="Go Back">
                  <Button
                    id="back-button"
                    variant="outlined"
                    color="default"
                    className={classes.buttonText}
                    onClick={() => {
                      history.goBack()
                    }}
                  >
                    Back
                  </Button>
                </Tooltip>
                <Box className={classes.navHeader}>
                  <Box>
                    <img className={classes.img} src={BookitLogo} alt="Book it logo" />
                  </Box>
                  <Box>
                    <Typography
                      className={classes.navHeaderText}
                      variant="subtitle1" align="left"
                    >
                      BookIt
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>


            <Grid item xs={4} align="center">
              <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                <Tooltip title="Home">
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
                </Tooltip>
                <Tooltip title="My Bookings">
                  <Button
                    id="bookings-button"
                    variant="text"
                    color={page === '/mybookings' ? "primary" : "default"}
                    className={classes.buttonText}
                    onClick={() => {
                      history.push('/mybookings')
                    }}
                  >
                    My Bookings
                  </Button>
                </Tooltip>
                <Tooltip title="My Listings">
                  <Button
                    id="listings-button"
                    variant="text"
                    color={page === '/mylistings' ? "primary" : "default"}
                    className={classes.buttonText}
                    onClick={() => {
                      history.push('/mylistings')
                    }}
                  >
                    My Listings
                  </Button>
                </Tooltip>
                <Tooltip title="Discover">
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
                </Tooltip>
              </ButtonGroup>
            </Grid>


            <Grid container item xs={4} align="flex-end" justify="flex-end">
              <ButtonGroup variant="text" color="primary" aria-label="text profile button group">
                <Tooltip title="Profile">
                  <Button
                    id="profile-button"
                    variant="text"
                    color={page === '/profile/me' ? "primary" : "default"}
                    className={classes.buttonText}
                    onClick={() => {
                      history.push(`/profile/${user}`)
                    }}
                  >
                    Profile
                  </Button>
                </Tooltip>
                <Tooltip title="Logout">
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
                </Tooltip>
              </ButtonGroup>
            </Grid>

          </Grid>
          {/* </Box> */}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

Navbar.propTypes = {
  page: PropTypes.string.isRequired,
};

export default Navbar;
