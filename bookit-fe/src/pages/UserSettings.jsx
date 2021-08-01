import React from 'react';
import Navbar from '../components/Navbar';
import { StoreContext } from '../utils/store';
import UserSettingsDialog from '../components/UserSettingsDialog';
import {
  fetchAuthMe,
  imageToBase64,
} from '../utils/auxiliary';
import {
  Redirect,
} from 'react-router-dom';
import {
  makeStyles,
  Box,
  Container,
  Typography,
  CircularProgress,
  Button,
  Tooltip,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Divider,
} from '@material-ui/core';
import { toast } from 'react-toastify';

// Page styling used on the UserSettings screen and its subcomponents
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
    justifyContent: 'center',
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
  usernameTextDiv: {
    width: '100%',
    marginBottom: '0.5em',
  },
  confirmDiv: {
    display: 'flex',
    width: '20em',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  followBtn: {
    margin: '0em 0.5em',
  },
  followText: {

  },
  followTextDiv: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-start',
    marginBottom: '0.5em',
  },
  followTextDivider: {
    width: '2px',
    backgroundColor: '#648dae',
    margin: '0 0.5em',
  },
  innerContainerInputCheckbox: {
    display: 'flex',
    flexDirection: 'row',
  },
  innerContainerInput: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
  },
  innerContainerCheck: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
  },
  inputFieldCheckboxDiv: {
    display: 'flex',
    alignItems: 'center',
    margin: '0.5em 0em',
  },
  inputFieldDiv: {
    width: '100%',
    marginRight: '0.5em',
  },
  inputField: {
    marginRight: '0.5em',
  },
  uploadBtnDiv: {
    display: 'flex',
    alignItems: 'center',
    margin: '1em 0em',
  },
  formControlLegend: {
    textAlign: 'left',
    marginLeft: '0.5em',
  },
  formControlCheckbox: {

  },
  formControlCheckboxLabel: {
    margin: '0.5em 0em',
    maxWidth: '10em',
  },
  uploadBtnInput: {
    display: 'none',
  },
  uploadFileDiv: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginRight: '0.5em',
  },
  uploadFileInputDiv: {
    marginRight: '0.5em',
  },
  uploadFileTextDiv: {
    width: '100%',
  },
  divider: {
    margin: '1em 0em',
    height: '2px',
  },
}));

// styling for the error notification
const toastErrorStyle = {
  backgroundColor: '#cc0000',
  opacity: 0.8,
  textAlign: 'center',
  fontSize: '18px'
};
const toastErrorObj = {
  position: 'top-right',
  hideProgressBar: true,
  style: toastErrorStyle
};
// default checked items
const emptyVals = {
  avatar: '',
  email: '',
  password: '',
}
// generic state update function
const onChange = (setFunc, field, val) => {
  setFunc(
    state => ({
      ...state,
      [field]: val
    })
  );
}

// The UserSettings page allows a user to view a change their profile &
// account settings. They are allowed to change any of 3 items:
// - Email
// - Password
// - Avatar
// Note that the primary user is not allowed to change their own username.
// In order to change an item, the input field(s) must be non-empty, and the
// adjacent checkbox must be checked as well. A preview image of the current
// avatar also gets updated upon upload, such that the user may see whether
// they would like to use their newly chosen avatar.
// A reset button simply clears all input fields and sets them as the current
// account details, including the avatar preview image.
const UserSettings = () => {
  // state variables
  const context = React.useContext(StoreContext);
  const baseUrl = context.baseUrl;
  const token = context.token[0];
  const [authMeInfo, setAuthMeInfo] = context.authMeInfo
  // redirected to login if not logged in
  React.useEffect(() => {
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // the page variable stores the current page as a string
  const [page, setPage] = context.pageState;
  // page loading state
  const [loadingState, setLoadingState] = React.useState('idle');
  // the fields state variable contains the inputs to the profile fields
  const [fields, setFields] = React.useState(emptyVals);
  const [defaultFields, setDefaultFields] = React.useState(emptyVals);
  const [avatarBase64, setAvatarBase64] = React.useState(null);
  // initial page set up rendering all the input fields & image preview
  React.useEffect(() => {
    setPage('/usersettings');
    async function setupUserSettings () {
      setLoadingState('loading');
      await fetchAuthMe(baseUrl, token, setAuthMeInfo);
      setAvatarBase64(authMeInfo.avatar);
      const defaultVals = {
        avatar: authMeInfo.avatar,
        email: authMeInfo.email,
        password: '',
      }
      await setFields(defaultVals);
      await setDefaultFields(defaultVals);
      setLoadingState('success');
    }
    setupUserSettings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // state variables pertaining to the selected items to change
  const [itemsToChange, setItemsToChange] = React.useState([]);
  // state variable that opens the confirmation dialog popup
  const [openSettingsDialog, setOpenSettingsDialog] = React.useState(false);
  const handleCloseSettingsDialog = () => {
    setOpenSettingsDialog(false);
  }
  // default values for the checked fields
  const [checkedFields, setCheckedFields] = React.useState({
    email: false,
    password: false,
    avatar: false,
  });
  // handles checked item changes
  const handleCheckboxChange = (event, field) => {
    setCheckedFields({ ...checkedFields, [field]: event.target.checked });
  };
  // avatar state variable
  const [avatarFilename, setAvatarFilename] = React.useState('');
  const updateAvatarFile = async (e) => {
    await setAvatarFilename(e.target.files[0]?.name || '');
    await imageToBase64(e.target.files[0], setAvatarBase64);
  };
  // changes the current avatar preview, triggered on every new image upload
  React.useEffect(() => {
    async function setupAvatarChange () {
      await onChange(setFields, 'avatar', avatarBase64);
    }
    setupAvatarChange();
  }, [avatarBase64]); // eslint-disable-line react-hooks/exhaustive-deps
  // classes used for Material UI component styling
  const classes = useStyles();
  // called upon clicking the Save Changes button which opens a popup dialog
  // upon conditional checks ensuring the checked items are non-empty
  const handleClickSaveChanges = () => {
    const checkedItemsArray = Object.keys(checkedFields).filter((key) => checkedFields[key]);
    setItemsToChange(checkedItemsArray);
    if (checkedItemsArray.length === 0) {
      toast.error(
        'Select at least one item to modify settings',
        toastErrorObj
      );
    } else {
      if (
        (checkedItemsArray.includes('email') && fields.email.length < 1) ||
        (checkedItemsArray.includes('password') && fields.password.length < 1) ||
        (checkedItemsArray.includes('avatar') && fields.avatar.length < 1)
      ) {
        toast.error(
          'Can\'t modify account with empty fields',
          toastErrorObj
        );
      } else {
        setOpenSettingsDialog(true);
      }
    }
  }
  // the request body for the API PUT request depends on the checked items
  const [reqBody, setReqBody] = React.useState({});
  // dynamically changes the request body depending on checked items
  React.useEffect(() => {
    async function setupReqBody () {
      let newReqBody = {}
      for (const item of itemsToChange) {
        newReqBody[item] = fields[item];
      }
      setReqBody(newReqBody);
    }
    setupReqBody();
  }, [fields, itemsToChange]); // eslint-disable-line react-hooks/exhaustive-deps

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
          authMeInfo !== null &&
          <Box className={classes.containerDiv}>
            <Box className={classes.mytitleDiv}>
              <Box className={classes.titleHeadingDiv}>
                <Typography paragraph align="left" variant="h4">
                  User Settings
                </Typography>
                <Divider light className={classes.divider} />
              </Box>
              <Box className={classes.box}>
                <Box className={classes.imgContainer}>
                  <Tooltip title={`Preview: ${authMeInfo.username}'s Avatar`}>
                    <img src={
                        // DefaultAvatar
                        fields.avatar
                      }
                      alt="thumbnail"
                      className={classes.img}
                    />
                  </Tooltip>
                </Box>
                <Box className={classes.outerContainer}>
                  <Box className={classes.usernameTitleDiv}>
                    <Box className={classes.usernameTextDiv}>
                      <Typography variant="h5" align="left">
                        {authMeInfo.username}
                      </Typography>
                    </Box>
                    <Box className={classes.confirmDiv}>
                      <Tooltip title={'Save Changes'} aria-label={'save'}>
                        <Button
                          id={'user-save-changes-button'}
                          variant={'contained'}
                          color={'primary'}
                          className={classes.button}
                          onClick={() => {
                            handleClickSaveChanges();
                          }}
                        >
                          Save Changes
                        </Button>
                      </Tooltip>
                      <Tooltip title={'Reset Defaults'} aria-label={'reset'}>
                        <Button
                          id={'user-reset-fields-button'}
                          variant={'outlined'}
                          color={'secondary'}
                          className={classes.button}
                          onClick={() => {
                            setFields(defaultFields);
                            setAvatarFilename('');
                            setCheckedFields({
                              email: false,
                              password: false,
                              avatar: false,
                            });
                          }}
                        >
                          Reset
                        </Button>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box className={classes.innerContainerInputCheckbox}>
                    <Box className={classes.innerContainerInput}>
                      <Box className={classes.inputFieldCheckboxDiv}>
                        <Box className={classes.inputFieldDiv}>
                          <TextField
                            id="user-email"
                            type="text"
                            label="Email"
                            aria-label="email"
                            className={classes.inputField}
                            fullWidth
                            variant="standard"
                            value={fields.email}
                            onChange={
                              e => onChange(setFields, 'email', e.target.value)
                            }
                          />
                        </Box>
                      </Box>
                      <Box className={classes.inputFieldCheckboxDiv}>
                        <Box className={classes.inputFieldDiv}>
                          <TextField
                            id="user-password"
                            type="password"
                            label="New Password"
                            aria-label="password"
                            className={classes.inputField}
                            fullWidth
                            variant="standard"
                            value={fields.password}
                            onChange={
                              e => onChange(setFields, 'password', e.target.value)
                            }
                          />
                        </Box>
                      </Box>
                      <Box className={classes.uploadBtnDiv}>
                        <Box className={classes.uploadFileDiv}>
                          <Box className={classes.uploadFileInputDiv}>
                            {/* Upload Button Boilerplate */}                          
                            {/* https://material-ui.com/components/buttons/ */}
                            <input
                              accept="image/*"
                              className={classes.uploadBtnInput}
                              id="upload-btn-html"
                              type="file"
                              onChange={updateAvatarFile}
                            />
                            <Tooltip title="Upload Avatar">
                              <label htmlFor="upload-btn-html">
                                <Button
                                  variant="contained"
                                  color="primary"
                                  component="span"
                                >
                                  Upload
                                </Button>
                              </label>
                            </Tooltip>
                          </Box>
                          <Box className={classes.uploadFileTextDiv}>
                            <Typography
                              align="left"
                              variant="body2"
                              color="textSecondary"
                            >
                              {avatarFilename}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box className={classes.innerContainerCheck}>
                      <FormControl component="fieldset" className={classes.formControlCheckbox}>
                        <FormLabel component="legend" className={classes.formControlLegend}>
                          Change Items
                        </FormLabel>
                        <FormGroup>
                          <Tooltip title="Change Email" placement="bottom">
                            <FormControlLabel
                              className={classes.formControlCheckboxLabel}
                              control={
                                <Checkbox
                                  checked={checkedFields.email}
                                  onChange={(e) => {
                                    handleCheckboxChange(e, "email")
                                  }}
                                  name="email"
                                />
                              }
                              label="Email"
                            />
                          </Tooltip>
                          <Tooltip title="Change Password" placement="bottom">
                            <FormControlLabel
                              className={classes.formControlCheckboxLabel}
                              control={
                                <Checkbox
                                  checked={checkedFields.password}
                                  onChange={(e) => {
                                    handleCheckboxChange(e, "password")
                                  }}
                                  name="password"
                                />
                              }
                              label="Password"
                            />
                          </Tooltip>
                          <Tooltip title="Change Avatar" placement="bottom">
                            <FormControlLabel
                              className={classes.formControlCheckboxLabel}
                              control={
                                <Checkbox
                                  checked={checkedFields.avatar}
                                  onChange={(e) => {
                                    handleCheckboxChange(e, "avatar")
                                  }}
                                  name="avatar"
                                />
                              }
                              label="Avatar"
                            />
                          </Tooltip>
                        </FormGroup>
                      </FormControl>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <br />
            <br />
            <UserSettingsDialog
              open={openSettingsDialog}
              handleClose={handleCloseSettingsDialog}
              itemsChecked={itemsToChange}
              reqBody={reqBody}
            />
          </Box>
        }
      </Container>
    </Container>
  )
}

export default UserSettings;
