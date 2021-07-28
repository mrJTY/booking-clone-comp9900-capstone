import React from 'react';
import { StoreContext } from '../utils/store';
import CustomButton from './CustomButton';
import PlaceholderImage from '../assets/mountaindawn.png';
import DeleteDialog from './DeleteDialog';
import BookingDialog from './BookingDialog';
import RatingDialog from './RatingDialog';
import {
  useHistory,
} from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import {
  makeStyles,
  Box,
  Typography,
  Link,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import ArrowRight from '@material-ui/icons/ArrowRight';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import RateReviewIcon from '@material-ui/icons/RateReview';
import StarRateIcon from '@material-ui/icons/StarRate';
import { format, formatDistanceStrict } from 'date-fns';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import axios from 'axios';


const ListSpan = styled.span`
  color: white;
`

const useStyles = makeStyles((theme) => ({
  listRoot: {
    flexGrow: 1,
    listStyleType: 'none',
    padding: 0,
  },  
  button: {
    margin: theme.spacing(1),
  },
  listImage: {
    maxHeight: '64px',
    maxWidth: '64px',
    margin: 'auto',
  },
  listItemText: {
    maxWidth: '36em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: "-webkit-box",
    "-webkit-line-clamp": 1,
    "-webkit-box-orient": "vertical",
  },
  bookingRatingDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingStarRatingDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));


const BookingListItem = ({ booking, upcoming }) => {
  const history = useHistory();
  const classes = useStyles();
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const baseUrl = context.baseUrl;

  // console.log(booking)

  // used for the delete dialog
  const [openDelete, setOpenDelete] = React.useState(false);
  // determines which booking in particular to delete
  const [deleteBookingId, setDeleteBookingId] = React.useState(null);
  // state variables used for the DeleteDialog modal
  const handleClickOpenDelete = (id) => {
    setDeleteBookingId(id);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };


  // used for the delete review dialog
  const [openDeleteReview, setOpenDeleteReview] = React.useState(false);
  const [deleteReviewId, setDeleteReviewId] = React.useState(null);
  // state variables used for the DeleteDialog modal
  const handleClickOpenDeleteReview = (id) => {
    setDeleteReviewId(id);
    setOpenDeleteReview(true);
  };
  const handleCloseDeleteReview = () => {
    setOpenDeleteReview(false);
  };


  const [bookingModal, setBookingModal] = React.useState(false);
  const handleCloseModal = () => {
    setBookingModal(false);
  };
  // determines which booking in particular to modify
  const [modifyBookingId, setModifyBookingId] = React.useState(null);
  // determines which associated listing of a particular booking to modify
  const [modifyBookingListingId, setModifyBookingListingId] = React.useState(null);
  // determines which associated availability of a particular booking to modify
  const setModifyBookingAvailId = context.modifyBookingAvailId[1];

  const [availabilities, setAvailabilities] = React.useState([]);
  const [currentAvail, setCurrentAvail] = React.useState({});

  const [ratingId, setRatingId] = React.useState(null);
  const [ratingStars, setRatingStars] = React.useState(null);
  const [ratingComment, setRatingComment] = React.useState('');

  const [ratingDialog, setRatingDialog] = React.useState(false);
  const handleCloseRatingDialog = () => {
    setRatingDialog(false);
  };

  const handleClickReview = async (bookingId, ratingId, ratingStars, ratingComment) => {
    await setModifyBookingId(bookingId);
    await setRatingId(ratingId);
    await setRatingStars(ratingStars);
    await setRatingComment(ratingComment);

    setRatingDialog(true);
  }

  const handleClickModfyBooking = async (bookingId, listingId, availId) => {
    setModifyBookingAvailId(availId);

    setModifyBookingId(bookingId);
    setModifyBookingListingId(listingId);

    async function setupBookingDialog () {
      try {
        const response = await axios({
          method: 'GET',
          url: `${baseUrl}/availabilities/${availId}`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": `JWT ${token}`,
          },
        })

        // console.log('current avail response is:')
        // console.log(response.data)

        await setCurrentAvail(response.data);

      } catch(error) {
        
        console.log(error.response);

        await setCurrentAvail({});
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

        await setAvailabilities([]);
      }

    }
    await setupBookingDialog();
    setBookingModal(true);
  }

  return (
    <div>
      <List className={classes.listRoot}>
        <ListItem disableGutters divider>
          <ListItemAvatar>
            <Avatar className={classes.listImage} src={PlaceholderImage} alt="Placeholder" />
          </ListItemAvatar>
          <ListItemText
            disableTypography
            primary={
              <div>
                <div className={classes.listItemText}>
                  <Typography component={'span'} variant="body2" align="left" color="textSecondary">
                    <ListSpan>Listing /</ListSpan> {`${booking.listing_name}`}
                  </Typography>
                </div>
                <div className={classes.listItemText}>
                  <Typography component={'span'} variant="body2" align="left" color="textSecondary">
                    <ListSpan>Owner /</ListSpan> {' '}
                    <Tooltip
                      title={`View ${booking.username}'s profile`}
                      placement="bottom-start"
                    >
                      <Link
                        component={RouterLink}
                        to={`/profile/${booking.username}`}
                      >
                        {booking.username}
                      </Link>
                    </Tooltip>
                  </Typography>
                </div>                            
              </div>
            }
            secondary={
              <div className={classes.listItemText}>
                <Typography component={'span'} variant="body2" align="left" color="textSecondary">
                  <ListSpan>Booking /</ListSpan> {`From: ${format(new Date(booking.start_time), 'dd/MM/yyyy hh:mm a')} | Until: ${format(new Date(booking.end_time), 'dd/MM/yyyy hh:mm a')} (${formatDistanceStrict(new Date(booking.start_time), new Date(booking.end_time))})`}
                </Typography>
              </div>
            }
          />
          <ListItemSecondaryAction>
            {
              upcoming === true &&
              <Box>
                <Tooltip title={'Change Booking'} aria-label={'edit booking'}>
                  <IconButton
                    id={'booking-edit-button'}
                    color={'primary'}
                    className={classes.button}
                    onClick={() => {
                      handleClickModfyBooking(
                        booking.booking_id,
                        parseInt(booking.listing_id),
                        parseInt(booking.availability_id)
                      )
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={'Delete Booking'} aria-label={'delete booking'}>
                  <IconButton
                    id={'booking-delete-button'}
                    color={'secondary'}
                    className={classes.button}
                    onClick={() => {
                      handleClickOpenDelete(booking.booking_id)
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <CustomButton
                  title={'View Listing'}
                  ariaLabel={'listing'}
                  id={'booking-view-listing-button'}
                  variant={'contained'}
                  color={'primary'}
                  className={classes.button}
                  endIcon={<ArrowRight />}
                  onClick={() => {
                    history.push({
                      pathname: `/listings/${booking.listing_id}`,
                      state: {
                        givenListingId: parseInt(booking.listing_id),
                      }
                    })
                  }}
                />
              </Box>
            }
            {
              upcoming === false &&
              <Box className={classes.bookingRatingDiv}>
                <Box className={classes.bookingStarRatingDiv}>
                  <Typography component={'span'} variant="subtitle2" align="left" color="textPrimary">
                    {booking.rating === null ? 'Not rated' : `Rating: ${booking.rating}`}
                  </Typography>
                  <StarRateIcon />
                </Box>
                {
                  booking.rating === null &&
                  <CustomButton
                    title='Add Review'
                    ariaLabel={'review'}
                    id={'booking-review-button'}
                    variant={'outlined'}
                    color={'default'}
                    className={classes.button}
                    endIcon={<RateReviewIcon />}
                    onClick={() => {
                      handleClickReview(
                        booking.booking_id,
                        booking.rating_id,
                        booking.rating,
                        booking.comment,
                      );
                    }}
                  />
                }
                {
                  booking.rating !== null &&
                  <Box className={classes.button}>
                    <Tooltip title={'Change Review'} aria-label={'edit review'}>
                      <IconButton
                        id={'booking-review-edit-button'}
                        color={'primary'}
                        // className={classes.button}
                        onClick={() => {
                          handleClickReview(
                            booking.booking_id,
                            booking.rating_id,
                            booking.rating,
                            booking.comment,
                          );
                        }}
                      >
                        <RateReviewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={'Delete Review'} aria-label={'delete review'}>
                      <IconButton
                        id={'booking-review-delete-button'}
                        color={'secondary'}
                        // className={classes.button}
                        onClick={() => {
                          handleClickOpenDeleteReview(
                            booking.rating_id,
                          );
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
                <CustomButton
                  title={'Listing'}
                  ariaLabel={'listing'}
                  id={'booking-view-listing-button'}
                  variant={'contained'}
                  color={'primary'}
                  className={classes.button}
                  endIcon={<ArrowRight />}
                  onClick={() => {
                    history.push({
                      pathname: `/listings/${booking.listing_id}`,
                      state: {
                        givenListingId: parseInt(booking.listing_id),
                      }
                    })
                  }}
                />
            </Box>
            }
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <BookingDialog
        bookingDialog={bookingModal}
        handleCloseModal={handleCloseModal}
        listingId={parseInt(modifyBookingListingId)}
        bookingId={modifyBookingId}
        currentAvail={currentAvail}
        availabilities={availabilities}
      />
      <RatingDialog
        ratingDialog={ratingDialog}
        handleCloseRatingDialog={handleCloseRatingDialog}
        bookingId={modifyBookingId}
        ratingId={ratingId}
        ratingStars={ratingStars}
        ratingComment={ratingComment}
      />
      <DeleteDialog
        open={openDelete}
        handleClose={handleCloseDelete}
        deleteUuid={deleteBookingId}
        page={`/mybookings`}
        item="Booking"
      />
      <DeleteDialog
        open={openDeleteReview}
        handleClose={handleCloseDeleteReview}
        deleteId={deleteReviewId}
        page={`/mybookings`}
        item="Review"
      />
    </div>
  )
}

BookingListItem.propTypes = {
  booking: PropTypes.object.isRequired,
  upcoming: PropTypes.bool.isRequired,
};

export default BookingListItem;
