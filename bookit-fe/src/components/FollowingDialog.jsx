import React from 'react';
import { StoreContext } from '../utils/store';
import { useHistory } from 'react-router-dom';
import {
  makeStyles,
  useTheme,
  ThemeProvider,
  Box,
  Button,
  IconButton,
  Typography,
  Divider,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemAvatar,
  Avatar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Link,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';


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
  dialogTitleDiv: {
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 0,
  },
  dialogTitleTextDiv: {
    margin: theme.spacing(1),
    marginLeft: '1em',
  },
  dialogTitleText: {
    
  },
  dialogTitleCloseBtntDiv: {
    margin: theme.spacing(1)
  },
  dialogContent: {
    width: 500,
    maxHeight: 500,
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
  },
  closeBtn: {
    padding: 0,
  },
  followListItem: {
    paddingRight: 0,
  },
  followListSecondaryAction: {
    right: 0,
  },
  emptyFollowArrayDiv: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: '1em',
    paddingTop: '1.5em',
  }
}));

// Loads a modal which shows the list of followers of/users following the
// associated profile, depending on the followees prop (which is a Boolean).
// The modal also allows the primary user to follow/unfollow the users within
// the list, depending on the followed status, and the option to navigate to
// their profile.
const FollowingDialog = ({
  followingDialog, handleCloseDialog, followArray,
  followees, handleClickFollow, username
}) => {
  // state variables
  const context = React.useContext(StoreContext);
  const primaryUsername = context.username[0];
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Dialog
          open={followingDialog}
          onClose={handleCloseDialog}
          scroll={'paper'}
          aria-labelledby="edit-booking-modal-title"
          aria-describedby="edit-booking-modal-description"
          disableRestoreFocus={true}
        >
          <Box
            id="booking-dialog-title"
            className={classes.dialogTitleDiv}
          >
            <Box className={classes.dialogTitleTextDiv}>
              <Typography
                component={'span'} variant="h6" align="left"
                color="textPrimary"
                className={classes.dialogTitleText}
              >
                {
                  followees === true ?
                    'Following':
                    'Followers'
                }
              </Typography>
            </Box>
            <DialogActions
              className={classes.dialogTitleCloseBtntDiv}
            >
              <Tooltip title={'Close'}>
                <IconButton
                  className={classes.closeBtn}
                  onClick={()=>{
                    handleCloseDialog();
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </DialogActions>
          </Box>
          <Divider className={classes.listDivider}/>
          <DialogContent
            dividers={true}
            className={classes.dialogContent}
          >
            <DialogContentText
              tabIndex={-1}
            >
            {
              followArray.length > 0 &&
              <List className={classes.listRoot}>
                {
                  followArray.map((user) => (
                  <ListItem
                    disableGutters divider
                    key={user.user_id}
                    className={classes.followListItem}
                  >
                    <ListItemAvatar>
                      <Avatar
                        aria-label="user-avatar"
                        src={user.avatar}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      disableTypography={true}
                      primary={
                        <Tooltip
                          title={`View ${user.username}'s profile`}
                          placement="bottom-start"
                        >
                          <Link
                            component="button"
                            variant="body2"
                            align="left"
                            className={classes.followingTextBtn}
                            onClick={() => {
                              handleCloseDialog();
                              history.push(`/profile/${user.username}`);
                            }}
                          >
                            {user.username}
                          </Link>
                        </Tooltip>
                      }
                      secondary={
                        <Typography component={'div'} variant="body2" align="left" color="textSecondary">
                          {user.email}
                        </Typography>
                      }
                    />
                      {
                        user.username !== primaryUsername &&
                        <ListItemSecondaryAction
                          className={classes.followListSecondaryAction}
                        >
                          <Tooltip
                            title={
                              Boolean(Number(user.is_followed)) !== true
                                ? `Follow ${user.username}`
                                : `Unfollow ${user.username}`
                            }
                          >
                            <Button
                              id={'user-follow-button'}
                              variant={
                                Boolean(Number(user.is_followed)) !== true
                                  ? 'contained'
                                  : 'outlined'
                              }
                              color={
                                Boolean(Number(user.is_followed)) !== true
                                  ? 'default'
                                  : 'secondary'
                              }
                              className={classes.button}
                              size="small"
                              onClick={() => {
                                if (Boolean(Number(user.is_followed)) !== true) {
                                  handleClickFollow(true, user.user_id, null);
                                } else {
                                  handleClickFollow(false, null, user.username);
                                }
                              }}
                            >
                              {
                                Boolean(Number(user.is_followed)) !== true
                                  ? 'Follow' 
                                  : 'Unfollow'
                              }
                            </Button>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      }
                  </ListItem>
                  ))
                }
              </List>
            }
            {
              followArray.length < 1 &&
              <Box className={classes.emptyFollowArrayDiv}>
                <Typography
                  component={'div'} variant="body2"
                  align="left" color="textSecondary"
                >
                  {
                    username !== '' &&
                    followees === true &&
                    username !== primaryUsername &&
                      `${username} is following nobody.`
                  }
                  {
                    username !== '' &&
                    followees !== true &&
                    username !== primaryUsername &&
                      `${username} has no followers yet.`
                  }
                  {
                    username === primaryUsername &&
                    followees === true &&
                      `You are following nobody.`
                  }
                  {
                    username === primaryUsername &&
                    followees !== true &&
                      `You have no followers yet.`
                  }                  
                  {
                    username === '' &&
                    followees === true &&
                      'Following nobody.'
                  }                  
                  {
                    username === '' &&
                    followees === true &&
                      'No Followers found.'
                  }
                </Typography>
              </Box>
            }
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  )
}

FollowingDialog.propTypes = {
  followingDialog: PropTypes.bool.isRequired,
  handleCloseDialog: PropTypes.func.isRequired,
  followArray: PropTypes.array.isRequired,
  followees: PropTypes.bool.isRequired,
  handleClickFollow: PropTypes.func.isRequired,
  username: PropTypes.string,
};

export default FollowingDialog;
