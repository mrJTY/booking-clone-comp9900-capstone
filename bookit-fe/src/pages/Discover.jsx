import React from 'react';
import Navbar from '../components/Navbar';
import { StoreContext } from '../utils/store';
import { fetchRecommendations } from '../utils/auxiliary';
import ResourceCard from '../components/ResourceCard';
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
  ButtonGroup,
  Button,
  Tooltip,
} from '@material-ui/core';
import Carousel from 'react-material-ui-carousel';

// Page styling used on the Discover screen and its subcomponents
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
  mysubtitleDiv: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginLeft: '20px',
  },
  subtitleTextDiv: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    marginLeft: '36px',
  },
  subtitleBtnDiv: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
  },
  btnGrp: {
    marginRight: '20px',
  },
  button: {
    margin: theme.spacing(1),
  },
  divider: {
    marginTop: '20px',
    height: '2px',
  },
  resourceCardDiv: {
    marginTop: '1em',
    marginBottom: '2em',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
  },
  top5GridRoot: {
    flexWrap: 'nowrap',
  },
  top5GridItem: {
  },
  recommendationsNotFoundDiv: {
    margin: '2em 0em',
  },
}));

// The Discover page leverages the ResourceCard & Carousel subcomponents,
// displaying the Top 5 and Recommended Listings for the primary user.
// Distinction between which to display is managed through two buttons
// in the top-right corner of the screen.
const Discover = () => {
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const baseUrl = context.baseUrl;
  // classes used for Material UI component styling
  const classes = useStyles();
  // redirect to login if not logged in
  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{pathname: '/login'}}/>
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // the page variable stores the current page as a string
  const [page, setPage] = context.pageState;
  // page loading state variables
  const [loadingState, setLoadingState] = React.useState('idle');
  const [top5Listings, setTop5Listings] = React.useState('idle');
  const [recListings, setRecListings] = React.useState('idle');
  // default the display to Top 5 rated Listings
  const [top5Btn, settop5Btn] = React.useState(true);
  // sets up the Discover page by fetching both Top 5 and Recommended Listings
  React.useEffect(() => {
    setPage('/discover');
    async function setupDiscover() {
      setLoadingState('loading');
      await fetchRecommendations(baseUrl, token, setTop5Listings, true);
      await fetchRecommendations(baseUrl, token, setRecListings, false);
      setLoadingState('success');
    }
    setupDiscover();
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
                <Typography align="left" variant="h4">
                  Discover
                </Typography>
              </Box>
            </Box>
            <Box className={classes.mysubtitleDiv}>
              <Box className={classes.subtitleTextDiv}>
                <Typography component={'span'} align="center" variant="h6" color="textSecondary">
                  {
                    top5Btn === true ?
                      'Top 5 Rated Listings' :
                      'Recommended for you'
                  }
                </Typography>
              </Box>

              <Box className={classes.subtitleBtnDiv}>
                <ButtonGroup variant="text" color="primary" className={classes.btnGrp} >
                  <Tooltip title="Top 5">
                    <Button
                      id="top-5-listings-button"
                      variant="text"
                      color={top5Btn === true ? "default" : "primary"}
                      className={classes.buttonText}
                      onClick={() => {
                        settop5Btn(true);
                      }}
                    >
                      Top 5 Listings
                    </Button>
                  </Tooltip>
                  <Tooltip title="Just for You">
                    <Button
                      id="recommended-listings-button"
                      variant="text"
                      color={top5Btn === true ? "primary" : "default"}
                      className={classes.buttonText}
                      onClick={() => {
                        settop5Btn(false);
                      }}
                    >
                      Recommendations
                    </Button>
                  </Tooltip>
                </ButtonGroup>
              </Box>
            </Box>
            <Divider light className={classes.divider} />
            {
              top5Btn === true &&
              top5Listings.listings?.length > 0 &&
              <Box className={classes.resourceCardDiv}>
                <Carousel
                  animation="fade"
                >
                  {top5Listings?.listings.map((listing) => (
                    <div key={listing.listing_id}>
                      <ResourceCard
                        resource={listing}
                        owner={listing.username}
                        parentPage={`/discover`}
                      />
                    </div>
                  ))}
                </Carousel>
              </Box>
            }
            {
              top5Btn === true &&
              top5Listings.listings?.length === 0 &&
              <Box className={classes.bookingsNotFoundDiv}>
                <Typography
                  component={'span'} align="center"
                  variant="body1" color="textSecondary"
                >
                  {`Top 5 Listings not found.`}
                </Typography>
              </Box>
            }
            {
              top5Btn !== true &&
              recListings.listings?.length > 0 &&
              <Box className={classes.resourceCardDiv}>
                <Carousel
                  animation="fade"
                >
                  {recListings?.listings.map((listing) => (
                    <div key={listing.listing_id}>
                      <ResourceCard
                        resource={listing}
                        owner={listing.username}
                        parentPage={`/discover`}
                      />
                    </div>
                  ))}
                </Carousel>
              </Box>
            }
            {
              top5Btn !== true &&
              recListings.listings?.length === 0 &&
              <Box className={classes.recommendationsNotFoundDiv}>
                <Typography
                  component={'span'} align="center"
                  variant="body1" color="textSecondary"
                >
                  {`No Recommendations found.`}
                </Typography>
              </Box>
            }

          </Box>
        }
      </Container>
    </Container>
  )
}

export default Discover;
