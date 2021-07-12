import {
  Grid,
  Container,
  makeStyles,
} from "@material-ui/core";
import ResourceCard from "./ResourceCard";
import React from "react";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({}));

const SearchResults = (
  {
    searchListingResults
  }
) => {
  const classes = useStyles();
  const history = useHistory();
  var renderedResults;
  if (searchListingResults.length > 0) {
    renderedResults = (
      searchListingResults.map((listing) => (
        <Grid key={listing.listing_id} item>
          <ResourceCard
            resource={listing} owner={listing.username}
            history={history} parentPage={`/search`}
          />
        </Grid>
      ))
    );
  } else {
    renderedResults = (<div>No results found</div>)
  }

  return (
    <Container>
      <Grid className={classes.root} container spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2}>
            {renderedResults}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SearchResults;
