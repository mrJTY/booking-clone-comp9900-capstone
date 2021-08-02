import React from 'react';
import Config from '../config.json';

export const StoreContext = React.createContext(null);

const ContextStore = ({ children }) => {
  const port = 'BACKEND_PORT' in Config ? Config.BACKEND_PORT : 5000;
  // token stores an Authorized user token upon successfully logging in
  const [token, setToken] = React.useState(null);
  // the page variable stores the current page as a string
  const [page, setPage] = React.useState('/login');
  // concerned with page rendering
  const [updated, setUpdated] = React.useState(false);
  const [mylistings, setMylistings] = React.useState([]);
  // object containing all of the users a user is following from a GET API request
  const [following, setFollowing] = React.useState({});
  // the primary user's username & user id for API request purposes
  const [username, setUsername] = React.useState(null);
  const [primaryUserId, setPrimaryUserId] = React.useState(null);
  // the primary user's current booked hours
  const [bookedHrs, setBookedHrs] = React.useState(null);
  // a list containing all of the primary user's bookings
  const [mybookings, setMybookings] = React.useState([]);
  // determines the booking uuid of which to modify
  const [modifyBookingAvailId, setModifyBookingAvailId] = React.useState(null);
  // search state variables
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchUserQuery, setSearchUserQuery] = React.useState('');
  const [searchType, setSearchType] = React.useState('listings');
  const [searchCategories, setSearchCategories] = React.useState([]);
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchUserResults, setSearchUserResults] = React.useState([]);
  // creation of a datetime object beginning as of now, along with e secondary
  // datetime an hour ahead, rounded up to the nearest hour
  let today = new Date();
  today.setMinutes(60);
  let todayPlus = new Date(today);
  todayPlus.setMinutes(60);
  // search datetime variables, defaulted to now
  const [searchStartDatetime, setSearchStartDatetime] = React.useState(today);
  const [searchEndDatetime, setSearchEndDatetime] = React.useState(todayPlus);
  const [useSearchTimeFrame, setUseSearchTimeFrame] = React.useState(false);
  // an object containing inforation about the primary user
  const [authMeInfo, setAuthMeInfo] = React.useState(null);
  // the overall context manager object which is accessed globally
  const store = {
    baseUrl: `http://localhost:${port}`,
    token: [token, setToken],
    pageState: [page, setPage],
    updates: [updated, setUpdated],
    mylistings: [mylistings, setMylistings],
    following: [following, setFollowing],
    username: [username, setUsername],
    primaryUserId: [primaryUserId, setPrimaryUserId],
    bookedHrs: [bookedHrs, setBookedHrs],
    mybookings: [mybookings, setMybookings],
    modifyBookingAvailId: [modifyBookingAvailId, setModifyBookingAvailId],
    searchQuery: [searchQuery, setSearchQuery],
    searchUserQuery: [searchUserQuery, setSearchUserQuery],
    searchType: [searchType, setSearchType],
    searchCategories: [searchCategories, setSearchCategories],
    searchResults: [searchResults, setSearchResults],
    searchUserResults: [searchUserResults, setSearchUserResults],
    searchStartDatetime: [searchStartDatetime, setSearchStartDatetime],
    searchEndDatetime: [searchEndDatetime, setSearchEndDatetime],
    useSearchTimeFrame: [useSearchTimeFrame, setUseSearchTimeFrame],
    authMeInfo: [authMeInfo, setAuthMeInfo],
  }
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export default ContextStore;
