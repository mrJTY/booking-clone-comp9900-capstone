import React from 'react';
import {StoreContext} from '../utils/store';
import Navbar from '../components/Navbar';
import SearchControls from '../components/SearchControls';
import {
  Redirect,
} from 'react-router-dom';
import {
  makeStyles,
  Box,
  Container,
  Typography,
  CircularProgress,
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
  const classes = useStyles();
  const token = context.token[0];
  const username = context.username[0];
  const [page, setPage] = context.pageState;
  const [loadingState, setLoadingState] = React.useState('idle');

  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{pathname: '/login'}}/>
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    setPage('/home');

    async function setupHome() {
      setLoadingState('loading');
      // await fetchUserFeed(...);
      setLoadingState('success');
    }

    setupHome();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <Navbar page={page}/>
      <Container className={classes.container}>
        {
          loadingState !== 'success' &&
          <div>
            <CircularProgress color="secondary"/>
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
                <SearchControls />
              </Box>
            </Box>
            <br/>
            <br/>
          </Box>
        }
        {/* {
          loadingState === 'success' &&
          following.length > 0 &&
          <div className={classes.containerDiv}>
            <div>
              <h3>User Feed</h3>
            </div>
          </div>
        } */}
      </Container>
    </Container>
  );
}

export default Home;
