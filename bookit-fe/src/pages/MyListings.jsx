import React from 'react';
import Navbar from '../components/Navbar';
import ResourceCard from '../components/ResourceCard';
import DeleteListing from '../components/DeleteListing';
import { StoreContext } from '../utils/store';
import { fetchMyListings } from '../utils/auxiliary';
import {
  useHistory,
  Redirect,
} from 'react-router-dom';
import {
  makeStyles,
  Container,
  Box,
  Button,
  Grid,
  Typography,
  CircularProgress,
} from '@material-ui/core';

// Page styling used on the MyListings screen and its subcomponents
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  cardRoot: {
    maxWidth: 345,
    minWidth: 345,
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
  mytitleDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
    paddingBottom: '8px',
  },
  resourceBorder: {
    margin: theme.spacing(1),
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9 ratio
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
  const history = useHistory();
  const baseUrl = context.baseUrl;

  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // *** TESTING
  const username = context.username[0];
  const password = context.password[0];
  // END TEST

  const [mylistings, setMylistings] = context.mylistings;

  // object containing all of the users a user is following from a GET API request
  // const [following, setFollowing] = context.following;
  // the page variable stores the current page as a string
  const [page, setPage] = context.pageState;
  // page loading state
  const [loadingState, setLoadingState] = React.useState('idle');
  // updated ensures appropriate re-rendering upon changing or deleting a resource
  const updated = context.updates[0];
  // used for the delete dialog
  const [open, setOpen] = React.useState(false);
  // listid represents the current listing id which the user may want to delete
  const [listid, setListid] = React.useState(null);
  // state variables used for the DeleteListing modal
  const handleClickOpen = (id) => {
    setListid(id);
    setOpen(true);
  };
  const handleClose = () => {
    setListid(null);
    setOpen(false);
  };

  React.useEffect(() => {
    setPage('/mylistings');
    async function setupMyListings () {
      setLoadingState('loading');
      await fetchMyListings(baseUrl, username, password, setMylistings);
      setLoadingState('success');
    }
    setupMyListings();
  }, [updated]); // eslint-disable-line react-hooks/exhaustive-deps

  // classes used for Material UI component styling
  const classes = useStyles();

  return (
    <Container>
      <Navbar page={page} />
      <Container className={classes.container}>
        {
          loadingState !== 'success' &&
          <div>
            {/* Loading... */}
            <CircularProgress color="secondary" />
          </div>
        }
        {
          loadingState === 'success' &&
          <Box className={classes.containerDiv}>
            <Box className={classes.mytitleDiv}>
              <Box>
                <Typography paragraph align="left" variant="h4">
                  Your Listings
                </Typography>
              </Box>
              <Box className={classes.button}>
                <Button
                  id="new-listing-button"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    history.push(`/listings/create`)
                  }}
                >
                  New Listing
                </Button>
              </Box>
            </Box>
            <br />
            <br />
            <Grid className={classes.root} container spacing={2}>
                <Grid item xs={12}>
                  <Grid container justify="center" spacing={2}>
                    {mylistings.map((listing) => (
                      <Grid key={listing.listing_id} item>
                        <ResourceCard
                          resource={listing} owner={username}
                          history={history} classes={classes}
                          handleClickOpen={handleClickOpen}
                        />
                        <DeleteListing
                          open={open} handleClose={handleClose} listingId={listid}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
          </Box>
        }
      </Container>
      <br />
    </Container>
  )
}

export default MyListings;
