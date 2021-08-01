import React from 'react';
import DefaultAvatar from '../assets/default-avatar.svg';
import { useHistory } from 'react-router-dom';
import { StoreContext } from '../utils/store';
import { fetchAuthMe } from '../utils/auxiliary';
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
  Avatar,
  IconButton,
  Menu,
  MenuItem,
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
    border: '1px solid #282c34',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
    borderRadius: 5,
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
    paddingLeft: '0.25em',
  },
  btnBack:{
    fontSize: '13px',
    boxShadow: theme.shadows[5],
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
    textShadow: 'pink 1px 0 25px',
  },
  img: {
    maxHeight: '24px',
    maxWidth: '24px',
    boxShadow: theme.shadows[5],
  },
  profileDiv: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.palette.background.button,
    justifyContent: 'flex-start',
    width: '100%',
  },
  navUserDiv: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-end',
    paddingRight: '0.25em',
  },
  navUserText: {
    paddingRight: '1em',
    textShadow: 'gray 1px 0 10px',
  },
  profileBtnDiv: {
    paddingRight: '0.5em',
  },
  profileBtn: {
    border: '1px solid gray',
    boxShadow: theme.shadows[5],
    padding: 0,
  },
  profileBtnAvatar: {
    height: theme.spacing(5),
    width: theme.spacing(5),
  },
  menuNav: {
    width: '100%',
  },
}));

// The Nav component is a subcomponent of the all admin pages, and contains
// useful buttons to navigate within the app.
// It contains the following buttons:
// - Back
// - Home
// - My Bookings
// - My Listings
// - Discover
// - Profile menu (depicted as the primary user's avatar)
const Navbar = ({ page }) => {
  // state variables
  const context = React.useContext(StoreContext);
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const token = context.token[0];
  // also need own username to navigate to own profile page
  const [username, setUsername] = context.username;
  const setToken = context.token[1];
  const baseUrl = context.baseUrl;
  const [authMeInfo, setAuthMeInfo] = context.authMeInfo;
  // sends a POST API request confirming an admin logging out
  const logoutButton = () => {
    setOpenMenu(false);
    setAnchorProfileMenu(null);
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
        if (error.response.data.error !== undefined) {
          errorText = error.response.data.error;
        } else if (error.response.data.message !== undefined) {
          errorText = error.response.data.message;
        } else {
          errorText = 'Invalid Auth token';
        }
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
  // calls an API request to update the user's username & avatar if applicable
  React.useEffect(() => {
    async function setupUserNav() {
      await fetchAuthMe(baseUrl, token, setAuthMeInfo);
    }
    setupUserNav();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // profile menu state variables
  const [achorProfileMenu, setAnchorProfileMenu] = React.useState(null);
  const [openMenu, setOpenMenu] = React.useState(false);
  // anchors the menu to the avatar
  const handleProfileMenu = (event) => {
    setOpenMenu(true);
    setAnchorProfileMenu(event.currentTarget);
  };
  // called upon closing the profile menu by clicking eleswhere, or on a menu item
  const handleCloseProfileMenu = () => {
    setOpenMenu(false);
    setAnchorProfileMenu(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.box}>
        <Box className={classes.container}>
          <Grid
            container
            spacing={0}
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
                    className={classes.btnBack}
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
                <Tooltip title="Home Screen">
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
                <Tooltip title="Recommendations">
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
              <Box className={classes.profileDiv}>
                <Box className={classes.navUserDiv}>
                  <Typography
                    className={classes.navUserText}
                    variant="subtitle1" align="left"
                    color="textSecondary"
                  >
                    {username}
                  </Typography>
                </Box>
                <Box className={classes.profileBtnDiv}>
                  <Tooltip title="User Menu">
                    <IconButton
                      aria-label="profile settings"
                      className={classes.profileBtn}
                      onClick={handleProfileMenu}
                    >
                      {
                        authMeInfo &&
                        <Avatar
                          className={classes.profileBtnAvatar}
                          src={authMeInfo.avatar}
                        />
                      }
                      {
                        !authMeInfo &&
                        <Avatar
                          className={classes.profileBtnAvatar}
                          src={DefaultAvatar}
                        />
                      }
                    </IconButton>
                  </Tooltip>
                  <Menu
                    id="menu-nav"
                    className={classes.menuNav}
                    elevation={0}
                    getContentAnchorEl={null}
                    anchorEl={achorProfileMenu}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    open={openMenu}
                    onClose={handleCloseProfileMenu}
                  >
                    <MenuItem
                      onClick={() => {
                        handleCloseProfileMenu()
                        history.push(`/profile/${username}`)
                      }}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleCloseProfileMenu()
                        history.push(`/usersettings`)
                      }}
                    >
                      Settings
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        logoutButton()
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

Navbar.propTypes = {
  page: PropTypes.string.isRequired,
};

export default Navbar;
