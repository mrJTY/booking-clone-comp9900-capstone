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

  // another option is simply storing the user info from the GET request
  // const [userinfo, setUserinfo] = React.useState({});

  const [username, setUsername] = React.useState(null);
  const [primaryUserId, setPrimaryUserId] = React.useState(null);

  const [bookedHrs, setBookedHrs] = React.useState(null);
  const [mybookings, setMybookings] = React.useState([]);
  const [modifyBookingAvailId, setModifyBookingAvailId] = React.useState(null);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchUserQuery, setSearchUserQuery] = React.useState('');
  const [searchType, setSearchType] = React.useState('listings');
  const [searchCategories, setSearchCategories] = React.useState([]);
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchUserResults, setSearchUserResults] = React.useState([]);

  let today = new Date();
  today.setMinutes(60);
  let todayPlus = new Date(today);
  todayPlus.setMinutes(60);

  const [searchStartDatetime, setSearchStartDatetime] = React.useState(today);
  const [searchEndDatetime, setSearchEndDatetime] = React.useState(todayPlus);
  const [useSearchTimeFrame, setUseSearchTimeFrame] = React.useState(false);

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
  }
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export default ContextStore;
