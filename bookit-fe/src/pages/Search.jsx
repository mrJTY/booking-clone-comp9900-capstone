import React from 'react';
import {StoreContext} from '../utils/store';
import Navbar from '../components/Navbar';
import ResourceCard from "../components/ResourceCard";
import SearchControls from '../components/SearchControls';
import {
  followUserRequest,
  unfollowUserRequest,
  fetchSearchUsers
} from '../utils/auxiliary';
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
  ListItemSecondaryAction,
  Avatar,
  Link,
  Button,
  Tooltip,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
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
  userResultsListRoot: {
    width: '100%',
    justifyContent: 'center',
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

// The Search page is a results screen which contains the SearchControls component
// along with any search results contained in the global state variables which
// depend on the search type. The SearchControls component contains an extended
// description on the search functionality.
// Within the Search results section, if the results are Listings then
// a list of ResourceCard subcomponents are rendered.
// If the search results are that of Users, then a list of users populates the rest
// of the page, where the Primary User may navigate to their another user's Profile
// or choose to follow/unfollow them from within the search results.
const Search = () => {
  // state variables
  const context = React.useContext(StoreContext);
  const classes = useStyles();
  const token = context.token[0];
  const baseUrl = context.baseUrl;
  const [page, setPage] = context.pageState;
  const [loadingState, setLoadingState] = React.useState('idle');
  const primaryUsername = context.username[0];
  // searchResults refers to listings
  const searchResults = context.searchResults[0];
  // whereas searchUserResults refers to users
  const [searchUserResults, setSearchUserResults] = context.searchUserResults;
  // a separation of queries ensures clearing one does not clear the other
  const searchQuery = context.searchQuery[0];
  const searchUserQuery = context.searchUserQuery[0];
  // the search type refers to either 'listings' or 'users'
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
  // ensure a change in search results renders appropriately
  React.useEffect(() => {
    setPage('/search');
    async function setupSearch() {
      setLoadingState('loading');
      setLoadingState('success');
    }
    setupSearch();
  }, [searchResults]); // eslint-disable-line react-hooks/exhaustive-deps
  // any change in the state variables within the dependency array update
  // the URL parameters accordingly
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
  // depending on the is_followed boolean, the primary user
  // may follow or unfollow another user within the search results list
  const handleClickFollow = async (follow, userId, username) => {
    if (follow) {
      await followUserRequest(baseUrl, token, userId);
    } else {
      await unfollowUserRequest(baseUrl, token, username);
    }
    await fetchSearchUsers(baseUrl, token, searchUserQuery, setSearchUserResults);
  }

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
                  searchResults?.length > 0 &&
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
                  searchResults?.length === 0 &&
                  <Box className={classes.noResultsDiv}>
                    No results for Listings found
                  </Box>
                }
                {
                  loadingState === 'success' &&
                  searchType === 'users' &&
                  searchUserResults?.length > 0 &&
                  <List className={classes.userResultsListRoot}>
                    {
                      searchUserResults.map((user) => (
                        <ListItem key={user.user_id} className={classes.userResultsDiv}>
                          <ListItemAvatar>
                            <Avatar
                              aria-label="user-avatar"
                              src={user.avatar}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" color="textSecondary" align="left">
                                <Tooltip
                                  title={`View ${user.username}'s profile`}
                                  placement="bottom-start"
                                >
                                  <Link
                                    component={RouterLink}
                                    to={`/profile/${user.username}`}
                                  >
                                    {user.username}
                                  </Link>
                                </Tooltip>
                              </Typography>
                            }
                            secondary={user.email}
                          />
                          {
                            user.username !== primaryUsername &&
                            <ListItemSecondaryAction>
                              {
                                Boolean(Number(user.is_followed)) === true &&
                                <Tooltip title={`Unfollow ${user.username}`} aria-label={'unfollow'}>
                                  <Button
                                    id={'user-unfollow-button'}
                                    variant={'outlined'}
                                    color={'secondary'}
                                    className={classes.button}
                                    onClick={() => {
                                      if (Boolean(Number(user.is_followed)) === true) {
                                        handleClickFollow(false, null, user.username);
                                      }
                                    }}
                                  >
                                    {'Unfollow'}
                                  </Button>
                                </Tooltip>
                              }
                              <Tooltip
                                title={
                                  Boolean(Number(user.is_followed)) !== true
                                    ? `Follow ${user.username}`
                                    : ''
                                }
                                aria-label={'follow'}
                                disableHoverListener={
                                  Boolean(Number(user.is_followed)) !== true
                                    ? false
                                    : true
                                }
                              >
                                <Button
                                  id={'user-follow-button'}
                                  variant={
                                    Boolean(Number(user.is_followed)) !== true ?
                                      'contained' :
                                      'outlined'
                                  }
                                  color={'default'}
                                  className={classes.button}
                                  disabled={
                                    Boolean(Number(user.is_followed)) !== true ?
                                      false :
                                      true
                                  }
                                  onClick={() => {
                                    if (Boolean(Number(user.is_followed)) !== true) {
                                      handleClickFollow(true, user.user_id, null);
                                    }
                                  }}
                                  endIcon={
                                    Boolean(Number(user.is_followed)) !== true ?
                                      <AddIcon /> :
                                      <CheckIcon />
                                  }
                                >
                                  {
                                    Boolean(Number(user.is_followed)) !== true ?
                                      'Follow' :
                                      'Following'
                                  }
                                </Button>
                              </Tooltip>
                            </ListItemSecondaryAction>
                          }
                        </ListItem>
                      ))
                    }
                  </List>
                }
                {
                  loadingState === 'success' &&
                  searchType === 'users' &&
                  searchUserResults?.length === 0 &&
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
