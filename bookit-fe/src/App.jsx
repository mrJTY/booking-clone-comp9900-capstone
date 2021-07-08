import React from 'react';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MyBookings from './pages/MyBookings';
import Booking from './pages/Booking';
import EditBooking from './pages/EditBooking';
import MyListings from './pages/MyListings';
import Listing from './pages/Listing';
import NewListing from './pages/NewListing';
import EditListing from './pages/EditListing';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import StoreProvider from './utils/store';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import {
  ToastContainer,
  Slide
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DivAppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
  color: white;
  background-color: #303030;
`

const DivFooterWrapper = styled.div`
  display: flex;
  align-self: flex-end;
  align-items: flex-end;
  justify-content: flex-end;
  flex-direction: row;
  height: 100%;
  width: 100%;
`

const DivFooter = styled.div`
  display: flex;
  align-self: flex-end;
  align-items: center;
  justify-content: flex-end;
  max-height: 100px;
  width: 100%;
`

const FooterText = styled.p`
  margin: 0px;
  padding-right: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
`

const useStyles = makeStyles((theme) => ({
  footerDiv: {
    backgroundColor: theme.palette.background.paper,
  },
  bg: {
    fontSize: '20px',
    fontFamily: 'Calibri',
    color: 'white',
    backgroundColor: theme.palette.background.default,
  },
  appBody: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}));

function App () {
  const classes = useStyles();
  return (
    <StoreProvider>
      <DivAppWrapper>
        <div className={classes.bg}>
          <div className={classes.appBody}>
            <Router>
              <Switch>
                <Route exact path="/">
                  <Redirect to="/login" />
                </Route>
                <Route exact path="/login">
                  <Login />
                </Route>
                <Route exact path="/register">
                  <Register />
                </Route>
                <Route exact path="/home">
                  <Home />
                </Route>
                <Route exact path="/mybookings">
                  <MyBookings />
                </Route>
                <Route exact path="/bookings/:id">
                  <Booking />
                </Route>
                <Route exact path="/bookings/edit/:id">
                  <EditBooking />
                </Route>
                <Route exact path="/mylistings">
                  <MyListings />
                </Route>
                <Route exact path="/listings/create">
                  <NewListing />
                </Route>
                <Route exact path="/listings/:id">
                  <Listing />
                </Route>
                <Route exact path="/listings/edit/:id">
                  <EditListing />
                </Route>
                <Route exact path="/discover">
                  <Discover />
                </Route>
                <Route exact path="/profile/:user">
                  <Profile />
                </Route>
                <Route path="/">
                  <Redirect to="/login" />
                </Route>
              </Switch>
            </Router>
          </div>
        </div>
        <DivFooterWrapper>
          <DivFooter className={classes.footerDiv}>
            <FooterText>&copy; BookIt</FooterText>
          </DivFooter>
        </DivFooterWrapper>
      </DivAppWrapper>
      <ToastContainer
        autoClose={3000}
        transition={Slide}
        limit={3}
        style={{
          justifyContent: 'center',
          textAlign: 'center'
        }}
      />      
    </StoreProvider>
  );
}

export default App;
