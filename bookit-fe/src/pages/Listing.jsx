import React from 'react';
import { StoreContext } from '../utils/store';
import Navbar from '../components/Navbar';
import PlaceholderImage from '../assets/mountaindawn.png';
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
  Box,
  Typography,
  Tooltip,
  Divider,
  Link,
  ListItem,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Rating from '@material-ui/lab/Rating';
import axios from 'axios';
import styled from 'styled-components';
import { format, formatDistanceStrict } from 'date-fns';

const LocationSpan = styled.span`
  color: white;
`

// Page styling used on the EditGame page and its subcomponents
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    paddingLeft: '8px',
    paddingRight: '4px',
    marginBottom: '2px',
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
  titleBox: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    paddingBottom: '10px',
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
  newAvailButton: {
    margin: theme.spacing(1),
    width: '100%',
    justifyContent: 'center',
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
  backButton: {
    maxHeight: '38px',
  },
  listDiv: {
    paddingBottom: '4px',
  },
}));

// The EditBooking page allows a user to create or modify a booking.
const Listing = () => {
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

  const params = useParams();
  const listingId = params.id || null;

  React.useEffect(() => {
    if (token === null || listingId === null) {
      return <Redirect to={{ pathname: '/login' }} />
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // context variables used throughout the page
  const [page, setPage] = context.pageState;
  // page loading state
  const [loadingState, setLoadingState] = React.useState('idle');
  // updated ensures appropriate re-rendering upon changing or deleting a resource
  const [updated, setUpdated] = context.updates;
  const username = context.username[0];
  const [availabilities, setAvailabilities] = React.useState([]);
  const [resource, setResource] = React.useState(null);

  const [newAvailModal, setNewAvailModal] = React.useState(false);
  const handleCloseNewModal = () => {
    setNewAvailModal(false);
  };

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
        
        // setResource(response.data);
        setUpdated(!updated);

      } catch(error) {
        
        console.log(error.response);

        // setResource(null);
      }

    }
    attemptBooking();
  }

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

        console.log(response.data);

        setResource(response.data);
      } catch(error) {
        
        console.log(error.response);

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

        setAvailabilities([]);
      }

      setLoadingState('success');
    }
    setupListing();
  }, [updated]); // eslint-disable-line react-hooks/exhaustive-deps

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

              <Typography gutterBottom variant="body2" align="left">
                Owner / {' '}
                <Link
                  component={RouterLink}
                  to={`/profile/${resource.username}`}
                >
                  {resource.username}
                </Link>
              </Typography>
              <Typography gutterBottom variant="body2" align="left" color="textSecondary">
                <LocationSpan>Location /</LocationSpan> {resource.address}
              </Typography>
              <Box className={classes.box}>
                <Box className={classes.imgContainer}>
                  <img src={PlaceholderImage} alt="thumbnail" className={classes.img} />
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
                  <Typography paragraph align="left" variant="h4">
                    Availabilities
                  </Typography>
                </Box>
                {
                  // only render the new availabiliites button if user owns the listing
                  resource.username === username &&
                  <Box className={classes.outerContainerBtns}>
                    <Tooltip title="New Availability" aria-label="new availability">
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
              </Box>

              {
                availabilities.length > 0 &&
                availabilities.map((availability) => (
                  <Box key={availability.availability_id}>
                    <ListItem className={classes.root}>
                      <ListItemText
                        className={classes.listItemText}
                        primary={
                          `Start time: ${format(new Date(availability.start_time), 'dd/MM/yyyy hh:mm a')} - End time: ${format(new Date(availability.end_time), 'dd/MM/yyyy hh:mm a')} (${formatDistanceStrict(new Date(availability.start_time), new Date(availability.end_time))})`
                        }
                      />
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
                        </Box>
                      }
                      <Tooltip title="Book It" aria-label="book it">
                        <span>
                          <Button
                            variant="contained"
                            color="default"
                            className={classes.button}
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
                    </ListItem>
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
            </Box>
          </Box>
        }
      </Container>
      <br />
    </Container>
  )
}

export default Listing;
