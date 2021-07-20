import React from "react";
import { StoreContext } from '../utils/store';
import ResourceCard from "./ResourceCard";
import {
  Grid,
  Container,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

// *************************************************************
// NOTE: OBSOLETE
// *************************************************************

const SearchResults = () => {
  const context = React.useContext(StoreContext);
  const searchResults = context.searchResults[0];
  const [loadingState, setLoadingState] = React.useState('idle');

  React.useEffect(() => {
    async function setupSearchResults () {
      searchResults.length > 0 ? 
        await setLoadingState('loading') :
        await setLoadingState('success')
    }
    setupSearchResults();
  }, [searchResults]); // eslint-disable-line react-hooks/exhaustive-deps


  // var renderedResults;
  // if (searchResults.length > 0) {
  //   renderedResults = (
  //     searchResults.map((listing) => (
  //       <Grid key={listing.listing_id} item>
  //         <ResourceCard
  //           resource={listing} owner={listing.username}
  //           history={history} parentPage={`/search`}
  //         />
  //       </Grid>
  //     ))
  //   );
  // } else {
  //   renderedResults = (<div>No results found</div>)
  // }

  const classes = useStyles();
  return (
    <Container>
      <Grid className={classes.root} container spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2}>
            {
              loadingState !== 'success' &&
              <div>No results found</div>
            }
            {
              loadingState === 'success' &&
              searchResults.length > 0 &&
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
    </Container>
  );
}

export default SearchResults;
