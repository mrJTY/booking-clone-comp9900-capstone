import React from 'react';
import {StoreContext} from '../utils/store';
import Navbar from '../components/Navbar';
import SearchResults from '../components/SearchResults';
import SearchControls from '../components/SearchControls';
import {
  useHistory,
  Redirect
} from 'react-router-dom';
import {
  makeStyles,
  Box,
  Container,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import {fetchSearchListings} from "../utils/auxiliary";

const useStyles = makeStyles((theme) => ({}));

const Search = () => {
  const context = React.useContext(StoreContext);
  const classes = useStyles();
  const history = useHistory();
  const baseUrl = context.baseUrl;
  const token = context.token[0];
  const [page, setPage] = context.pageState;
  const [loadingState, setLoadingState] = React.useState('idle');

  // Categories
  const SEARCH_CATEGORY_LISTINGS = "listings";
  const SEARCH_CATEGORY_USERS = "users";
  const SEARCH_CATEGORY_AVAILABILITIES = "availabilities";

  // State variables
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchListingResults, setSearchListingResults] = React.useState('');
  const [searchCategory, setSearchCategory] = React.useState(SEARCH_CATEGORY_LISTINGS);

  // Handle changes on the radio button to search listing vs users
  const handleSearchCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  }

  const handleSearchTextChange = (event) => {
    setSearchQuery(event.target.value);
  }

  const handleSearchClick = (event) => {
    if (searchCategory === SEARCH_CATEGORY_LISTINGS) {
      fetchSearchListings(baseUrl, token, searchQuery, setSearchListingResults).then(() => {
          history.push({
            pathname: "/search",
            state: {
              searchListingResults: searchListingResults,
              searchQuery: searchQuery,
            }
          });
        }
      );
    }
  }


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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <Navbar page={page}/>
      <Container>
        {
          loadingState !== 'success' &&
          <div>
            <CircularProgress color="secondary"/>
          </div>
        }
        {
          loadingState === 'success' &&
          <Box>
            <Box>
              <Box>
                <Typography paragraph align="left" variant="h4">
                  Search Results
                </Typography>
                <SearchControls handleSearchTextChange={handleSearchTextChange}
                                handleSearchCategoryChange={handleSearchCategoryChange}
                                handleSearchClick={handleSearchClick}/>
                <SearchResults searchListingResults={searchListingResults}/>
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

export default Search;
