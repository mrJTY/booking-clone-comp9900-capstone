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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Link,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { useHistory } from "react-router-dom";

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
  userResultsDiv: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    margin: theme.spacing(1),
    paddingLeft: '1.5em',
  },
}));

const Search = () => {
  const context = React.useContext(StoreContext);
  const classes = useStyles();
  const token = context.token[0];
  const [page, setPage] = context.pageState;
  const [loadingState, setLoadingState] = React.useState('idle');
  const searchResults = context.searchResults[0];
  const searchUserResults = context.searchUserResults[0];
  const searchQuery = context.searchQuery[0];
  const searchUserQuery = context.searchUserQuery[0];
  const searchType = context.searchType[0];
  const searchCategories = context.searchCategories[0];
  const useSearchTimeFrame = context.useSearchTimeFrame[0];
  const searchStartDatetime = context.searchStartDatetime[0];
  const searchEndDatetime = context.searchEndDatetime[0];
  const history = useHistory();

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

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery && searchType === 'listings') {
      params.append(searchType, searchQuery)
      if (searchCategories.length > 0) {
        params.append('categories', searchCategories.join(','));
      } else {
        params.delete('categories');        
      }      
      if (useSearchTimeFrame === true) {
        params.append('start_time', searchStartDatetime.getTime());
        params.append('end_time', searchEndDatetime.getTime());
      } else {
        params.delete('start_time');
        params.delete('end_time');
      }
    } else if (searchUserQuery && searchType === 'users') {
      params.append(searchType, searchUserQuery)
    }
    else {
      params.delete(searchType);
    }
    history.push({ search: params.toString() })
  }, [searchType, searchQuery, searchUserQuery, searchCategories, useSearchTimeFrame, history]); // eslint-disable-line react-hooks/exhaustive-deps


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
                  searchType === 'listings' &&
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
                  searchType === 'listings' &&
                  searchResults.length === 0 &&
                  <Box className={classes.noResultsDiv}>
                    No results for Listings found
                  </Box>
                }                
                {
                  loadingState === 'success' &&
                  searchType === 'users' &&
                  searchUserResults.length > 0 &&
                  <List>
                    {
                      searchUserResults.map((user) => (
                        <ListItem key={user.user_id} className={classes.userResultsDiv} alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar aria-label="resource">
                              {user.username[0]}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={


                            <Typography variant="subtitle2" color="textSecondary" align="left">
                              <Link
                                component={RouterLink}
                                to={`/profile/${user.username}`}
                              >
                                {user.username}
                              </Link>
                            </Typography>

                             
                            }
                            secondary={
                              'following?'
                            }
                          />
                        </ListItem>
                      ))
                    }
                  </List>
                }
                {
                  loadingState === 'success' &&
                  searchType === 'users' &&
                  searchUserResults.length === 0 &&
                  <Box className={classes.noResultsDiv}>
                    No results for Users found
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
