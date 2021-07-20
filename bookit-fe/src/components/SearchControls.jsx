import React from "react";
import { StoreContext } from '../utils/store';
import { fetchSearchListings } from "../utils/auxiliary";
import { useHistory } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import {
  Container,
  Box,
  makeStyles,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Button,
  FilledInput,
  InputLabel,
  InputAdornment,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  search: {
    background: "gray",
    height: "100%",
  },
  searchIcon: {
    height: "100%",
  },
  searchButton: {
    height: "100%",
  },
  formControl: {
    margin: theme.spacing(3),
  },
  searchContainerDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: theme.spacing(1),
  },
  searchRadioDiv: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    margin: theme.spacing(0.5),
    paddingLeft: '8px',
  },
}));


const SearchControls = () => {
  const context = React.useContext(StoreContext);
  const baseUrl = context.baseUrl;
  const token = context.token[0];
  const [searchQuery, setSearchQuery] = context.searchQuery;
  const [searchCategory, setSearchCategory] = context.searchCategory;
  const [searchResults, setSearchResults] = context.searchResults;
  const history = useHistory();

  // const [searchVal, setSearchVal] = React.useState(
  // {
  //   search: '',
  // });

  // const handleChange = (prop) => (event) => {
  //   setSearchVal({ ...searchVal, [prop]: event.target.value });
  // };

  // Handle changes on the radio button to search listing vs users
  const handleSearchCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  }

  const handleSearchTextChange = (event) => {
    setSearchQuery(event.target.value);
  }

  const handleSearchClick = () => {

    console.log('clicked search')
    console.log(searchQuery)
    console.log(searchCategory)
    
    if (searchCategory === 'listings') {
      fetchSearchListings(baseUrl, token, searchQuery, setSearchResults).then(() => {
          history.push({
            pathname: "/search",
            state: {
              searchResults: searchResults,
              searchQuery: searchQuery,
            }
          });
        }
      );
    }
  }

  const classes = useStyles();
  return (
    <Container>
      <Box className={classes.searchContainerDiv}>
        <Box className={classes.searchContainerDiv}>
          <FormControl variant="filled">
          <InputLabel htmlFor="outlined-adornment-search">Search</InputLabel>
            <FilledInput
              id="outlined-adornment-search"
              type="text"
              // value={searchVal.search}
              value={searchQuery}
              // onChange={handleChange('search')}
              onChange={e => handleSearchTextChange(e)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => { handleSearchClick(); }}
                  >
                    Search
                  </Button>
                </InputAdornment>
              }
              // labelWidth={70}
              onKeyPress={(ekey) => {
                if (ekey.key === 'Enter') {
                  ekey.preventDefault();
                  handleSearchClick();
                }
              }}
            />
          </FormControl>
        </Box>
        {/*TODO: Add controls for descending / asc */}
        <Box className={classes.searchRadioDiv}>
          <FormControl>
            <RadioGroup
              row
              aria-label="search-category"
              name="search-category"
              defaultValue="listings"
              onChange={handleSearchCategoryChange}
            >
              <FormControlLabel
                value="listings"
                control={<Radio/>}
                label="Listings"
                
              />
              <FormControlLabel
                value="users"
                control={<Radio/>}
                label="Users (TODO)"
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
      <br/>
    </Container>
  );
}

export default SearchControls;
