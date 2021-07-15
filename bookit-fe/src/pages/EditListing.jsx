import React from 'react';
// import PlaceholderImage from '../assets/mountaindawn.png';
import { StoreContext } from '../utils/store';
import Navbar from '../components/Navbar';
import {
  useHistory,
  useLocation,
  Redirect,
} from 'react-router-dom';
import {
  makeStyles,
  Container,
  Button,
  Box,
  Tooltip,
  TextField,
  CircularProgress,
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
    // margin: '20px',
    paddingBottom: '20px',
    justifyContent: 'center',
    // maxHeight: '128px',
    // maxWidth: '128px',
    width: '100%',
  },
  img: {
    maxHeight: '128px',
    maxWidth: '128px',
  },
}));

// The EditListing page allows a user to create a new listing.
const EditListing = () => {
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
  const location = useLocation();
  // the givenId refers to the selected listing Id as a parameter in the URL
  const givenId = location.state.givenId;
  const prevPage = location.state.prevPage;

  // class used for the Toastify error component styling
  const toastErrorStyle = {
    backgroundColor: '#cc0000',
    opacity: 0.8,
    textAlign: 'center',
    fontSize: '18px'
  };

  const emptyVals = {
    listing_name: '',
    address: '',
    category: '',
    description: '',
  }
  // the fields state variable contains the inputs to the new Listing
  const [fields, setFields] = React.useState(emptyVals);

  // useEffect hook sets up the page
  React.useEffect(() => {
    setPage(`/listings/edit/${givenId}`);
    
    async function setupEditListing () {
      setLoadingState('loading');
      const response = await axios({
        method: 'GET',
        url: `${baseUrl}/listings/${givenId}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
      })
      const defaultVals = {
        listing_name: response.data.listing_name,
        address: response.data.address,
        category: response.data.category,
        description: response.data.description,
      }
      await setFields(defaultVals);
      setLoadingState('success');
    }
    setupEditListing()    
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
      // Send a POST request to modify the existing listing
      axios({
        method: 'PUT',
        url: `${baseUrl}/listings/${givenId}`,
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
            `Successfully modified Listing ID ${givenId}`, {
              position: 'top-right',
              hideProgressBar: true,
              style: {
                opacity: 0.8,
                textAlign: 'center',
                fontSize: '18px'
              }
            }
          );
          if (prevPage === '/mylistings') {
            history.push('/mylistings');
          } else {
            history.push({
              pathname: `/listings/${givenId}`,
              state: {
                givenId: parseInt(givenId),
              }
            });
          }
        })
        .catch((error) => {
          let errorText = '';
          error.response.data.message !== undefined
            ? errorText = error.response.data.message
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
          <div>
            <CircularProgress color="secondary" />
          </div>
        }
        {
          loadingState === 'success' &&
          <Box className={classes.containerDiv}>
            <h2>Edit Listing</h2>
            <Box>
              <p className={classes.headerText}>
                Fill in the form below to modify your Listing
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
                  Modify Listing
                </Button>
              </Tooltip>
              <Tooltip title="Cancel" aria-label="cancel">
                <Button
                  className={classes.button}
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    if (prevPage === '/mylistings') {
                      history.push('/mylistings');
                    } else {
                      history.push({
                        pathname: `/listings/${givenId}`,
                        state: {
                          givenId: parseInt(givenId),
                        }
                      });
                    }
                  }}
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

export default EditListing;
