import React from 'react';
import { StoreContext } from '../utils/store';
import Navbar from '../components/Navbar';
import SearchResults from '../components/SearchResults';
import {
  useHistory,
  Redirect,
} from 'react-router-dom';
import {
  makeStyles,
  Box,
  Container,
  Typography,
  CircularProgress,
} from '@material-ui/core';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// Page styling used on the Home screen and its subcomponents
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

const Home = () => {
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const history = useHistory();
  // const baseUrl = context.baseUrl;
  
  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const username = context.username[0];

  // object containing all of the users a user is following from a GET API request
  // const [following, setFollowing] = context.following;
  // the page variable stores the current page as a string
  const [page, setPage] = context.pageState;
  // page loading state
  const [loadingState, setLoadingState] = React.useState('idle');

  // class used for the Toastify error component styling
  // const toastErrorStyle = {
  //   backgroundColor: '#cc0000',
  //   opacity: 0.8,
  //   textAlign: 'center',
  //   fontSize: '18px'
  // };

  React.useEffect(() => {
    setPage('/home');
    async function setupHome () {
      setLoadingState('loading');
      // await fetchUserFeed(...);
      setLoadingState('success');
    }
    setupHome();
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
          // following.length === 0 &&
          <Box className={classes.containerDiv}>
            <Box className={classes.mytitleDiv}>
              <Box>
                <Typography paragraph align="left" variant="h4">
                  Welcome, {username}.
                </Typography>
              </Box>
              <SearchResults context={context} username={username} history={history}/>
            </Box>
            <br />
            <br />
          </Box>
        }
        {/* {
          loadingState === 'success' &&
          following.length > 0 &&
          <div className={classes.containerDiv}>
            <div>
              <h3>Welcome to your User Feed.</h3>
            </div>
          </div>
        } */}
      </Container>
    </Container>
  );
}

export default Home;
