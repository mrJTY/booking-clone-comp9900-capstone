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
  Tooltip
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
    width: 400,
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
    // backgroundColor: '#12824C',
    // color: '#FFFFFF',
  },
  modalTitle: {
    paddingTop: '10px',
  },
}));

// Loads a modal which allows a user to create a new availability, provided
// they enter a name. They may choose to cancel/close the modal without
// the creation of a new availability.
const ModalAvailability = ({
  availModal, handleCloseModal, givenId, newAvail, availId
}) => {
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const baseUrl = context.baseUrl;
  const [updated, setUpdate] = context.updates;
  const theme = useTheme();
  const classes = useStyles();

  let today = new Date();
  today.setMinutes(60);
  let todayPlus = new Date(today);
  todayPlus.setMinutes(60);

  const [startDatetime, setStartDatetime] = React.useState(today);
  const [endDatetime, setEndDatetime] = React.useState(todayPlus);
  
  const tenHourLimit = async (date) => {
    const inputDatetimeDiff = date - startDatetime;
    const tenHrsMs = 60000 * 60 * 10; // 60000 ms in a min * 60mins * 10 hrs

    console.log('end Datetime is');
    console.log(date);
    console.log('input datetime diff is:');
    console.log(inputDatetimeDiff);

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

      console.log('ten hrs MORE is');
      console.log(tenHrsMore);

      let tenHrsDatetime = new Date(tenHrsMore);

      console.log('ten hrs datetime is');
      console.log(tenHrsDatetime);

      setEndDatetime(tenHrsDatetime);
    }
  }

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

  const availButton = async () => {
    const startTime = startDatetime.getTime();
    const endTime = endDatetime.getTime();

    console.log('start and end times are:');
    console.log(startTime);
    console.log(endTime);

    const reqMethod = newAvail === true ? 'POST' : 'PUT';
    const reqUrl = newAvail === true ?
      `${baseUrl}/availabilities` :
      `${baseUrl}/availabilities/${availId}`;
    const reqBody = {
      "listing_id": givenId,
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
        `Done! Created a new Availability for Listing ID: ${givenId}` :
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
    // history.push({
    //   pathname: `/listings/${givenId}`,
    //   state: {
    //     givenId: parseInt(givenId),
    //   }
    // })
    setUpdate(!updated);
    handleCloseModal();
  }

  const body = (
    <Box className={classes.paper}>
      <Box>
        <Typography className={classes.modalTitle} gutterBottom variant="h6">
          {newAvail === true ? 'Create' : 'Modify'} Availability
        </Typography>
      </Box>

      <Divider light={true} />

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

      <br />

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
  givenId: PropTypes.number.isRequired,
  newAvail: PropTypes.bool.isRequired,
  availId: PropTypes.number,
};

export default ModalAvailability;
