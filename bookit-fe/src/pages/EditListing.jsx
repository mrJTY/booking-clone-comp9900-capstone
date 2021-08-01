import React from 'react';
import { StoreContext } from '../utils/store';
import Navbar from '../components/Navbar';
import ResourceCard from '../components/ResourceCard';
import { imageToBase64 } from '../utils/auxiliary';
import {
  useHistory,
  useLocation,
  useParams,
  Redirect,
} from 'react-router-dom';
import {
  makeStyles,
  Container,
  Button,
  Box,
  Tooltip,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import axios from 'axios';
import { toast } from 'react-toastify';

// Page styling used on the EditListing page and its subcomponents
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    paddingLeft: '8px',
    paddingRight: '4px',
  },
  outerContainer: {
    width: '100%',
  },
  outerContainerBtns: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  titleSubcontainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  titleHeadingDiv: {
    display: 'flex',
    justifyContent: 'flex-start',
    paddingRight: '10px',
    width: '100%',
  },
  mytitleDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: theme.spacing(1),
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
  listingFormInputDiv: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    margin: '1em 0em',
  },
  listingTextField: {

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
  categoriesFormDiv: {
    display: 'flex',
    flexDirection: 'row',
    height: '6em',
    alignItems: 'center',
    justifyContent: 'center',

  },
  categoriesForm: {
    margin: theme.spacing(1),
    width: '18em',
  },
  categoriesFormSelect: {
    textAlign: 'left',
    paddingLeft: '4px',
  },
  divider: {
    margin: '20px 0px',
    height: '2px',
  },
  editListingContentDiv: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',

  },
  resourceCardDiv: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  listingFormDiv: {
    flex: 1,

  },
  uploadBtnInput: {
    display: 'none',
  },
  uploadBtnDiv: {
    display: 'flex',
    alignItems: 'center',
    margin: '1em 0em',
  },
  uploadFileDiv: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginRight: '0.5em',
  },
  uploadFileInputDiv: {
    marginRight: '0.5em',
    // width: '100%',
  },
  uploadFileTextDiv: {
    width: '100%',
    // marginTop: '0.5em'
  },
  clearUploadBtnDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  clearUploadBtn: {
    padding: 0,
    // marginBottom: '0.5em',
  },
}));

// class used for the Toastify error component styling
const toastErrorStyle = {
  backgroundColor: '#cc0000',
  opacity: 0.8,
  textAlign: 'center',
  fontSize: '18px'
};
// default values for the input fields
const emptyVals = {
  listing_name: '',
  address: '',
  category: '',
  description: '',
}
// default values for the dummy resource card
const emptyValsResourceCard = {
  listing_id: 0,
  listing_name: '',
  address: '',
  category: '',
  description: '',
  username: '',
}

// The EditListing page allows a user to create a new Listing or
// modify an existing Listing. They are presented with a UI consisting of a 
// replica Resource Card component, which dynamically updates as they enter
// their desired details and optionally upload a new listing image.
const EditListing = () => {
  // state variables
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const history = useHistory();
  const primaryUsername = context.username[0];
  // redirect to login screen if user not logged in
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
  const params = useParams();
  // checks whether the listing is new or existing through the parameter
  const isNewListing = Boolean(Number(Object.keys(params).length) === 0);
  // the previous page is defaulted to the mylistings page, which is the
  // destination upon clicking the confirm button. Otherwise, the user is
  // redirected to the individual Listing page.
  let prevPage = '/mylistings';
  if (!isNewListing && Object.keys(location.state).length > 0 &&
      location.state?.prevPage)
  {
    prevPage = location.state.prevPage;
  }
  // the fields state variable contains the inputs to the new Listing
  const [fields, setFields] = React.useState(emptyVals);
  // populates the mock resource card
  const [resourceFields, setResourceFields] = React.useState(emptyValsResourceCard);
  const [originalListingImage, setOriginalListingImage] = React.useState(null);
  // useEffect hook sets up the page, populating the input fields & resource
  // card with either dummy data or existing data
  React.useEffect(() => {
    if (isNewListing) {
      setPage('/listings/create');
    } else {
      setPage(`/listings/edit/${params.id}`);
    }
    async function setupEditListing () {
      setLoadingState('loading');
      if (isNewListing) {
        await setResourceFields(
          resourceFields => ({
            ...resourceFields,
            username: `${primaryUsername}`,
          })
        );
      } else {
        try {
          const response = await axios({
            method: 'GET',
            url: `${baseUrl}/listings/${params.id}`,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `JWT ${token}`,
            },
          })
          setOriginalListingImage(response.data.listing_image);
          const defaultVals = {
            listing_name: response.data.listing_name,
            address: response.data.address,
            category: response.data.category,
            description: response.data.description,
          }
          await setFields(defaultVals);
          const defaultValsResourceCard = {
            listing_id: response.data.listing_id,
            listing_name: response.data.listing_name,
            address: response.data.address,
            category: response.data.category,
            description: response.data.description,
            username: response.data.username,
            listing_image: response.data.listing_image,
          }
          await setResourceFields(defaultValsResourceCard);        
        } catch(error) {
          console.log(error.response)
          let errorText = '';
          if (error.response.data.error !== undefined) {
            errorText = error.response.data.error;
          } else if (error.response.data.message !== undefined) {
            errorText = error.response.data.message;
          } else {
            errorText = 'Invalid input';
          }
          toast.error(
            errorText, {
              position: 'top-right',
              hideProgressBar: true,
              style: toastErrorStyle
            }
          );
        }
      }
      setLoadingState('success');
    }
    setupEditListing();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // onChange updates the state upon a user's keypress
  const onChange = (setFunc, field, val) => {
    setFunc(
      state => ({
        ...state,
        [field]: val
      })
    );
    // dynamically updates the resource card upon key press
    setResourceFields(
      state => ({
        ...state,
        [field]: val
      })
    );
  }
  // image upload state variables
  const [listingImageBase64, setListingImageBase64] = React.useState(null);
  const [listingImageFilename, setListingImageFilename] = React.useState('');
  // calls upon the imageToBase64 function from the auxiliary functions
  // to convert the selected image to base64 and set the filename as such
  const updateListingImageFile = async (e) => {
    await setListingImageFilename(e.target.files[0]?.name || '');
    await imageToBase64(e.target.files[0], setListingImageBase64);
  };
  // clears the currently uploaded image
  const handleUploadClear = async () => {
    await setListingImageFilename('');
    await setListingImageBase64(null);
  }
  // dynamically updates the resource card preview image upon clicking upload
  React.useEffect(() => {
    async function listingImagePreviewChange () {
      if (listingImageBase64 !== null) {
        await setResourceFields(
          resourceFields => ({
            ...resourceFields,
            listing_image: listingImageBase64
          })
        );
        await setFields(
          fields => ({
            ...fields,
            listing_image: `${listingImageBase64}`,
          })
        );
      } else {
        await delete fields['listing_image'];
        if (!isNewListing) {
          await setResourceFields(
            resourceFields => ({
              ...resourceFields,
              listing_image: originalListingImage
            })
          );
        } else {
          await setResourceFields(
            resourceFields => ({
              ...resourceFields,
              listing_image: listingImageBase64
            })
          );
        }
      }
    }
    listingImagePreviewChange();
  }, [listingImageBase64]); // eslint-disable-line react-hooks/exhaustive-deps
  // validates the New Listing input fields & sends a POST API request
  // upon a valid listing submission, creating a new Listing.
  const handleSubmit = () => {
    if (listingImageBase64 === null) {
      delete fields['listing_image'];
    }
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
      const reqMethod = isNewListing === true
        ? 'POST'
        : 'PUT'
      const reqUrl = isNewListing === true
        ? `${baseUrl}/listings`
        : `${baseUrl}/listings/${params.id}`
      axios({
        method: reqMethod,
        url: reqUrl,
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          "Authorization": `JWT ${token}`,
        },
        data: fields,
      })
        .then(() => {
          const successMsg = isNewListing === true
            ? 'Successfully created a new Listing'
            : `Successfully modified Listing ID ${params.id}`
          // notify user listing creation was successful
          toast.success(
            successMsg, {
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
            // redirect back to mylistings page
            history.push('/mylistings');
          } else {
            history.push({
              pathname: `/listings/${params.id}`,
              state: {
                givenListingId: parseInt(params.id),
              }
            });
          }
        })
        .catch((error) => {
          let errorText = '';
          if (error.response.data.error !== undefined) {
            errorText = error.response.data.error;
          } else if (error.response.data.message !== undefined) {
            errorText = error.response.data.message;
          } else {
            errorText = 'Invalid input';
          }
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
    <Container className={classes.outerContainer}>
      <Navbar page={page} />
      <Container className={classes.container}>
        {
          loadingState !== 'success' &&
          <div>
            <CircularProgress color="secondary" />
          </div>
        }
        {
          loadingState === 'success' &&
          <Box className={classes.containerDiv}>
            <Box className={classes.mytitleDiv}>
              <Box className={classes.titleSubcontainer}>
                <Box className={classes.titleHeadingDiv}>
                  <Typography gutterBottom component={'span'} variant="h4" align="center" color="textPrimary">
                    {
                      isNewListing
                        ? 'Create New Listing'
                        : 'Modify Listing'
                    }
                  </Typography>
                </Box>
                <Box className={classes.outerContainerBtns}>
                  <Tooltip
                    title={
                      isNewListing === true
                        ? 'Create Listing'
                        : 'Modify Listing'
                    }
                  >
                    <Button
                      id="submit-listing"
                      variant="contained"
                      // type="submit"
                      color="primary"
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      {
                        isNewListing === true
                          ? 'Create Listing'
                          : 'Modify Listing'
                      }
                    </Button>
                  </Tooltip>
                  <Tooltip title="Cancel" aria-label="cancel">
                    <Button
                      className={classes.button}
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        if (prevPage === '/mylistings') {
                          // redirect back to mylistings page
                          history.push('/mylistings');
                        } else {
                          history.push({
                            pathname: `/listings/${params.id}`,
                            state: {
                              givenListingId: parseInt(params.id),
                            }
                          });
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
              <Divider light className={classes.divider} />
              <Box className={classes.editListingContentDiv}>
                <Box className={classes.resourceCardDiv}>
                  <ResourceCard
                    resource={resourceFields}
                    owner={primaryUsername}
                    parentPage={'/listings/edit'}
                  />
                </Box>
                <Box className={classes.listingFormDiv}>
                  <Box className={classes.listingFormInputDiv}>
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
                  </Box>
                  <Box className={classes.listingFormInputDiv}>
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
                  </Box>
                  <Box className={classes.listingFormInputDiv}>
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
                  </Box>
                  <Box className={classes.categoriesFormDiv}>
                    <FormControl required className={classes.categoriesForm}>
                      <InputLabel id="listing-category-label">
                        Listing Category
                      </InputLabel>
                      <Select
                        labelId="listing-category-select-label"
                        id="listing-category"
                        label="Category"
                        value={fields.category}
                        onChange={
                          e => onChange(setFields, 'category', e.target.value)
                        }
                        className={classes.categoriesFormSelect}
                      >
                        <MenuItem aria-label="None" value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={'entertainment'}>Entertainment</MenuItem>
                        <MenuItem value={'sport'}>Sport</MenuItem>
                        <MenuItem value={'accommodation'}>Accommodation</MenuItem>
                        <MenuItem value={'healthcare'}>Healthcare</MenuItem>                    
                        <MenuItem value={'other'}>Other</MenuItem>
                      </Select>
                      <FormHelperText>Required</FormHelperText>
                    </FormControl>
                  </Box>
                  <Box className={classes.uploadBtnDiv}>
                    <Box className={classes.uploadFileDiv}>
                      <Box className={classes.uploadFileInputDiv}>
                        {/* Upload Button Boilerplate */}                          
                        {/* https://material-ui.com/components/buttons/ */}
                        <input
                          accept="image/*"
                          className={classes.uploadBtnInput}
                          id="upload-btn-html"
                          type="file"
                          onChange={updateListingImageFile}
                        />
                        <Tooltip title="Upload Image">
                          <label htmlFor="upload-btn-html">
                            <Button
                              variant="contained"
                              color="primary"
                              component="span"
                            >
                              Upload
                            </Button>
                          </label>
                        </Tooltip>
                      </Box>
                      <Box className={classes.uploadFileTextDiv}>
                        <TextField
                          variant="outlined"
                          inputProps={{
                            readOnly: true
                          }}
                          value={listingImageFilename}
                          multiline
                          fullWidth
                          label="Filename"
                          InputProps={{
                            endAdornment:
                            <InputAdornment position="end">
                              <Box className={classes.clearUploadBtnDiv}>
                                <Tooltip title={'Clear Upload'}>
                                  <IconButton
                                    size="medium"
                                    color="default"
                                    className={classes.clearUploadBtn}
                                    onClick={() => {
                                      handleUploadClear();
                                    }}
                                  >
                                    <ClearIcon className={classes.clearUploadIcon} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </InputAdornment>,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        }
      </Container>
    </Container>
  )
}

export default EditListing;
