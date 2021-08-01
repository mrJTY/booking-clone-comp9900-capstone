import React from 'react';
import { StoreContext } from '../utils/store';
import Navbar from '../components/Navbar';
import { fetchAuthMe } from '../utils/auxiliary';
import CustomButton from '../components/CustomButton';
import DeleteDialog from '../components/DeleteDialog';
import ModalAvailability from '../components/ModalAvailability';
import {
  useHistory,
  Redirect,
  useParams,
} from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import {
  makeStyles,
  Container,
  CircularProgress,
  Button,
  ButtonGroup,
  Box,
  Typography,
  Tooltip,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Rating from '@material-ui/lab/Rating';
import axios from 'axios';
import styled from 'styled-components';
import { format, formatDistanceStrict } from 'date-fns';
import { toast } from 'react-toastify';

const LocationSpan = styled.span`
  color: white;
`

// Page styling used on the Listing page and its subcomponents
const useStyles = makeStyles((theme) => ({
  outerContainer: {
    width: '100%',
  },
  outerContainerBtns: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  outerContainerBookedHrs: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: '2em',
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
  containerDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    alignContent: 'flex-start',
    width: '100%',
  },
  titleSubcontainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  titleHeadingDiv: {
    paddingRight: '10px',
  },
  mytitleDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: theme.spacing(1),
  },
  box: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-start',
  },
  resourceTitleDiv: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resourceAvgRating: {
    display: 'flex',
    paddingRight: '8px',
    paddingBottom: '4px',
    alignContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing(1),
  },
  buttonBookit: {
    margin: theme.spacing(1),
    width: '10em',
  },
  buttonText: {
    textTransform: 'none',
    fontSize: '16px',
  },
  imgContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: '20px',
    justifyContent: 'flex-start',
    width: '256px',
    height: '256px',
    maxHeight: '256px',
    maxWidth: '256px',
    paddingRight: '20px',
  },
  img: {
    maxHeight: '256px',
    maxWidth: '256px',
    minHeight: '128px',
    minWidth: '128px',
  },
  listRootAvail: {
    flexGrow: 1,
    listStyleType: 'none',
    padding: 0,
    paddingLeft: '1em',
    paddingRight: '1em',
  },
  listItemText: {
    maxWidth: '36em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: "-webkit-box",
    "-webkit-line-clamp": 1,
    "-webkit-box-orient": "vertical",
  },
  listItemReviewDiv: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemTextReviewDiv: {
    maxWidth: '52em',
    width: '100%',
    margin: theme.spacing(1),
  },
  divider: {
    margin: '1em 0em',
    height: '2px',
  },
  availNotFoundDiv: {
    margin: '2em 0em',
  },
}));

// class used for the Toastify error component styling
const toastErrorStyle = {
  backgroundColor: '#cc0000',
  opacity: 0.8,
  textAlign: 'center',
  fontSize: '18px'
};

// The Listing page allows a user to view a Listing, its availabilities & reviews.
// If the primary user owns the Listings, they are also able to edit/delete the
// Listing, or add a new availability. The ability to view availabilities or reviews
// is managed through the current state object pertaining to the respective button.
// Information regarding a Listing that may be found on the page includes:
// Listing owner, location, name, description, average rating, availabilities,
// and associated reviews. The primary user may also see their remaining booking
// hours for the month, if the Listing is not owned by them.
const Listing = () => {
  // state variables
  const context = React.useContext(StoreContext);
  const baseUrl = context.baseUrl;
  const token = context.token[0];
  const history = useHistory();
  // used for the delete dialog
  const [open, setOpen] = React.useState(false);
  // determines which availability in particular to delete
  const [deleteAvailId, setDeleteAvailId] = React.useState(null);
  // state variables used for the DeleteDialog modal
  const handleClickOpen = (id) => {
    setDeleteAvailId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // get the Listing ID from the URL parameter id
  const params = useParams();
  const listingId = params.id || null;
  // if not logged in, redirect to login screen
  React.useEffect(() => {
    if (token === null || listingId === null) {
      return <Redirect to={{ pathname: '/login' }} />
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // context variables used throughout the page
  const [page, setPage] = context.pageState;
  // page loading state
  const [loadingState, setLoadingState] = React.useState('idle');
  // availabilities vs reviews state management
  const [showAvailBtn, setShowAvailBtn] = React.useState(true);
  // show the remaining booking hours
  const [bookedHrs, setBookedHrs] = context.bookedHrs;
  // stores listing owner user data
  const [userProfile, setUserProfile] = React.useState(null);
  // updated ensures appropriate re-rendering upon changing or deleting a resource
  const [updated, setUpdated] = context.updates;
  const username = context.username[0];
  const [availabilities, setAvailabilities] = React.useState([]);
  const [resource, setResource] = React.useState(null);
  // handles the opening of the new availability modal, if owned by primary user
  const [newAvailModal, setNewAvailModal] = React.useState(false);
  const handleCloseNewModal = () => {
    setNewAvailModal(false);
  };
  // handles the opening of a modal that changes a particular availability
  const [availModal, setAvailModal] = React.useState(false);
  const handleCloseModal = () => {
    setAvailModal(false);
  };
  // determines which availability in particular to modify
  const [modifyAvailId, setModifyAvailId] = React.useState(null);
  const handleClickModfyAvail = (id) => {
    setModifyAvailId(id);
    setAvailModal(true);
  }
  // called upon clicking the book it button on a particular availability
  // sends a POST API request which checks whether the user has enough
  // booking hours remaining for the current month, along with updating the
  // booked out state upon a successful booking.
  const handleClickBookIt = (availId) => {
    async function attemptBooking () {
      try {
        const response = await axios({
          method: 'POST',
          url: `${baseUrl}/bookings`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": `JWT ${token}`,
          },
          data: {
            "listing_id": listingId,
            "availability_id": availId
          }
        })
        console.log(response.data);
        const successMsg = `Successfully Booked Availability ID: ${availId}`;
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
        setUpdated(!updated);
      } catch(error) {
        console.log(error.response);
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
    attemptBooking();
  }
  // use effect hook which sets up the Listing page, populating it with all
  // of above mentioned information
  React.useEffect(() => {
    setLoadingState('loading');
    setPage(`/listings/${listingId}`);
    async function setupListing () {
      try {
        const response = await axios({
          method: 'GET',
          url: `${baseUrl}/listings/${listingId}`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": `JWT ${token}`,
          },
        })
        setResource(response.data);
      } catch (error) {
        console.log(error.response);
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
        setResource(null);
      }
      try {
        const response = await axios({
          method: 'GET',
          url: `${baseUrl}/availabilities?listing_id=${listingId}`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": `JWT ${token}`,
          },
        })
        await setAvailabilities(response.data.availabilities);
      } catch(error) {
        console.log(error.response);
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
        setAvailabilities([]);
      }
      await fetchAuthMe(baseUrl, token, setUserProfile);
      setLoadingState('success');
    }
    setupListing();
  }, [updated]); // eslint-disable-line react-hooks/exhaustive-deps
  // sets up the remaining booking hours, and updated upon clicking book it
  React.useEffect(() => {
    async function setupBookedHrs () {
      if (userProfile !== null ) {
        await setBookedHrs(10 - parseInt(userProfile.hours_booked));
      }
    }
    setupBookedHrs();
  }, [userProfile]); // eslint-disable-line react-hooks/exhaustive-deps
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
          resource !== null &&
          <Box className={classes.containerDiv}>
            <Box className={classes.mytitleDiv}>
              <Box className={classes.titleSubcontainer}>
                <Box className={classes.titleHeadingDiv}>
                  <Typography paragraph align="left" variant="h4">
                    Listing
                  </Typography>
                </Box>
                {
                  // only render the edit/delete buttons if user owns the listing
                  resource.username === username &&
                  <Box className={classes.outerContainerBtns}>
                    <CustomButton
                      title={'Edit'}
                      ariaLabel={'edit'}
                      id={'resource-card-edit-button'}
                      variant={'outlined'}
                      color={'primary'}
                      className={classes.button}
                      startIcon={<EditIcon />}
                      onClick={() => {
                        history.push({
                          pathname: `/listings/edit/${listingId}`,
                          state: {
                            givenListingId: parseInt(listingId),
                            prevPage: `/listings/${listingId}`,
                          }
                        })
                      }}
                    />
                    <CustomButton
                      title={'Delete'}
                      ariaLabel={'delete'}
                      id={'resource-card-delete-button'}
                      variant={'outlined'}
                      color={'secondary'}
                      className={classes.button}
                      startIcon={<DeleteIcon />}
                      onClick={() => handleClickOpen(listingId)}
                    />

                    <DeleteDialog
                      open={open} handleClose={handleClose}
                      deleteId={parseInt(listingId)}
                      page={`/listings/${listingId}`}
                      item="Listing"
                    />
                  </Box>
                }
              </Box>
              <Divider light className={classes.divider} />
              <Typography gutterBottom variant="body2" align="left">
                Owner / {' '}
                <Tooltip
                  title={`View ${resource.username}'s profile`}
                  placement="bottom-start"
                >
                  <Link
                    component={RouterLink}
                    to={`/profile/${resource.username}`}
                  >
                    {resource.username}
                  </Link>
                </Tooltip>
              </Typography>
              <Typography gutterBottom variant="body2" align="left" color="textSecondary">
                <LocationSpan>Location /</LocationSpan> {resource.address}
              </Typography>
              <Box className={classes.box}>
                <Box className={classes.imgContainer}>
                  <img src={resource.listing_image} alt="thumbnail" className={classes.img} />
                </Box>
                <Box className={classes.outerContainer}>
                  <Box className={classes.resourceTitleDiv}>
                    <Typography gutterBottom variant="h5" align="left">
                      {resource.listing_name}
                    </Typography>
                    <Tooltip title={`Average rating: ${resource.avg_rating}`} placement="top" >
                      <div className={classes.resourceAvgRating}>
                        <Rating name="avg-rating" defaultValue={resource.avg_rating} precision={0.1} readOnly />
                      </div>
                    </Tooltip>
                  </Box>
                  <Typography paragraph align="left" variant="body2" color="textSecondary" component="p">
                    {resource.description}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider light={true}/>
            <Box className={classes.mytitleDiv}>
              <Box className={classes.titleSubcontainer}>
                <Box className={classes.titleHeadingDiv}>
                  <ButtonGroup
                    variant="text"
                    color="primary"
                  >
                    <Tooltip title="Show Availabilities" placement="top">
                      <Button
                        id="show-availabilities-button"
                        variant="text"
                        color={showAvailBtn === true ? "default" : "primary"}
                        className={classes.buttonText}
                        onClick={() => {
                          setShowAvailBtn(true);
                        }}
                      >
                        Availabilities
                      </Button>
                    </Tooltip>
                    <Tooltip title="Show Reviews" placement="top">
                      <Button
                        id="show-reviews-button"
                        variant="text"
                        color={showAvailBtn === true ? "primary" : "default"}
                        className={classes.buttonText}
                        onClick={() => {
                          setShowAvailBtn(false);
                        }}
                      >
                        Reviews
                      </Button>
                    </Tooltip>
                  </ButtonGroup>

                </Box>
                {
                  // only render the new availabiliites button if user owns the listing
                  showAvailBtn === true &&
                  resource.username === username &&
                  <Box className={classes.outerContainerBtns}>
                    <Tooltip title="Create New Availability" aria-label="new availability">
                      <Button
                        id="new-availability-button"
                        variant="contained"
                        color="primary"
                        endIcon={<Add />}
                        className={classes.button}
                        onClick={() => {
                          setNewAvailModal(true)
                        }}
                      >
                        New Availability
                      </Button>
                    </Tooltip>
                    <ModalAvailability
                      availModal={newAvailModal}
                      handleCloseModal={handleCloseNewModal}
                      givenListingId={listingId}
                      newAvail={true}
                    />
                  </Box>
                }
                {
                  showAvailBtn === true &&
                  <Box className={classes.outerContainerBookedHrs}>
                    <Typography align="center" variant="subtitle1" color="textPrimary">
                      {`Remaining Monthly Booking hours: ${bookedHrs}`}
                    </Typography>
                  </Box>
                }
              </Box>
              {/* renders all the availabilities for the listing */}
              {
                showAvailBtn === true &&
                availabilities.length > 0 &&
                availabilities.map((availability) => (
                  <Box key={availability.availability_id}>
                    <List className={classes.listRootAvail}>
                      <ListItem disableGutters divider>
                        <ListItemText
                          disableTypography
                          primary={
                            <div>
                              <div className={classes.listItemText}>
                                <Typography component={'span'} variant="body2" align="left" color="textSecondary">
                                  <LocationSpan>Start time: </LocationSpan>
                                  {`${format(new Date(availability.start_time), 'dd/MM/yyyy hh:mm a')}  `}
                                </Typography>
                              </div>
                              <div className={classes.listItemText}>
                                <Typography component={'span'} variant="body2" align="left" color="textSecondary">
                                  <LocationSpan>{'/ '} End time: </LocationSpan>
                                  {`${format(new Date(availability.end_time), 'dd/MM/yyyy hh:mm a')}`}
                                  <LocationSpan>
                                    {` (${formatDistanceStrict(new Date(availability.start_time), new Date(availability.end_time))})`}
                                  </LocationSpan>
                                </Typography>
                              </div>
                            </div>
                          }
                        />
                        <ListItemSecondaryAction>
                        {
                          resource.username === username &&
                          <Box>
                            <Tooltip title={'Edit'} aria-label={'edit'}>
                              <IconButton
                                id={'availability-edit-button'}
                                color={'primary'}
                                className={classes.button}
                                onClick={() => {
                                  handleClickModfyAvail(parseInt(availability.availability_id))
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={'Delete'} aria-label={'delete'}>
                              <IconButton
                                id={'availability-delete-button'}
                                color={'secondary'}
                                className={classes.button}
                                onClick={() => {
                                  handleClickOpen(parseInt(availability.availability_id))
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Book It" aria-label="book it">
                              <span>
                                <Button
                                  variant="contained"
                                  color="default"
                                  className={classes.buttonBookit}
                                  disabled={
                                    availability.is_available === true ? false : true
                                  }
                                  onClick={() => {
                                    handleClickBookIt(parseInt(availability.availability_id))
                                  }}
                                >
                                  {
                                    availability.is_available === true ?
                                    'Book It!' :
                                    'Booked Out'
                                  }
                                </Button>
                              </span>
                            </Tooltip>
                          </Box>
                        }
                        {
                          resource.username !== username &&
                          <Tooltip title="Book It" aria-label="book it">
                            <span>
                              <Button
                                variant="contained"
                                color="default"
                                className={classes.buttonBookit}
                                disabled={
                                  availability.is_available === true ? false : true
                                }
                                onClick={() => {
                                  handleClickBookIt(parseInt(availability.availability_id))
                                }}
                              >
                                {
                                  availability.is_available === true ?
                                  'Book It!' :
                                  'Booked Out'
                                }
                              </Button>
                            </span>
                          </Tooltip>
                        }
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                    <ModalAvailability
                      availModal={availModal}
                      handleCloseModal={handleCloseModal}
                      givenListingId={parseInt(listingId)}
                      newAvail={false}
                      availId={parseInt(modifyAvailId)}
                    />
                    <DeleteDialog
                      open={open} handleClose={handleClose}
                      deleteId={parseInt(deleteAvailId)}
                      page={`/listings/${listingId}`}
                      item="Availability"
                    />
                  </Box>
                ))
              }
              {
                showAvailBtn === true &&
                availabilities.length === 0 &&
                <Box className={classes.availNotFoundDiv}>
                  <Typography
                    component={'span'} align="center"
                    variant="body1" color="textSecondary"
                  >
                    {`This Listing has no availabilities yet.`}
                  </Typography>
                </Box>                
              }
              {/* renders all the reviews for the listing */}
              {
                showAvailBtn === false &&
                resource !== null &&
                resource.ratings.length > 0 &&
                resource.ratings.map((rating) => (
                  <Box key={rating.rating_id}>
                    <List className={classes.listRootAvail}>
                      <ListItem disableGutters>
                        <ListItemText
                          disableTypography
                          className={classes.listItemReviewDiv}
                          primary={
                            <div className={classes.listItemText}>
                              <Typography component={'span'} variant="body2" align="left" color="textSecondary">
                                <LocationSpan>Reviewer: </LocationSpan>
                                <Tooltip
                                  title={`View ${rating.username}'s profile`}
                                  placement="bottom-start"
                                >
                                  <Link
                                    component={RouterLink}
                                    to={`/profile/${rating.username}`}
                                  >
                                    {rating.username}
                                  </Link>
                                </Tooltip>
                              </Typography>
                            </div>
                          }
                          secondary={
                            <div className={classes.listItemText}>
                              <Tooltip title={`Rating: ${rating.rating}`} placement="top">
                                <div className={classes.button}>
                                  <Rating name="review-rating" defaultValue={rating.rating} precision={0.5} readOnly />
                                </div>
                              </Tooltip>
                            </div>                           
                          }
                        />
                      </ListItem>
                      <ListItem divider>
                        <ListItemText
                          disableTypography
                          primary={
                            <div className={classes.listItemTextReviewDiv}>
                              <TextField
                                variant="outlined"
                                inputProps={{
                                  readOnly: true
                                }}
                                value={rating.comment}
                                multiline
                                fullWidth
                                label="Review"
                              />
                            </div>
                          }
                        />
                      </ListItem>
                    </List>
                  </Box>
                ))
              }
              {
                showAvailBtn === false &&
                resource !== null &&
                resource.ratings.length === 0 &&
                <Box className={classes.availNotFoundDiv}>
                  <Typography
                    component={'span'} align="center"
                    variant="body1" color="textSecondary"
                  >
                    {`This Listing has no reviews yet.`}
                  </Typography>
                </Box>                
              }
            </Box>
          </Box>
        }
      </Container>
      <br />
    </Container>
  )
}

export default Listing;
