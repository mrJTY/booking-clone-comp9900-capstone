import React from 'react';
import Navbar from '../components/Navbar';
import { StoreContext } from '../utils/store';
import {
  // useHistory,
  Redirect,
} from 'react-router-dom';
import {
  makeStyles,
  Box,
  Container,
  Typography,
  CircularProgress,
} from '@material-ui/core';

// Page styling used on the MyBookings screen and its subcomponents
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: theme.palette.background.default,
  },
  containerDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    width: '100%',
  },
  mytitleDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  image: {
    height: '128px',
    width: '128px',
    margin: 'auto',
  },
}));


const MyBookings = () => {
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  // const history = useHistory();
  
  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // object containing all of the users a user is following from a GET API request
  // const [following, setFollowing] = context.following;
  // the page variable stores the current page as a string
  const [page, setPage] = context.pageState;
  // page loading state
  const [loadingState, setLoadingState] = React.useState('idle');

  React.useEffect(() => {
    setPage('/mybookings');
    async function setupDash () {
      setLoadingState('loading');
      // await fetchUserFeed(...);
      setLoadingState('success');
    }
    setupDash();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // classes used for Material UI component styling
  const classes = useStyles();

  return (
    <Container>
      <Navbar page={page} />
      <Container className={classes.container}>
        {
          loadingState !== 'success' &&
          <div>
            <CircularProgress color="secondary" />
          </div>
        }
        {
          loadingState === 'success' &&
          <Box className={classes.containerDiv}>
            <Box className={classes.mytitleDiv}>
              <Box>
                <Typography paragraph align="left" variant="h4">
                  Your Bookings
                </Typography>
              </Box>
            </Box>
            <br />
            <br />
          </Box>
        }
      </Container>
    </Container>
  )
}

export default MyBookings;
