import React from 'react';
import Navbar from '../components/Navbar';
import {
  followUserRequest,
  unfollowUserRequest,
} from '../utils/auxiliary';
import { StoreContext } from '../utils/store';
import {
  fetchProfile,
  fetchProfileListings,
  fetchAuthMe,
} from '../utils/auxiliary';
import ResourceCard from '../components/ResourceCard';
import {
  Redirect,
  useParams,
} from 'react-router-dom';
import {
  makeStyles,
  Box,
  Container,
  Typography,
  CircularProgress,
  Button,
  Tooltip,
  Divider,
  Grid,
  Link,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import FollowingDialog from '../components/FollowingDialog';
import styled from 'styled-components';

const WhiteText = styled.span`
  color: white;
`

// Page styling used on the Profile screen and its subcomponents
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  outerContainer: {
    width: '100%',
  },
  outerContainerBtns: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  containerDiv: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    width: '100%',
  },
  titleSubcontainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  titleHeadingDiv: {
    paddingRight: '10px',
  },  
  mytitleDiv: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: theme.spacing(1),
  },
  box: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-start',
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
  image: {
    height: '128px',
    width: '128px',
    margin: 'auto',
  },
  imgContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: '20px',
    justifyContent: 'flex-start',
    minWidth: '256px',
    minHeight: '256px',
    maxHeight: '256px',
    maxWidth: '256px',
    paddingRight: '20px',
    borderRadius: 10,
  },
  img: {
    maxHeight: '256px',
    maxWidth: '256px',
    minHeight: '128px',
    minWidth: '128px',
  },
  usernameTitleDiv: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  primaryUsernameTitleDiv: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5em',
  },
  usernameTextDiv: {
    width: '100%',
  },
  bookedHrsDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20em',
  },
  followDiv: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  followBtn: {
    margin: '0em 0.5em',
  },
  followText: {

  },
  followTextOuterDiv: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: '0.5em',
  },
  followTextItemDiv: {
    display: 'flex',
    alignItems: 'center',
  },
  followTextDivider: {
    width: '2px',
    backgroundColor: '#648dae',
    margin: '0 0.5em',
  },
  followingTextBtn: {
    marginRight: '0.25em',
  },
  divider: {
    margin: '1em 0em',
    height: '2px',
  },
}));

// The Profile page allows a user to view a user profile, whether it is their own
// or that of another user. If the primary user owns the Profile, they are able
// to view their username, a popup modal containing a list of followers/following,
// their remaining monthly booking hours, their email and avatar.
// If the profile is that of another user, the main differences are instead of
// being able to view booking hours, the user may choose to follow/unfollow them
// instead, and they also see all the Listings that user owns as ResourceCards.
const Profile = () => {
  // state variables
  const context = React.useContext(StoreContext);
  const baseUrl = context.baseUrl;
  const token = context.token[0];
  const primaryUsername = context.username[0];
  const [bookedHrs, setBookedHrs] = context.bookedHrs;
  const params = useParams();
  const profileUsername = params.user;
  // redirect to login screen if user is not logged in
  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // the page variable stores the current page as a string
  const [page, setPage] = context.pageState;
  // page loading state
  const [loadingState, setLoadingState] = React.useState('idle');
  const [userProfile, setUserProfile] = React.useState(null);
  // followers/following popu modal open state variables
  const [followersDialog, setFollowersDialog] = React.useState(false);
  const handleCloseFollowersDialog = () => {
    setFollowersDialog(false);
  };
  const [followingDialog, setFollowingDialog] = React.useState(false);
  const handleCloseFollowingDialog = () => {
    setFollowingDialog(false);
  };
  // state variable triggering an update of the follow/unfollow buttons
  const [changeFollowState, setChangeFollowState] = React.useState(false);
  // state variable pertaining to a particular user's Listings
  const [userListings, setUserListings] = React.useState(null);
  // renders the profile page contents
  React.useEffect(() => {
    setPage('/profile/me');
    async function setupProfile () {
      setLoadingState('loading');
      if (profileUsername !== primaryUsername) {
        await fetchProfile(baseUrl, token, profileUsername, setUserProfile);
        await fetchProfileListings(baseUrl, token, profileUsername, setUserListings);
      } else {
        await fetchAuthMe(baseUrl, token, setUserProfile);
      }
      setLoadingState('success');
    }
    setupProfile();
  }, [profileUsername]); // eslint-disable-line react-hooks/exhaustive-deps
  // renders the follow/unfollow buttons depending on the followed state
  React.useEffect(() => {
    async function followStateChange () {
      if (changeFollowState === true) {
        if (profileUsername !== primaryUsername) {
          await fetchProfile(baseUrl, token, profileUsername, setUserProfile);
        } else {
          await fetchAuthMe(baseUrl, token, setUserProfile);
        }
        await setChangeFollowState(false);
      }
    }
    followStateChange();
  }, [changeFollowState]); // eslint-disable-line react-hooks/exhaustive-deps
  // renders & updates the primary user's remaining booking hours
  React.useEffect(() => {
    async function setupBookedHrs () {
      if (profileUsername === primaryUsername && userProfile !== null ) {
        await setBookedHrs(10 - parseInt(userProfile.hours_booked));
      }
    }
    setupBookedHrs();
  }, [userProfile]); // eslint-disable-line react-hooks/exhaustive-deps
  // called upon clicking the follow button - sends an API request to
  // follow/unfollow a user depending on the followed state
  const handleClickFollow = async (follow, userId, username) => {
    if (follow) {
      await followUserRequest(baseUrl, token, userId);
    } else {
      await unfollowUserRequest(baseUrl, token, username);
    }
    setChangeFollowState(true);
  }
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
          userProfile !== null &&
          <Box className={classes.containerDiv}>
            <Box className={classes.mytitleDiv}>
              <Box className={classes.titleHeadingDiv}>
                <Typography paragraph align="left" variant="h4">
                  Profile
                </Typography>
                <Divider light className={classes.divider} />
              </Box>
              <Box className={classes.box}>
                <Box className={classes.imgContainer}>
                  <Tooltip title={`${userProfile.username}'s Avatar`}>
                    <img src={
                        userProfile.avatar
                      }
                      alt="thumbnail"
                      className={classes.img}
                    />
                  </Tooltip>
                </Box>
                <Box className={classes.outerContainer}>
                  <Box className={
                      primaryUsername === userProfile.username ?
                        classes.primaryUsernameTitleDiv :
                        classes.usernameTitleDiv
                    }
                  >
                    <Box className={classes.usernameTextDiv}>
                      <Typography variant="h5" align="left">
                        {userProfile.username}
                      </Typography>
                    </Box>
                    {
                      userProfile.username !== primaryUsername &&
                      <Box className={classes.followDiv}>
                        {
                          Boolean(Number(userProfile.is_followed)) === true &&
                          <Tooltip title={`Unfollow ${userProfile.username}`} aria-label={'unfollow'}>
                            <Button
                              id={'user-unfollow-button'}
                              variant={'outlined'}
                              color={'secondary'}
                              className={classes.button}
                              onClick={() => {
                                if (Boolean(Number(userProfile.is_followed)) === true) {
                                  handleClickFollow(false, null, userProfile.username);
                                }
                              }}
                            >
                              {'Unfollow'}
                            </Button>
                          </Tooltip>
                        }
                        <Tooltip
                          title={
                            Boolean(Number(userProfile.is_followed)) !== true
                              ? `Follow ${userProfile.username}`
                              : ''
                          }
                          aria-label={'follow'}
                          disableHoverListener={
                            Boolean(Number(userProfile.is_followed)) !== true
                              ? false
                              : true
                          }
                        >
                          <Button
                            id={'user-follow-button'}
                            variant={
                              Boolean(Number(userProfile.is_followed)) !== true ?
                                'contained' :
                                'outlined'
                            }
                            color={'default'}
                            className={classes.button}
                            disabled={
                              Boolean(Number(userProfile.is_followed)) !== true ?
                                false :
                                true
                            }
                            onClick={() => {
                              if (Boolean(Number(userProfile.is_followed)) !== true) {
                                handleClickFollow(true, userProfile.user_id, null);
                              }
                            }}
                            endIcon={
                              Boolean(Number(userProfile.is_followed)) !== true ?
                                <AddIcon /> :
                                <CheckIcon />
                            }
                          >
                            {
                              Boolean(Number(userProfile.is_followed)) !== true ?
                                'Follow' :
                                'Following'
                            }
                          </Button>
                        </Tooltip>
                      </Box>
                    }
                    {
                      userProfile.username === primaryUsername &&
                      <Box className={classes.bookedHrsDiv}>
                        <Typography align="center" variant="subtitle1" color="textPrimary">
                          {`Remaining Monthly Booking hours: ${bookedHrs}`}
                        </Typography>
                      </Box>
                    }
                  </Box>
                  <Box className={classes.followTextOuterDiv}>
                    <Box className={classes.followTextItemDiv}>
                      <Tooltip
                        title={`View ${userProfile.username}'s followers`}
                        placement="bottom-start"
                      >
                        <Link
                          component="button"
                          variant="body2"
                          align="left"
                          className={classes.followingTextBtn}
                          onClick={() => {
                            setFollowersDialog(true);
                          }}
                        >
                          {`Followers:`}
                        </Link>
                      </Tooltip>
                      <Typography
                        variant="body2"
                        align="left"
                        className={classes.followText}
                      >
                        {
                          ` ${userProfile.followers.length}`
                        }
                      </Typography>
                    </Box>
                    <Box>
                      <Divider
                        orientation="vertical"
                        className={classes.followTextDivider}
                      />
                    </Box>
                    <Box className={classes.followTextItemDiv}>
                      <Tooltip
                        title={`View who ${userProfile.username} is following`}
                        placement="bottom-start"
                      >
                        <Link
                          component="button"
                          variant="body2"
                          align="left"
                          className={classes.followingTextBtn}
                          onClick={() => {
                            setFollowingDialog(true);
                          }}
                        >
                          {`Following:`}
                        </Link>
                      </Tooltip>
                      <Typography
                        component={'span'}
                        variant="body2"
                        className={classes.followText}
                      >
                         {` ${userProfile.followees.length}`}
                      </Typography>                      
                    </Box>
                  </Box>
                  <Typography gutterBottom align="left" variant="body2" color="textSecondary" component="p">
                    <WhiteText>Resource Categories / </WhiteText>
                    {
                      userProfile.user_description !== '' &&
                      `${
                        userProfile.user_description
                        .toLowerCase()
                        .split(',')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(', ')
                      }`
                    }
                    {
                      userProfile.user_description === '' &&
                      'Other'
                    }
                  </Typography>
                  <Typography paragraph align="left" variant="body2" color="textSecondary" component="p">
                  <WhiteText>email / </WhiteText>
                    {`${userProfile.email}`}
                  </Typography>
                </Box>
              </Box>
              <Divider light={true}/>
              {
                userProfile.username !== primaryUsername &&
                <Box className={classes.mytitleDiv}>
                  <Box className={classes.titleSubcontainer}>
                    <Box className={classes.titleHeadingDiv}>
                      <Typography
                        paragraph
                        align="left"
                        variant="h5"
                        color="textSecondary"
                      >
                        {`${userProfile.username}'s Listings`}
                      </Typography>
                    </Box>
                  </Box>
                  {
                    loadingState === 'success' &&
                    userListings !== null &&
                    userListings.mylistings.length > 0 &&
                    <Grid className={classes.root} container spacing={2}>
                      <Grid item xs={12}>
                        <Grid container justify="center" spacing={2}>
                        {
                          userListings.mylistings.map((listing) => (
                            <Grid key={listing.listing_id} item>
                              <ResourceCard
                                resource={listing}
                                owner={listing.username}
                                parentPage={`/profile`}
                              />
                            </Grid>
                          ))
                        }
                        </Grid>
                      </Grid>
                    </Grid>
                  }
                  {
                    loadingState === 'success' &&
                    userListings === null &&
                    <Box className={classes.noResultsDiv}>
                      <Typography paragraph align="center" variant="body2" color="textSecondary">
                        No Listings found
                      </Typography>
                    </Box>
                  }
                  {
                    loadingState === 'success' &&
                    userListings !== null &&
                    userListings.mylistings.length === 0 &&
                    <Box className={classes.noResultsDiv}>
                      <Typography paragraph align="center" variant="body2" color="textSecondary">
                        No Listings found
                      </Typography>
                    </Box>
                  }
                </Box>
              }
            </Box>
            <FollowingDialog
              followingDialog={followersDialog}
              handleCloseDialog={handleCloseFollowersDialog}
              followArray={userProfile?.followers || []}
              followees={false}
              handleClickFollow={handleClickFollow}
              username={userProfile?.username || ''}
            />            
            <FollowingDialog
              followingDialog={followingDialog}
              handleCloseDialog={handleCloseFollowingDialog}
              followArray={userProfile?.followees || []}
              followees={true}
              handleClickFollow={handleClickFollow}
              username={userProfile?.username || ''}
            />
            <br />
            <br />
          </Box>
        }
      </Container>
    </Container>
  )
}

export default Profile;
