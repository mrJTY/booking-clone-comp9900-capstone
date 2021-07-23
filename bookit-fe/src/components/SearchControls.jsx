import React from "react";
import { StoreContext } from '../utils/store';
import {
  fetchSearchListings,
  fetchSearchUsers
} from "../utils/auxiliary";
import { useHistory } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from '@material-ui/icons/Clear';
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
    paddingLeft: '1em',
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
    margin: theme.spacing(1),
    width: '18em',
  },
  clearBtnDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '1em',
  },
}));

const searchCategoriesList = [
  { key: 0, value: 'Entertainment'},
  { key: 1, value: 'Sport'},
  { key: 2, value: 'Accommodation'},
  { key: 3, value: 'Healthcare'},
  { key: 4, value: 'Other'},
];


const SearchControls = () => {
  const context = React.useContext(StoreContext);
  const baseUrl = context.baseUrl;
  const token = context.token[0];
  const page = context.pageState[0];
  const [searchQuery, setSearchQuery] = context.searchQuery;
  const [searchUserQuery, setSearchUserQuery] = context.searchUserQuery;  
  const [searchType, setSearchType] = context.searchType;
  const [searchCategories, setSearchCategories] = context.searchCategories;
  const setSearchResults = context.searchResults[1];
  const setSearchUserResults = context.searchUserResults[1];
  const [searchStartDatetime, setSearchStartDatetime] = context.searchStartDatetime;
  const [searchEndDatetime, setSearchEndDatetime] = context.searchEndDatetime;
  const [useSearchTimeFrame, setUseSearchTimeFrame] = context.useSearchTimeFrame;
  const history = useHistory();

  // const [searchVals, setSearchVals] = React.useState(
  // {
  //   search: '',
  // });

  // const handleChangeSearchVals = (prop) => (event) => {
  //   setSearchVals({ ...searchVals, [prop]: event.target.value });
  // };

  // Handle changes on the radio button to search listing vs users
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  }

  const handleSearchTextChange = (event) => {
    setSearchQuery(event.target.value);
  }

  const handleSearchUserTextChange = (event) => {
    setSearchUserQuery(event.target.value);
  }

  const handleSearchClick = () => {

    console.log('search query:')
    console.log(searchQuery)
    console.log('search type:')    
    console.log(searchType)
    console.log('search categories:')    
    console.log(searchCategories)
    let categoriesFlat = searchCategories.join(',').toLowerCase();
    console.log('categories flat:')    
    console.log(categoriesFlat)

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

  const handleChangeUseTimeframe = () => {
    setUseSearchTimeFrame(!useSearchTimeFrame);
  }

  const classes = useStyles();

  return (
    <Container>
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
              // value={searchVal.search}
              value={
                searchType === 'listings' ?
                searchQuery :
                searchUserQuery
              }
              // onChange={handleChange('search')}
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => { handleSearchClick(); }}
                  >
                    Search
                  </Button>
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
        {/*TODO: Add controls for descending / asc */}
        <Box className={classes.searchRadioDiv}>
          <FormControl>
            <RadioGroup
              row
              aria-label="search-category"
              name="search-category"
              defaultValue="listings"
              onChange={handleSearchTypeChange}
            >
              <FormControlLabel
                value="listings"
                control={<Radio/>}
                label="Listings"
                
              />
              <FormControlLabel
                value="users"
                control={<Radio/>}
                label="Users"
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
