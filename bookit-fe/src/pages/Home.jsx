import React from 'react';
import { StoreContext } from '../utils/store';
import Navbar from '../components/Navbar';
import ResourceCard from '../components/ResourceCard';
import SearchControls from '../components/SearchControls';
import { fetchUserFeed } from '../utils/auxiliary';
import {
  Redirect,
} from 'react-router-dom';
import {
  makeStyles,
  Box,
  Container,
  Typography,
  CircularProgress,
  Divider,
  Grid,
  Button,
  Tooltip,
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
  titleSubcontainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  titleHeadingDiv: {
    paddingRight: '10px',
  },   
  mytitleDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: theme.spacing(1),
  },
  mysubtitleDiv: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '1em',
  },
  feedSubtitleDiv: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
  },  
  showFeedBtnDiv: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // paddingRight: '1em',
  },
  button: {
    margin: theme.spacing(1),
  },
  image: {
    height: '128px',
    width: '128px',
    margin: 'auto',
  },
  divider: {
    margin: '1em 0em',
    height: '2px',
  },
}));

const Home = () => {
  const context = React.useContext(StoreContext);
  const classes = useStyles();
  const token = context.token[0];
  const baseUrl = context.baseUrl;
  const username = context.username[0];
  const [page, setPage] = context.pageState;
  const setSearchType = context.searchType[1];
  const setSearchQuery = context.searchQuery[1];
  const setSearchUserQuery = context.searchUserQuery[1];
  const [loadingState, setLoadingState] = React.useState('idle');

  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{pathname: '/login'}}/>
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [showUserFeedBtn, setShowUserFeedBtn] = React.useState(false);
  const [userFeed, setUserFeed] = React.useState(null);

  React.useEffect(() => {
    setPage('/home');
    async function setupHome() {
      setLoadingState('loading');
      await setSearchType('listings');
      await setSearchQuery('');
      await setSearchUserQuery('');
      await fetchUserFeed(baseUrl, token, setUserFeed);
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
          <Box className={classes.containerDiv}>
            <Box className={classes.mytitleDiv}>
              <Box>
                <Typography paragraph align="left" variant="h4">
                  Welcome, {username}.
                </Typography>


                <Divider light className={classes.divider} />

                <SearchControls />
              </Box>

              <Divider light={true}/>

              <Box className={classes.mytitleDiv}>
                <Box className={classes.mysubtitleDiv}>
                  <Box className={classes.feedSubtitleDiv}>
                    <Typography
                      paragraph
                      align="left"
                      variant="h5"
                      color="textSecondary"
                    >
                      User Feed
                    </Typography>
                  </Box>

                  <Box className={classes.showFeedBtnDiv}>
                    <Tooltip 
                      title={
                        showUserFeedBtn === false ?
                          'Show Feed' :
                          'Hide Feed'
                      }
                    >
                      <Button
                        color={
                          showUserFeedBtn === false ?
                            "default" :
                            "secondary"
                        }
                        variant={
                          showUserFeedBtn === false ?
                            "contained" :
                            "outlined"
                        }
                        onClick={() => {
                          setShowUserFeedBtn(!showUserFeedBtn);
                        }}
                        className={classes.button}
                      >
                        {
                          showUserFeedBtn === false ?
                            'Show Feed' :
                            'Hide Feed'
                        }
                      </Button>
                    </Tooltip>
                  </Box>

                </Box>
                {
                  loadingState === 'success' &&
                  showUserFeedBtn !== false &&
                  userFeed !== null &&
                  userFeed.listings.length > 0 &&
                  <Grid className={classes.root} container spacing={2}>
                    <Grid item xs={12}>
                      <Grid container justify="center" spacing={2}>
                      {
                        userFeed.listings.map((listing) => (
                          <Grid key={listing.listing_id} item>
                            <ResourceCard
                              resource={listing}
                              owner={listing.username}
                              parentPage={`/home`}
                            />
                          </Grid>
                        ))
                      }
                      </Grid>
                    </Grid>
                  </Grid>
                }
                {
                  loadingState === 'success' &&
                  showUserFeedBtn !== false &&
                  userFeed === null &&
                  <Box className={classes.noResultsDiv}>
                    <Typography paragraph align="center" variant="body1" color="textSecondary">
                      No Listings found. Try following another User.
                    </Typography>
                  </Box>
                }
                {
                  loadingState === 'success' &&
                  showUserFeedBtn !== false &&
                  userFeed !== null &&
                  userFeed.listings.length === 0 &&
                  <Box className={classes.noResultsDiv}>
                    <Typography paragraph align="center" variant="body1" color="textSecondary">
                      No Listings found. Try following another User.
                    </Typography>
                  </Box>
                }
              </Box>
            </Box>
            <br/>
            <br/>
          </Box>
        }
      </Container>
    </Container>
  );
}

export default Home;
