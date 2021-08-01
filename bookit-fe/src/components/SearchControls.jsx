import React from "react";
import { StoreContext } from '../utils/store';
import {
  fetchSearchListings,
  fetchSearchUsers
} from "../utils/auxiliary";
import { useHistory } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from '@material-ui/icons/Clear';
import BackspaceIcon from '@material-ui/icons/Backspace';
import {
  Container,
  Box,
  makeStyles,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Button,
  FilledInput,
  InputLabel,
  InputAdornment,
  Grid,
  Checkbox,
  Typography,
  Select,
  Chip,
  MenuItem,
  Input,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';

// Material UI styling used on the SearchControls component
const useStyles = makeStyles((theme) => ({
  searchControlContainer: {
    padding: 0,
  },
  searchContainerDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  searchRadioDiv: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    margin: theme.spacing(0.5),
    paddingLeft: '0.5em',
  },
  timeDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '5em',
    margin: theme.spacing(0.5),
    paddingBottom: '10px',
  },
  timePickersDiv: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    marginRight: '1em',
    height: '100%',
    width: '500px',
  },
  timeframeCheckboxDiv: {
    marginRight: 0,
  },
  searchNoTimeDiv: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingTop: '1em',
  },
  searchUsersTopDiv: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '5em',
    width: '100%',
    margin: theme.spacing(0.5),
    paddingBottom: '10px',
  },
  chipsMenu: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chipItem: {
    margin: 1,
  },
  categoriesFormDiv: {
    display: 'flex',
    flexDirection: 'row',
    height: '6em',
    alignItems: 'center',
  },
  categoriesForm: {
    marginRight: '0.25em',
    width: '18em',
  },
  clearBtnDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '1em',
  },
  clearSearchBtn: {
    padding: 0,
    marginRight: '0.25em',
  },
  clearSearchIcon: {
    height: '34px',
    width: '34px',
  },
}));

const searchCategoriesList = [
  { key: 0, value: 'Entertainment'},
  { key: 1, value: 'Sport'},
  { key: 2, value: 'Accommodation'},
  { key: 3, value: 'Healthcare'},
  { key: 4, value: 'Other'},
];

// The SearchControls component is used within the Home and Search screens, which
// allows the user to search for Listings or Users, depending on the selected
// search type. When searching for Listings, the user may filter within
// one or more Listings categories, and/or within an availability time frame.
// Searching for Listings includes matches relating to its Title, Description
// and Location. Searching for Users simply returns similar matches to the input.
const SearchControls = () => {
  // state variables
  const context = React.useContext(StoreContext);
  const baseUrl = context.baseUrl;
  const token = context.token[0];
  const page = context.pageState[0];
  // a separation of search queries depending on search type
  const [searchQuery, setSearchQuery] = context.searchQuery;
  const [searchUserQuery, setSearchUserQuery] = context.searchUserQuery;
  // the search type refers to either 'listings' or 'users'
  const [searchType, setSearchType] = context.searchType;
  const [searchCategories, setSearchCategories] = context.searchCategories;
  // searchResults refers to listings
  const setSearchResults = context.searchResults[1];
  // searchUserResults refers to users
  const setSearchUserResults = context.searchUserResults[1];
  const [searchStartDatetime, setSearchStartDatetime] = context.searchStartDatetime;
  const [searchEndDatetime, setSearchEndDatetime] = context.searchEndDatetime;
  const [useSearchTimeFrame, setUseSearchTimeFrame] = context.useSearchTimeFrame;
  const history = useHistory();

  // Handle changes on the radio button to search listing vs users
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  }
  // both text change handlers dynamically update the query state upon input
  const handleSearchTextChange = (event) => {
    setSearchQuery(event.target.value);
  }
  const handleSearchUserTextChange = (event) => {
    setSearchUserQuery(event.target.value);
  }
  // clears the input field depending on the search type
  const handleSearchClear = () => {
    searchType === 'listings'
      ? setSearchQuery('')
      : setSearchUserQuery('')
  }
  // handle click also fires on the Enter keypress - this sends a API request
  // to update the respective query results variable and potentially navigates
  // to the search results page is not already on it
  const handleSearchClick = () => {
    let categoriesFlat = searchCategories.join(',').toLowerCase();
    if (searchType === 'listings') {
      fetchSearchListings(
        baseUrl, token, searchQuery, categoriesFlat,
        useSearchTimeFrame, searchStartDatetime.getTime(), searchEndDatetime.getTime(),
        setSearchResults
      ).then(() => {
          page !== '/search' &&
          history.push(`/search`);
        }
      );
    }
    else if (searchType === 'users') {
      fetchSearchUsers(
        baseUrl, token, searchUserQuery, setSearchUserResults
      ).then(() => {
          page !== '/search' &&
          history.push(`/search`);
        }
      );
    }    
  }
  // handles the changing of listing category
  const handleChangeCategory = (event) => {
    setSearchCategories(event.target.value);
  };
  const handleDeleteCategoryChip = (categoryName) => () => {
    setSearchCategories(
      (categories) => categories.filter((category) => category !== categoryName)
    );
  };
  const handleClearSearchCategories = () => {
    setSearchCategories([]);
  };
  // state / end date time functions ensure hourly granularity, with the
  // end time always at least an hour ahead of the start time
  const handleStartDateChange = (date) => {
    const mins = date.getMinutes();
    if (mins <= 30) {
      date.setMinutes(0)
    } else {
      date.setMinutes(60)
    }
    if (date >= searchEndDatetime) {
      let newDatetime = new Date(date);
      newDatetime.setMinutes(60);
      setSearchEndDatetime(newDatetime);
    }
    setSearchStartDatetime(date);
  };
  const handleEndDateChange = async (date) => {
    if (date <= searchStartDatetime) {
      let newDatetime = new Date(searchStartDatetime);
      newDatetime.setMinutes(60);
      setSearchEndDatetime(newDatetime);
    } else {
      const mins = date.getMinutes();
      if (mins <= 30) {
        date.setMinutes(0)
      } else {
        date.setMinutes(60)
      }
      setSearchEndDatetime(date);
    }
  };
  // updates the render state of the time slot buttons visibility
  const handleChangeUseTimeframe = () => {
    setUseSearchTimeFrame(!useSearchTimeFrame);
  }
  // material UI styling extention / overrides
  const classes = useStyles();

  return (
    <Container className={classes.searchControlContainer}>
      <Box>
        {
          searchType === 'listings' &&
          <Box className={classes.timeDiv}>
            <Box className={classes.categoriesFormDiv}>
              <FormControl className={classes.categoriesForm}>
                <InputLabel id="mutiple-categories-label">
                  Search Categories
                </InputLabel>
                <Select
                  labelId="mutiple-categories-label"
                  id="mutiple-categories"
                  multiple
                  value={searchCategories}
                  onChange={handleChangeCategory}
                  input={<Input id="select-multiple-categories" />}
                  renderValue={(selected) => (
                    <div className={classes.chipsMenu}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          className={classes.chipItem}
                          onMouseDown={(event) => {
                            event.stopPropagation();
                          }}
                          onDelete={handleDeleteCategoryChip(value)}
                        />
                      ))}
                    </div>
                  )}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: '16em',
                        width: '16em',
                      },
                    },
                  }}
                >
                  {searchCategoriesList.map((category) => (
                    <MenuItem key={category.key} value={category.value}>
                      {category.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box className={classes.clearBtnDiv}>
                <Tooltip title={'Clear Categories'} aria-label={'delete'}>
                  <IconButton
                    id={'clear-menu-button'}
                    color={'default'}
                    className={classes.button}
                    size="small"
                    onClick={() => {
                      handleClearSearchCategories()
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box className={classes.timePickersDiv}>
              {
                useSearchTimeFrame === true &&
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="center" spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <KeyboardDateTimePicker
                        margin="normal"
                        id="time"
                        label="Start Time"
                        value={searchStartDatetime}
                        onChange={handleStartDateChange}
                        minutesStep={60}
                        openTo="hours"
                        views={["hours"]}
                        format="dd/MM/yyyy hh:mm a"
                        showTodayButton
                        ampm={true}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <KeyboardDateTimePicker
                        margin="normal"
                        id="time"
                        label="End Time"
                        value={searchEndDatetime}
                        onChange={handleEndDateChange}
                        minutesStep={60}
                        openTo="hours"
                        views={["hours"]}
                        format="dd/MM/yyyy hh:mm a"
                        showTodayButton
                      />
                    </Grid>
                  </Grid>
                </MuiPickersUtilsProvider>
              }
              {
                useSearchTimeFrame !== true &&
                <Box className={classes.searchNoTimeDiv}>
                  <Typography component={'span'} variant="subtitle1" align="center" color="textSecondary">
                    {'Searching within all time frames'}
                  </Typography>
                </Box>
              }
            </Box>
            <Box>
              <FormControl component="fieldset">
                <FormLabel component="legend-timeframe">
                  <Typography component={'span'} variant="body2" align="left" color="textSecondary">
                    {'Search within time frame'}
                  </Typography>
                </FormLabel>
                <FormControlLabel
                  value="useTimeframe"
                  control={
                    <Checkbox
                      color="primary"
                      checked={useSearchTimeFrame}
                      onChange={handleChangeUseTimeframe}
                    />
                  }
                  label={
                    <Typography component={'span'} variant="body1" align="center" color="textPrimary">
                      {'Use Time Frame'}
                    </Typography>
                  }
                  labelPlacement="end"
                  className={classes.timeframeCheckboxDiv}
                />
              </FormControl>
            </Box>
          </Box>
        }
        {
          searchType !== 'listings' &&
          <Box className={classes.searchUsersTopDiv}>
            <Typography component={'span'} variant="h5" align="center" color="textSecondary">
              {'Searching for Users'}
            </Typography>
          </Box>
        }
        <Box className={classes.searchContainerDiv}>
          <FormControl variant="filled">
          <InputLabel htmlFor="outlined-adornment-search">Search</InputLabel>
            <FilledInput
              id="outlined-adornment-search"
              type="text"
              value={
                searchType === 'listings' ?
                searchQuery :
                searchUserQuery
              }
              onChange={
                searchType === 'listings' ?
                  e => handleSearchTextChange(e) :
                  e => handleSearchUserTextChange(e)
              }
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <Box>
                    <Tooltip title={'Clear'}>
                      <IconButton
                        size="medium"
                        color="default"
                        className={classes.clearSearchBtn}
                        onClick={() => { handleSearchClear(); }}
                      >
                        <BackspaceIcon className={classes.clearSearchIcon} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={`Search ${searchType}`}>
                      <Button
                        variant="contained"
                        color="default"
                        size="small"
                        onClick={() => { handleSearchClick(); }}
                      >
                        Search
                      </Button>
                    </Tooltip>
                  </Box>
                </InputAdornment>
              }
              onKeyPress={(ekey) => {
                if (ekey.key === 'Enter') {
                  ekey.preventDefault();
                  handleSearchClick();
                }
              }}
            />
          </FormControl>
        </Box>
        <Box className={classes.searchRadioDiv}>
          <FormControl>
            <RadioGroup
              row
              aria-label="search-category"
              name="search-category"
              value={searchType}
              onChange={handleSearchTypeChange}
            >
              <Tooltip title={'Search for Listings'} placement="bottom-start">
                <FormControlLabel
                  value="listings"
                  control={<Radio/>}
                  label="Listings"
                  
                />
              </Tooltip>
              <Tooltip title={'Search for Users'} placement="bottom-start">
                <FormControlLabel
                  value="users"
                  control={<Radio/>}
                  label="Users"
                />
              </Tooltip>
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
      <br/>
    </Container>
  );
}

export default SearchControls;
