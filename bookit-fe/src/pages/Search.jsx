import React from 'react';
import {StoreContext} from '../utils/store';
import Navbar from '../components/Navbar';
import ResourceCard from "../components/ResourceCard";
import SearchControls from '../components/SearchControls';
import {
  Redirect
} from 'react-router-dom';
import {
  makeStyles,
  Box,
  Container,
  Typography,
  CircularProgress,
  Grid,
} from '@material-ui/core';

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
  noResultsDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: theme.spacing(1),
    justifyContent: 'center',
    textAlign: 'center',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const Search = () => {
  const context = React.useContext(StoreContext);
  const classes = useStyles();
  const token = context.token[0];
  const [page, setPage] = context.pageState;
  const [loadingState, setLoadingState] = React.useState('idle');
  const searchResults = context.searchResults[0];

  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{pathname: '/login'}}/>
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    setPage('/search');
    async function setupSearch() {
      setLoadingState('loading');
      setLoadingState('success');
    }
    setupSearch();
  }, [searchResults]); // eslint-disable-line react-hooks/exhaustive-deps


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
                  Search Results
                </Typography>

                <SearchControls />

                {
                  loadingState === 'success' &&
                  searchResults.length > 0 &&
                  <Grid className={classes.root} container spacing={2}>
                    <Grid item xs={12}>
                      <Grid container justify="center" spacing={2}>
                      {
                        searchResults.map((listing) => (
                          <Grid key={listing.listing_id} item>
                            <ResourceCard
                              resource={listing}
                              owner={listing.username}
                              parentPage={`/search`}
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
                  searchResults.length === 0 &&
                  <Box className={classes.noResultsDiv}>
                    No results found
                  </Box>
                }

              </Box>
            </Box>
            <br/>
            <br/>
          </Box>
        }
      </Container>
      <br />
    </Container>
  );
}

export default Search;
