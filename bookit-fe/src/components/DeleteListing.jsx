import React from 'react';
import { StoreContext } from '../utils/store';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';

// The DeleteListing component is a Material UI dialog wrapper which takes in
// props as state handlers, and a relevant listing id. The user is promtped
// whether they would like to confirm the deletion of a particular listing,
// and upon confirmation an API DELETE request is sent.
const DeleteListing = ({ open, handleClose, listingId }) => {
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const baseUrl = context.baseUrl;
  const [updated, setUpdate] = context.updates;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">{'Delete Listing'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Deleting this Listing is irreversible. Are you sure you want to delete it?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          title="Delete"
          color="secondary"
          onClick={async () => {
            await axios({
              method: 'DELETE',
              url: `${baseUrl}/listings/${listingId}`,
              headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                "Authorization": `JWT ${token}`,
              },
            })
              .catch((error) => {
                let errorText = '';
                error.response.data.error !== undefined
                  ? errorText = error.response.data.error
                  : errorText = 'Invalid input'
                toast.error(
                  errorText, {
                    position: 'top-right',
                    hideProgressBar: true,
                    style: {
                      backgroundColor: '#cc0000',
                      opacity: 0.8,
                      textAlign: 'center',
                      fontSize: '18px'
                    }
                  }
                );
              })
            setUpdate(!updated);
            handleClose();
          }}
        >
          Delete
        </Button>
        <Button title="Cancel" onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

DeleteListing.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  listingId: PropTypes.number,
};

export default DeleteListing;
