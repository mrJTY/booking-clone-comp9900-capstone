import React from 'react';
// import PlaceholderImage from '../assets/mountaindawn.png';
import { StoreContext } from '../utils/store';
import Navbar from '../components/Navbar';
import {
  useHistory,
  Redirect,
} from 'react-router-dom';
import {
  makeStyles,
  Container,
  Button,
  Box,
  Tooltip,
  TextField,
} from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';

// Page styling used on the EditGame page and its subcomponents
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    paddingLeft: '8px',
    paddingRight: '4px',
  },
  outerContainer: {
    width: '100%',
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
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    alignContent: 'flex-start',
    paddingTop: '20px',
    width: '100%',
  },
  containerDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    alignContent: 'flex-start',
    width: '100%',
  },
  subcontainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    paddingBottom: '20px',
  },
  listSubcontainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  box: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
  titleBox: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    paddingBottom: '10px',
  },
  button: {
    margin: theme.spacing(1),
  },
  listingTextDiv: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  listingTextField: {
    maxWidth: '400px',
  },
  thumbnailContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: '20px',
    justifyContent: 'center',
    width: '100%',
  },
  img: {
    maxHeight: '128px',
    maxWidth: '128px',
  },
}));

// The NewListing page allows a user to create a new listing.
const NewListing = () => {
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const history = useHistory();

  React.useEffect(() => {
    // unauthorized users are redirected to the landing page
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  const [loadingState, setLoadingState] = React.useState('idle');
  // context variables used throughout the page
  const baseUrl = context.baseUrl;
  const [page, setPage] = context.pageState;
  // class used for the Toastify error component styling
  const toastErrorStyle = {
    backgroundColor: '#cc0000',
    opacity: 0.8,
    textAlign: 'center',
    fontSize: '18px'
  };

  const defaultVals = {
    listing_name: '',
    address: '',
    category: '',
    description: '',
  }
  // the fields state variable contains the inputs to the new Listing
  const [fields, setFields] = React.useState(defaultVals);

  // useEffect hook sets up the page
  React.useEffect(() => {
    setLoadingState('loading');
    setPage('/listings/create');
    setLoadingState('success');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // onChange updates the state upon a user's keypress
  const onChange = (setFunc, field, val) => {
    setFunc(
      state => ({
        ...state,
        [field]: val
      })
    );
  }
  // validates the New Listing input fields & sends a POST API request
  // upon a valid listing submission, creating a new Listing.
  const onSubmit = (btn) => {
    btn.preventDefault();
    // ensure no empty fields are submitted
    if (fields.listing_name === '' || fields.address === '' ||
    fields.category === '' || fields.description === '') {
      toast.error(
        'A Listing cannot have empty fields', {
          position: 'top-right',
          hideProgressBar: true,
          style: toastErrorStyle
        }
      );
    } else {
      // Send a POST request to create a new listing
      axios({
        method: 'POST',
        url: `${baseUrl}/listings`,
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          "Authorization": `JWT ${token}`,
        },
        data: fields,
      })
        .then(() => {
          // notify user listing creation was successful
          toast.success(
            'Successfully created a new Listing', {
              position: 'top-right',
              hideProgressBar: true,
              style: {
                opacity: 0.8,
                textAlign: 'center',
                fontSize: '18px'
              }
            }
          );
          // redirect back to mylistings page
          history.push('/mylistings');
        })
        .catch((error) => {
          let errorText = '';
          error.response.data.error !== undefined
            ? errorText = error.response.data.error
            : errorText = 'Invalid input'
          toast.error(
            errorText, {
              position: 'top-right',
              hideProgressBar: true,
              style: toastErrorStyle
            }
          );
        })
    }
  };
  // classes used for Material UI component styling
  const classes = useStyles();
  return (
    <Container>
      <Navbar page={page} />
      <Container className={classes.container}>
        <Box className={classes.box}>
        {
          loadingState !== 'success' &&
          <Box>
            <h1>Loading New Listing screen...</h1>
          </Box>
        }
        {
          loadingState === 'success' &&
          <Box className={classes.containerDiv}>
            <h2>Create New Listing</h2>
            <Box>
              <p className={classes.headerText}>
                Fill in the form below to create a new Listing
              </p>
            </Box>
            <br />
            <br />
            <form onSubmit={onSubmit}>
              <br />
              <TextField
                id="listing-name"
                type="text"
                label="Listing Name"
                aria-label="listing name"
                className={classes.listingTextField}
                multiline
                rows={3}
                columns={50}
                fullWidth
                variant="outlined"
                defaultValue={fields.listing_name}
                onChange={
                  e => onChange(setFields, 'listing_name', e.target.value)
                }
              />
              <br />
              <br />
              <TextField
                id="listing-address"
                type="text"
                label="Address"
                aria-label="address"
                className={classes.listingTextField}
                multiline
                rows={3}
                columns={50}
                fullWidth
                variant="outlined"
                defaultValue={fields.address}
                onChange={
                  e => onChange(setFields, 'address', e.target.value)
                }
              />
              <br />
              <br />
              <TextField
                id="listing-category"
                type="text"
                label="Category"
                aria-label="category"
                className={classes.listingTextField}
                multiline
                rows={3}
                columns={50}
                fullWidth
                variant="outlined"
                defaultValue={fields.category}
                onChange={
                  e => onChange(setFields, 'category', e.target.value)
                }
              />
              <br />
              <br />
              <TextField
                id="listing-description"
                type="text"
                label="Description"
                aria-label="description"
                className={classes.listingTextField}
                multiline
                rows={3}
                columns={50}
                fullWidth
                variant="outlined"
                defaultValue={fields.description}
                onChange={
                  e => onChange(setFields, 'description', e.target.value)
                }
              />
              <br />
              <br />
              <Tooltip title="Create Listing" aria-label="create">
                <Button
                  id="submit-listing" variant="contained" type="submit"
                >
                  Create Listing
                </Button>
              </Tooltip>
              <Tooltip title="Cancel" aria-label="cancel">
                <Button
                  className={classes.button}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {history.push('/mylistings')}}
                >
                  Cancel
                </Button>
              </Tooltip>
              <br />
              <br />
            </form>
          </Box>
        }
        </Box>
      </Container>
    </Container>
  )
}

export default NewListing;
