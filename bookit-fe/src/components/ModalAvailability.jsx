import React from 'react';
import { StoreContext } from '../utils/store';
import Modal from '@material-ui/core/Modal';
import {
  makeStyles,
  useTheme,
  ThemeProvider,
  Box,
  Button,
  Grid,
  Typography,
  Divider,
  Tooltip,
  List,
  ListItemText,
  ListItem,
  Paper
} from '@material-ui/core';
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    width: '525px',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    color: 'white'
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
  modalTitle: {
    paddingTop: '10px',
  },
  timeslotTitleTextListItem: {
    padding: 0,
    paddingLeft: '0.5em',
  },
  timeslotTitleTextDiv: {
    
  },
  timeslotTextListItem: {
    padding: 0,
    paddingLeft: '1em',
  },
}));

// Loads a modal which allows a user to create a new availability, or modify
// and existing one. The User is prompted with a start and end time interval,
// which are separated by at least one hour. The start time is defaulted
// to the current date time, rounded to the nearest next hour.
// The user may only choose time slots in hourly granularity, with a maximum
// of a 10 hour interval per availability.
// They may choose to cancel/close the modal without creation/modifications.
const ModalAvailability = ({
  availModal, handleCloseModal, givenListingId, newAvail, availId
}) => {
  // state variables
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const baseUrl = context.baseUrl;
  const [updated, setUpdate] = context.updates;
  const theme = useTheme();
  const classes = useStyles();
  // sets up the start & end times to be exactly 1 hr apart, with the start time
  // being the current datetime rounded up to the next nearest hour.
  let today = new Date();
  today.setMinutes(60);
  let todayPlus = new Date(today);
  todayPlus.setMinutes(60);
  // datetime state variables
  const [startDatetime, setStartDatetime] = React.useState(today);
  const [endDatetime, setEndDatetime] = React.useState(todayPlus);
  // ensures the user may only enter a max of 10 hr interval, which causes
  // the end datetime to revert to a 10 hr maximum if the limit is exceeded.
  const tenHourLimit = async (date) => {
    const inputDatetimeDiff = date - startDatetime;
    const tenHrsMs = 60000 * 60 * 10; // 60000 ms in a min * 60mins * 10 hrs
    if (inputDatetimeDiff > tenHrsMs) {
      toast.error(
        'Availability cannot span more than 10 hours', {
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
      let startDateEpoch = startDatetime.getTime();
      let tenHrsMore = startDateEpoch + tenHrsMs;
      let tenHrsDatetime = new Date(tenHrsMore);
      setEndDatetime(tenHrsDatetime);
    }
  }
  // handles the start time change, and rounds to the nearest hour.
  const handleStartDateChange = (date) => {
    const mins = date.getMinutes();
    if (mins <= 30) {
      date.setMinutes(0)
    } else {
      date.setMinutes(60)
    }
    if (date >= endDatetime) {
      let newDatetime = new Date(date);
      newDatetime.setMinutes(60);
      setEndDatetime(newDatetime);
    }
    setStartDatetime(date);
  };
  // handles the end time change, and rounds to the nearest hour, always being
  // at least 1 hour ahead of the start time
  const handleEndDateChange = async (date) => {
    if (date <= startDatetime) {
      let newDatetime = new Date(startDatetime);
      newDatetime.setMinutes(60);
      setEndDatetime(newDatetime);
    } else {
      const mins = date.getMinutes();
      if (mins <= 30) {
        date.setMinutes(0)
      } else {
        date.setMinutes(60)
      }
      setEndDatetime(date);
    }
    await tenHourLimit(date);
  };
  // handles the confirm button - sends an API request depending on the reqMethod
  // prop, and sends the input start & end datetimes as miliseconds since the Epoch.
  const availButton = async () => {
    const startTime = startDatetime.getTime();
    const endTime = endDatetime.getTime();
    const reqMethod = newAvail === true ? 'POST' : 'PUT';
    const reqUrl = newAvail === true ?
      `${baseUrl}/availabilities` :
      `${baseUrl}/availabilities/${availId}`;
    const reqBody = {
      "listing_id": givenListingId,
      "start_time": startTime,
      "end_time": endTime,
      "is_available": true,
    };
    if (newAvail === true) {
      reqBody.availability_id = availId;
    }
    await axios({
      method: reqMethod,
      url: reqUrl,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `JWT ${token}`
      },
      data: reqBody
    })
      .then(() => {
        const successMsg = newAvail === true ?
        `Done! Created a new Availability for Listing ID: ${givenListingId}` :
        `Done! Modified Availability ID: ${availId}`
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
        let errorText = '';
        if (error.response.data.error !== undefined) {
          errorText = error.response.data.error;
        } else if (error.response.data.message !== undefined) {
          errorText = error.response.data.message;
        } else {
          errorText = 'Bad request';
        }
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
    handleCloseModal();
  }
  // forms the body of the JSX expression within the modal
  const body = (
    <Box className={classes.paper}>
      <Box>
        <Typography className={classes.modalTitle} gutterBottom variant="h6">
          {newAvail === true ? 'Create' : 'Modify'} Availability
        </Typography>
      </Box>
      <Divider light={true} />
      <List dense>
        <ListItem className={classes.timeslotTitleTextListItem}>
          <ListItemText disableTypography
            primary={
              <div className={classes.timeslotTitleTextDiv}>
                <Typography align="left" variant="subtitle2" color="textPrimary" component={'span'}>
                  {`${newAvail === true ? 'Create a new' : 'Modify the'} availability time slot below.`}
                </Typography>
              </div>
            }
          />
        </ListItem>
        <ListItem className={classes.timeslotTextListItem}>
          <ListItemText disableTypography
            primary={
              <div>
                <div>
                  <Typography align="left" variant="body2" color="textSecondary" component={'span'}>
                    {'The time slot may only be created for a future time.'}
                  </Typography>
                </div>
                <div>
                  <Typography align="left" variant="body2" color="textSecondary" component={'span'}>
                    {'The time slot may only use hourly time intervals.'}
                  </Typography>
                </div>                
                <div>
                  <Typography align="left" variant="body2" color="textSecondary" component={'span'}>
                    {'The time slot must not exceed 10 hours in total duration.'}
                  </Typography>
                </div>                
              </div>
            }
          />
        </ListItem>        
      </List>
      <Paper elevation={5}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <KeyboardDateTimePicker
              margin="normal"
              id="time"
              label="Start Time"
              value={startDatetime}
              onChange={handleStartDateChange}
              minutesStep={60}
              openTo="hours"
              views={["hours"]}
              format="dd/MM/yyyy hh:mm a"
              showTodayButton
              ampm={true}
              disablePast
            />
            <KeyboardDateTimePicker
              margin="normal"
              id="time"
              label="End Time"
              value={endDatetime}
              onChange={handleEndDateChange}
              minutesStep={60}
              openTo="hours"
              views={["hours"]}
              format="dd/MM/yyyy hh:mm a"
              showTodayButton
              disablePast
            />
          </Grid>
        </MuiPickersUtilsProvider>
      </Paper>
      <br />
      <Divider light={true} />
      <Box className={classes.modalButtons}>
        <Tooltip title={newAvail === true ? "Create" : "Confirm"}>
          <Button
            className={classes.createButton}
            variant="contained"
            onClick={() => {availButton()}}
            color="primary"
          >
            {newAvail === true ? 'Create' : 'Confirm'}
          </Button>
        </Tooltip>
        <Tooltip title="Cancel">
          <Button
            className={classes.button}
            variant="outlined"
            onClick={handleCloseModal}
            color="secondary"
          >
            Cancel
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Modal
          open={availModal}
          onClose={handleCloseModal}
          className={classes.modal}
          aria-labelledby="new-availability-modal-title"
          aria-describedby="new-availability-modal-description"
          disableRestoreFocus={true}
          disableBackdropClick={true}
        >
          {body}
        </Modal>
      </div>
    </ThemeProvider>
  )
}

ModalAvailability.propTypes = {
  availModal: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  givenListingId: PropTypes.number.isRequired,
  newAvail: PropTypes.bool.isRequired,
  availId: PropTypes.number,
};

export default ModalAvailability;
