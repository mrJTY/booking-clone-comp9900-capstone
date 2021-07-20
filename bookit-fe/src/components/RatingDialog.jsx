import React from 'react';
import { StoreContext } from '../utils/store';
// import { useHistory } from 'react-router-dom';
import {
  makeStyles,
  useTheme,
  ThemeProvider,
  Box,
  Button,
  // Typography,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import axios from 'axios';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'date-fns';


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
  dialogRatingDiv: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    margin: theme.spacing(1),
  },
}));

// Loads a modal which allows a user to change a rating, provided
// they enter a name. They may choose to cancel/close the modal without
// the modification of a rating.
const RatingDialog = ({
  ratingDialog, handleCloseRatingDialog, bookingId,
  ratingId, ratingStars, ratingComment
}) => {
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const baseUrl = context.baseUrl;
  const [updated, setUpdate] = context.updates;
  const theme = useTheme();
  const classes = useStyles();
  // const history = useHistory();

  const [rating, setRating] = React.useState(2.5);
  const [comment, setComment] = React.useState('');

  React.useEffect(() => {
    if (ratingStars !== undefined && ratingStars !== null) {
      setRating(ratingStars);
    }
    if (ratingComment !== undefined && ratingComment !== null) {
      setComment(ratingComment);
    }
  }, [ratingStars, ratingComment]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReviewTextChange = (event) => {
    setComment(event.target.value);
  }

  const confirmBtn = async () => {
    const reqMethod = ratingId === null ? 'POST' : 'PUT';
    const reqUrl = ratingId === null ?
      `${baseUrl}/ratings` :
      `${baseUrl}/ratings/${ratingId}`;
    await axios({
      method: reqMethod,
      url: reqUrl,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `JWT ${token}`
      },
      data: {
        "booking_id": bookingId,
        "rating": rating,
        "comment": comment,
      }
    })
      .then(() => {
        const successMsg = `Done! Reviewed Booking ID: ${bookingId}`;
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
    // history.push('/mybookings');
    handleCloseRatingDialog();
  }

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Dialog
          open={ratingDialog}
          onClose={handleCloseRatingDialog}
          scroll={'paper'}
          aria-labelledby="booking-review-title"
          aria-describedby="booking-review-description"
          disableRestoreFocus={true}
          disableBackdropClick={true}
        >
          <DialogTitle
            id="booking-dialog-title"
            className={classes.dialogTitle}
          >
            {ratingId === null ? 'New Review' : 'Modify Review'}
            <Divider className={classes.listDivider}/>
          </DialogTitle>

          <DialogActions>
            <Box className={classes.dialogRatingDiv}>
              <Rating
                name="half-rating"
                precision={0.5}
                value={rating}
                onChange={(event, ratingInput) => {
                  let newRating = 1;
                  ratingInput < 1 ?
                    newRating = 1 :
                    newRating = ratingInput;
                  setRating(newRating);
                }}
              />
            </Box>
          </DialogActions>

          <DialogContent
            // dividers={true}
            className={classes.dialogContent}
          >
            <DialogContentText
              tabIndex={-1}
            >
              Write your review for the Listing below.
            </DialogContentText>
            <TextField
              variant="outlined"
              autoFocus
              margin="dense"
              id="review"
              label="Review"
              type="text"
              multiline
              fullWidth
              rows={5}
              value={comment}
              onChange={
                e => handleReviewTextChange(e)
              }
            />
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
                    handleCloseRatingDialog();
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

RatingDialog.propTypes = {
  ratingDialog: PropTypes.bool.isRequired,
  handleCloseRatingDialog: PropTypes.func.isRequired,
  bookingId: PropTypes.string.isRequired,
  ratingId: PropTypes.number,
  ratingStars: PropTypes.number,
  ratingComment: PropTypes.string,
};

export default RatingDialog;
