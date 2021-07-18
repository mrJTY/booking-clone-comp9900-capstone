import React from 'react';
import { StoreContext } from '../utils/store';
import { useHistory } from 'react-router-dom';
import {
  makeStyles,
  useTheme,
  ThemeProvider,
  Box,
  Button,
  Typography,
  Divider,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Radio,
} from '@material-ui/core';
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'date-fns';
import { format, formatDistanceStrict } from 'date-fns';


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  listRoot: {
    flexGrow: 1,
    listStyleType: 'none',
    padding: 0,
    overflow: 'auto',
    maxHeight: '50%',
    maxWidth: '483px',
  },
  paperContainer: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    color: 'white',
    height: '100%',

  },
  paperBody: {
    backgroundColor: theme.palette.background.paper,
    color: 'white',
    overflow: 'scroll',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  createButton: {
    margin: theme.spacing(1),
  },
  dialogTitle: {
    paddingBottom: 0,
  },
  dialogContent: {
    width: 500,
    paddingTop: 0,
    paddingBottom: 0,
  },
  listDivider: {
    height: '1px',
    backgroundColor: '#648dae',
  },
  listRootTitle: {
    flexGrow: 1,
    listStyleType: 'none',
    padding: 0,
    overflow: 'auto',
    maxHeight: '50%',
    maxWidth: '483px',
  },  
  listItemTextTitle: {
    margin: 0,
  }
}));

// Loads a modal which allows a user to change a booking, provided
// they enter a name. They may choose to cancel/close the modal without
// the modification of a booking.
const BookingDialog = ({
  bookingDialog, handleCloseModal, listingId, bookingId, currentAvail, availabilities
}) => {
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const baseUrl = context.baseUrl;
  const [updated, setUpdate] = context.updates;
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();

  let today = new Date();
  today.setMinutes(60);
  let todayPlus = new Date(today);
  todayPlus.setMinutes(60);

  const [modifyBookingAvailId, setModifyBookingAvailId] = context.modifyBookingAvailId;
  const handleAvailChange = (id) => {
    setModifyBookingAvailId(id);
  };

  const confirmBtn = async () => {

    await axios({
      method: 'PUT',
      url: `${baseUrl}/bookings/${bookingId}`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `JWT ${token}`
      },
      data: {
        "booking_id": bookingId,
        "listing_id": listingId,
        "availability_id": modifyBookingAvailId,
      }
    })
      .then(() => {
        const successMsg = `Done! Modified Booking ID: ${bookingId}`;
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
      })
      .catch((error) => {
        console.log(error.response);
        let errorText = '';
        error.response.data.message !== undefined
          ? errorText = error.response.data.message
          : errorText = 'Bad request'
        toast.error(
          errorText, {
            position: 'top-right',
            hideProgressBar: true,
            style: {
              backgroundColor: '#cc0000',
              opacity: 0.8,
              textAlign: 'center',
              fontSize: '18px'
            }
          }
        );
      })
    setUpdate(!updated);      
    history.push('/mybookings');
    handleCloseModal();
  }

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Dialog
          open={bookingDialog}
          onClose={handleCloseModal}
          scroll={'paper'}
          aria-labelledby="edit-booking-modal-title"
          aria-describedby="edit-booking-modal-description"
          disableRestoreFocus={true}
          disableBackdropClick={true}
        >
          <DialogTitle
            id="booking-dialog-title"
            className={classes.dialogTitle}
          >
            {'Change Booking'}
            <Divider className={classes.listDivider}/>
            {
              currentAvail !== null &&
              currentAvail !== {} &&
              Object.keys(currentAvail).length > 1 &&
              <List className={classes.listRootTitle}>
                <ListItem
                  disableGutters
                >
                  <ListItemText
                    className={classes.listItemTextTitle}
                    primary={
                      <Typography component={'span'} variant="body2" align="left" color="textPrimary">
                        {`Current Availability ID: ${currentAvail.availability_id}`}
                      </Typography>
                    }
                    secondary={
                      <div>
                        <div>
                          {`From: ${format(new Date(currentAvail.start_time), 'dd/MM/yyyy hh:mm a')}`}
                        </div>
                        <div>
                          {`Until: ${format(new Date(currentAvail.end_time), 'dd/MM/yyyy hh:mm a')} (${formatDistanceStrict(new Date(currentAvail.start_time), new Date(currentAvail.end_time))})`}
                        </div>
                      </div>
                    }
                  />
                  <ListItemSecondaryAction
                    className={classes.dialogTitle}
                  >
                    <Radio
                      checked={parseInt(modifyBookingAvailId) === parseInt(currentAvail.availability_id)}
                      onChange={() => { handleAvailChange(parseInt(currentAvail.availability_id)) }}
                      value={parseInt(currentAvail.availability_id)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            }
          </DialogTitle>

          <DialogContent
            dividers={true}
            className={classes.dialogContent}
          >
            <DialogContentText
              tabIndex={-1}
            >
            {
            availabilities.length > 0 &&
            <List className={classes.listRoot}>
              {
                availabilities.map((availability) => (
                <Box key={availability.availability_id}>
                  {
                    availability.is_available &&
                    <ListItem
                      disableGutters divider
                    >
                      <ListItemText
                        primary={
                          <Typography component={'span'} variant="body2" align="left" color="textPrimary">
                            {`Availability ID: ${availability.availability_id}`}
                          </Typography>
                        }
                        secondary={
                          <div>
                            <div>
                              {`From: ${format(new Date(availability.start_time), 'dd/MM/yyyy hh:mm a')}`}
                            </div>
                            <div>
                              {`Until: ${format(new Date(availability.end_time), 'dd/MM/yyyy hh:mm a')} (${formatDistanceStrict(new Date(availability.start_time), new Date(availability.end_time))})`}
                            </div>
                          </div>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Radio
                          checked={parseInt(modifyBookingAvailId) === parseInt(availability.availability_id)}
                          onChange={() => { handleAvailChange(parseInt(availability.availability_id)) }}
                          value={parseInt(availability.availability_id)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  }
                </Box>
                ))
              }
            </List>
            }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Box className={classes.modalButtons}>
              <Tooltip title={"Confirm"}>
                <Button
                  className={classes.createButton}
                  variant="contained"
                  onClick={() => { confirmBtn() }}
                  color="primary"
                >
                  {'Confirm'}
                </Button>
              </Tooltip>
              <Tooltip title="Cancel">
                <Button
                  className={classes.button}
                  variant="outlined"
                  onClick={() => {
                    handleCloseModal();
                  }}
                  color="secondary"
                >
                  Cancel
                </Button>
              </Tooltip>
            </Box>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  )
}

BookingDialog.propTypes = {
  bookingDialog: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  listingId: PropTypes.number.isRequired,
  bookingId: PropTypes.string.isRequired,
  currentAvail: PropTypes.object.isRequired,
  availabilities: PropTypes.array.isRequired,
};

export default BookingDialog;
