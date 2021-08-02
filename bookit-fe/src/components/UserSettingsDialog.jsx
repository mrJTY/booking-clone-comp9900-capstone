import React from 'react';
import { StoreContext } from '../utils/store';
import { fetchAuthMe } from '../utils/auxiliary';
import { useHistory } from 'react-router-dom';
import {
  makeStyles,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  CircularProgress,
  Box,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';

const useStyles = makeStyles(() => ({
  btnProgWrapper: {
    position: 'relative',
  },
}));

const toastErrorStyle = {
  backgroundColor: '#cc0000',
  opacity: 0.8,
  textAlign: 'center',
  fontSize: '18px'
};

// The UserSettingsDialog component is a Material UI dialog wrapper which takes in
// props state handlers, particularly the items of interest to be changed,
// and the associated request body. The user is prompted whether they want to
// confirm the selected changes, and an API PUT request is sent.
const UserSettingsDialog = ({ open, handleClose, itemsChecked, reqBody }) => {
  // state variables
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const baseUrl = context.baseUrl;
  const [authMeFetch, setAuthMeFetch] = React.useState(null);
  const [authMeInfo, setAuthMeInfo] = context.authMeInfo;
  const history = useHistory();
  const [loadingClose, setLoadingClose] = React.useState('done');
  // initial dialog set up
  React.useEffect(() => {
    async function setupGetUserId () {
      await fetchAuthMe(baseUrl, token, setAuthMeFetch);
    }
    setupGetUserId();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // called upon clicking the confirm button - an API request is sent which
  // contains the reqBody prop as its body.
  const onSubmit = () => {
    axios({
      method: 'PUT',
      url: `${baseUrl}/users/${authMeFetch.user_id}`,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        "Authorization": `JWT ${token}`,
      },
      data: reqBody,
    })
      .then(() => {
        setLoadingClose('loading');
        // notify user modification was successful
        toast.success(
          `Successfully modified your User Account`, {
            position: 'top-right',
            hideProgressBar: true,
            style: {
              opacity: 0.8,
              textAlign: 'center',
              fontSize: '18px'
            }
          }
        );
        async function updateAuthMe () {
          await fetchAuthMe(baseUrl, token, setAuthMeInfo);
          history.push(`/profile/${authMeInfo.username}`);
          handleClose();
          setLoadingClose('done');
        }
        updateAuthMe();
      })
      .catch((error) => {
        let errorText = '';
        if (error.response.data.error !== undefined) {
          errorText = error.response.data.error;
        } else if (error.response.data.message !== undefined) {
          errorText = error.response.data.message;
        } else {
          errorText = 'Bad request';
        }
        toast.error(
          errorText, {
            position: 'top-right',
            hideProgressBar: true,
            style: toastErrorStyle
          }
        );
        handleClose();
      })
  };

  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="settings-dialog-title"
      aria-describedby="settings-dialog-description"
    >
      <DialogTitle id="settings-dialog-title">{`User Settings Changes`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="settings-dialog-description">
          {
            itemsChecked?.length === 1 &&
            `Are you sure you want to change the following item?`
          }
          {
            itemsChecked?.length > 1 &&
            `Are you sure you want to change the following items?`
          }          
          {
            itemsChecked?.length === 0 &&
            `Are you sure you want to change your account settings?`
          }
          {
            itemsChecked?.length > 0 &&
            <List dense>
            {
              itemsChecked.map((item) => (
              <ListItem
                key={item}
              >
                {
                  item === 'user_description' &&
                  <ListItemText>
                    {'Categories'}
                  </ListItemText>
                }
                {
                  item !== 'user_description' &&
                  <ListItemText>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </ListItemText>
                }
              </ListItem>
            ))}
            </List>
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {
          loadingClose === 'loading' &&
          <Box className={classes.btnProgWrapper}>
            <CircularProgress
              color="secondary"
              size={24}
              className={classes.buttonProgress}
            />
          </Box>
        }
        <Tooltip
          title={
            loadingClose !== 'loading'
              ? 'Confirm Changes'
              : ''
          }
        >
          <Button
            color="primary"
            onClick={() => {
              onSubmit();

            }}
            disabled={
              loadingClose !== 'loading'
              ? false
              : true           
            }
          >
            Confirm
          </Button>
        </Tooltip>
        <Tooltip
          title={
            loadingClose !== 'loading'
              ? 'Cancel'
              : ''
          }
        >
          <Button 
            onClick={handleClose}
            color="secondary"
            disabled={
              loadingClose !== 'loading'
              ? false
              : true
            }
          >
            Cancel
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  )
}

UserSettingsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  itemsChecked: PropTypes.array.isRequired,
  reqBody: PropTypes.object.isRequired,
};

export default UserSettingsDialog;
