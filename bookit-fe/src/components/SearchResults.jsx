import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import {
    Grid,
    Container,
    makeStyles,
    Radio,
    RadioGroup,
    FormControlLabel,
} from "@material-ui/core";
import ResourceCard from "./ResourceCard";
import React from "react";
import {fetchSearchListings} from "../utils/auxiliary";

const useStyles = makeStyles((theme) => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formControl: {
        margin: theme.spacing(3),
    },
}));

// https://material-ui.com/components/app-bar/#app-bar-with-a-primary-search-field

const SearchResults = (
    {
        context, username, history,
    }
) => {
    const SEARCH_CATEGORY_LISTINGS = "listings";
    const SEARCH_CATEGORY_USERS = "users";
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchCategory, setSearchCategory] = React.useState(SEARCH_CATEGORY_LISTINGS);
    const [searchListingResults, setSearchListingResults] = React.useState([]);
    const classes = useStyles();
    const baseUrl = context.baseUrl;
    const token = context.token[0];

    React.useEffect(() => {
        // Set listings as default search category
        setSearchCategory(SEARCH_CATEGORY_LISTINGS);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Handles the text input from the search box
    const handleSearchInput = (event) => {
        setSearchQuery(event.target.value);
        if (searchCategory === SEARCH_CATEGORY_LISTINGS) {
            fetchSearchListings(baseUrl, token, searchQuery, setSearchListingResults);
        }
        // TODO:
        // else if (searchCategory === SEARCH_CATEGORY_USERS) {
        //     fetchSearchUsers(baseUrl, token, searchQuery, setSearchListingResults);
        // }
    }

    // Handle changes on the radio button to search listing vs users
    const handleSearchCategoryChange = (event) => {
        setSearchCategory(event.target.value);
    }

    const handleClickOpen = (event) => {
        // TODO: Is this really needed by the ResouceCard?
        console.log("TODO!");
    }

    return (
        <Container>
            <div>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon/>
                    </div>
                    <InputBase
                        placeholder="Search listings…"
                        onChange={handleSearchInput}
                    />
                </div>
                <br/>
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
            <Grid className={classes.root} container spacing={2}>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={2}>
                        {searchListingResults.map((listing) => (
                            <Grid key={listing.listing_id} item>
                                <ResourceCard
                                    resource={listing} owner={username}
                                    history={history} classes={classes}
                                    handleClickOpen={handleClickOpen}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}

export default SearchResults;
