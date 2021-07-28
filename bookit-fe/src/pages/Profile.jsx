import React from 'react';
import Navbar from '../components/Navbar';
// import DefaultAvatar from '../assets/default-avatar.svg';
import {
  followUserRequest,
  unfollowUserRequest,
} from '../utils/auxiliary';
import { StoreContext } from '../utils/store';
import {
  fetchProfile,
  fetchProfileListings,
  fetchAuthMe
} from '../utils/auxiliary';
import ResourceCard from '../components/ResourceCard';
import {
  // useHistory,
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

// Page styling used on the MyListings screen and its subcomponents
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
    // flex: 1,
    width: '100%',
  },
  bookedHrsDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '14em',
  },
  followDiv: {
    display: 'flex',
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  followBtn: {
    margin: '0em 0.5em',
  },
  followText: {
    // paddingRight: '0.5em',
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


const Profile = () => {
  const context = React.useContext(StoreContext);
  const baseUrl = context.baseUrl;
  const token = context.token[0];
  const primaryUsername = context.username[0];
  const [bookedHrs, setBookedHrs] = context.bookedHrs;
  // const history = useHistory();
  const params = useParams();
  const profileUsername = params.user;

  console.log(params)

  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // object containing all of the users a user is following from a GET API request
  // const [following, setFollowing] = context.following;
  // the page variable stores the current page as a string
  const [page, setPage] = context.pageState;
  // page loading state
  const [loadingState, setLoadingState] = React.useState('idle');
  const [userProfile, setUserProfile] = React.useState(null);

  const [followersDialog, setFollowersDialog] = React.useState(false);
  const handleCloseFollowersDialog = () => {
    setFollowersDialog(false);
  };

  const [followingDialog, setFollowingDialog] = React.useState(false);
  const handleCloseFollowingDialog = () => {
    setFollowingDialog(false);
  };

  const [changeFollowState, setChangeFollowState] = React.useState(false);

  const [userListings, setUserListings] = React.useState(null);

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

  React.useEffect(() => {
    async function setupBookedHrs () {
      if (profileUsername === primaryUsername && userProfile !== null ) {
        await setBookedHrs(10 - parseInt(userProfile.hours_booked));
      }
    }
    setupBookedHrs();
  }, [userProfile]); // eslint-disable-line react-hooks/exhaustive-deps


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
              </Box>

              <Divider light className={classes.divider} />

              <Box className={classes.box}>
                <Box className={classes.imgContainer}>
                  <Tooltip title={`${userProfile.username}'s Avatar`}>
                    <img src={
                        // DefaultAvatar
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
                                console.log('Clicked Unfollow')
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
                          {`Remaining Booking hours: ${bookedHrs}`}
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

                  <Typography paragraph align="left" variant="body2" color="textSecondary" component="p">
                    {userProfile.email}
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
                        User Listings
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
