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
// props as state handlers, and a relevant listing id. The user is promtped
// whether they would like to confirm the deletion of a particular listing,
// and upon confirmation an API DELETE request is sent.
const UserSettingsDialog = ({ open, handleClose, itemsChecked, reqBody }) => {
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const baseUrl = context.baseUrl;
  const [authMeFetch, setAuthMeFetch] = React.useState(null);
  const [authMeInfo, setAuthMeInfo] = context.authMeInfo;
  const history = useHistory();
  const [loadingClose, setLoadingClose] = React.useState('done');

  console.log('reqbody is:', reqBody);

  React.useEffect(() => {
    async function setupGetUserId () {
      await fetchAuthMe(baseUrl, token, setAuthMeFetch);
    }
    setupGetUserId();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        // notify user listing creation was successful
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
        error.response?.data.message !== undefined
          ? errorText = error.response.data.message
          : errorText = 'Bad request'
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
                <ListItemText>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </ListItemText>
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
