import React from 'react';
import Navbar from '../components/Navbar';
import { StoreContext } from '../utils/store';
import {
  // useHistory,
  Redirect,
} from 'react-router-dom';
import {
  makeStyles,
  Container,
  Box,
  Button,
} from '@material-ui/core';

// Page styling used on the MyListings screen and its subcomponents
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
    alignContent: 'flex-start',
    width: '100%',
    justifyContent: 'center',
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


const MyListings = () => {
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
    setPage('/mylistings');
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
        <Box className={classes.containerDiv}>
          <Box>
            <h2>Welcome to your Listings!</h2>
          </Box>
          <Box className={classes.button}>
            <Button
              id="new-listing-button"
              variant="contained"
              color="primary"
            >
              New Listing
            </Button>
          </Box>
        </Box>
      </Container>
    </Container>
  )
}

export default MyListings;
