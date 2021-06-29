import React from 'react';
import { StoreContext } from '../utils/store';
import Navbar from '../components/Navbar';
// import CustomButton from '../components/CustomButton';
// import {
//   useHistory,
//   useLocation,
//   Redirect
// } from 'react-router-dom';
import {
  makeStyles,
  Container,
  CircularProgress,
  // Button,
  // Box,
  // ListItem,
  // ListItemText,
  // Tooltip,
} from '@material-ui/core';
// import AddBoxIcon from '@material-ui/icons/AddBox';
// import EditIcon from '@material-ui/icons/Edit';
// import DeleteIcon from '@material-ui/icons/Delete';
// import DeleteBooking from '../components/DeleteBooking';
// import axios from 'axios';

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

// The EditBooking page allows a user to create or modify a booking.
const EditBooking = () => {
  const context = React.useContext(StoreContext);
  // const token = context.token[0];
  // const history = useHistory();
  // unauthorized users are redirected to the landing page
  // if (token === null) {
  //   return <Redirect to={{ pathname: '/login' }} />
  // }

  // context variables used throughout the page
  const [page, setPage] = context.pageState;
  // page loading state
  const [loadingState, setLoadingState] = React.useState('idle');

  React.useEffect(() => {
    setPage('/bookings/edit/id');
    async function setupEditBooking () {
      setLoadingState('loading');
      // await fetchUserFeed(...);
      setLoadingState('success');
    }
    setupEditBooking();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        <h2>Edit Booking page placeholder</h2>
      }
      </Container>
    </Container>
  )
}

export default EditBooking;
