import React from 'react';
import { StoreContext } from '../utils/store';
import CustomButton from './CustomButton';
import PlaceholderImage from '../assets/mountaindawn.png';
import DeleteDialog from './DeleteDialog';
import BookingDialog from './BookingDialog';
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
            primary={
              <div>
                <div>
                  <Typography component={'span'} variant="body2" align="left" color="textSecondary">
                    <ListSpan>Listing /</ListSpan> {`${booking.listing_name}`}
                  </Typography>
                </div>
                <div>
                  <Typography component={'span'} variant="body2" align="left" color="textSecondary">
                    <ListSpan>Owner /</ListSpan> {' '}
                    <Link
                      component={RouterLink}
                      to={`/profile/${booking.username}`}
                    >
                      {booking.username}
                    </Link>
                  </Typography>
                </div>                            
              </div>
            }
            secondary={
              <div>
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
              <Box>
                <CustomButton
                  title={'Review'}
                  ariaLabel={'review'}
                  id={'booking-review-button'}
                  variant={'outlined'}
                  color={'default'}
                  className={classes.button}
                  endIcon={<RateReviewIcon />}
                  onClick={() => {
                    // history.push({
                    //   pathname: `/listings/${booking.listing_id}`,
                    //   state: {
                    //     givenListingId: parseInt(booking.listing_id),
                    //   }
                    // })
                    console.log('Clicked Review')
                  }}
                />
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
      <DeleteDialog
        open={openDelete} handleClose={handleCloseDelete}
        deleteUuid={deleteBookingId}
        page={`/mybookings`}
        item="Booking"
      />
    </div>
  )
}

BookingListItem.propTypes = {
  booking: PropTypes.object.isRequired,
  upcoming: PropTypes.bool.isRequired,
};

export default BookingListItem;
