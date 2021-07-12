import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import {
  Container,
  makeStyles,
  Radio,
  RadioGroup,
  FormControlLabel, Button,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  search: {
    background: "grey",
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
}));

// https://material-ui.com/components/app-bar/#app-bar-with-a-primary-search-field

const SearchControls = ({handleSearchTextChange, handleSearchCategoryChange, handleSearchClick}) => {
  const classes = useStyles();

  const SEARCH_CATEGORY_LISTINGS = "listings";
  const SEARCH_CATEGORY_USERS = "users";

  return (
    <Container>
      <div>
        <div>
          <div>
            <SearchIcon className={classes.searchIcon}/>
            <InputBase className={classes.search}
                       placeholder="Search here."
                       onChange={handleSearchTextChange}
            />
            <Button onClick={handleSearchClick} className={classes.searchButton}>Search!</Button>
          </div>
          {/*TODO: Add controls for descending / asc */}
          <RadioGroup aria-label="search-category" name="search-category"
                      onChange={handleSearchCategoryChange}>
            <FormControlLabel control={<Radio/>} label={SEARCH_CATEGORY_LISTINGS}
                              value={SEARCH_CATEGORY_LISTINGS}/>
            <FormControlLabel control={<Radio/>} label={`${SEARCH_CATEGORY_USERS} (not yet implemented)`}
                              value={SEARCH_CATEGORY_USERS}/>
          </RadioGroup>
        </div>
        <br/>
      </div>
    </Container>
  );
}

export default SearchControls;
