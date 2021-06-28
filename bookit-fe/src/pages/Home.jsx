import React from 'react';
import { StoreContext } from '../utils/store';
import Navbar from '../components/Navbar';
import {
  // useHistory,
  Redirect,
} from 'react-router-dom';
import {
  makeStyles,
  Container,
} from '@material-ui/core';

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
    alignSelf: 'flex-start'
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
    setPage('/home');
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
            <h1>Loading your Dashboard...</h1>
          </div>
        }
        {
          loadingState === 'success' &&
          // following.length === 0 &&
          <div>
            <h3>You are following nobody. Try searching for users to follow!</h3>
          </div>
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
