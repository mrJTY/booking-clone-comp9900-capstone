import React from 'react';
import PropTypes from 'prop-types';
import PlaceholderImage from '../assets/mountaindawn.png';
import CustomButton from './CustomButton';
import {
  // Box,
  Tooltip,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  Typography,
  // IconButton,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
// import AccountIcon from '@material-ui/icons/AccountCircle';

// The ResourceCard component is a subcomponent of representing a resource
// and contains various information about a particular resource.
// The contents include a title, default thumbnail image, resource owner,
// address and brief description and relevant interaction buttons.
const ResourceCard = (
  {
    resource, owner, history, classes, handleClickOpen
  }) => {
  return (
    <Card className={classes.cardRoot}>
      <CardHeader
        avatar={
          <Avatar aria-label="resource">
            {owner[0]}
          </Avatar>
        }
        title={
          <Typography variant="subtitle2" align="left" >
            {resource.listing_name}
          </Typography>
        }
        subheader={
          <Typography variant="subtitle2" color="textSecondary" align="left">
            {owner}
          </Typography>
        }
      />

      {/* {
        resource.thumbnail !== null &&
        <Tooltip title="resource Thumbnail"
          aria-label="resource thumbnail"
        >
          <CardMedia
            id="resource-card-thumbnail"
            className={classes.media}
            image={resource.thumbnail}
            alt="resource thumbnail"
          />
        </Tooltip>
      } */}

      {/* { */}
        {/* resource.thumbnail === null && */}
        <Tooltip title="Resource Thumbnail"
          aria-label="resource thumbnail"
        >
          <CardMedia
            id="resource-card-thumbnail"
            className={classes.media}
            image={PlaceholderImage}
            alt="Placeholder image"
          />
        </Tooltip>
      {/* } */}

      <CardContent>
        <Typography paragraph align="left" variant="body2" color="textSecondary" component="p">
          {resource.description}
        </Typography>
      </CardContent>
      <CardActions>
        <CustomButton
          title={'Edit'}
          ariaLabel={'edit'}
          id={'resource-card-edit-button'}
          variant={'outlined'}
          color={'primary'}
          className={classes.button}
          startIcon={<EditIcon />}
          onClick={() => {
            history.push({
              pathname: `/listings/edit/${resource.listing_id}`,
              state: parseInt(resource.listing_id)
            })
          }}
        />
        <CustomButton
          title={'Delete'}
          ariaLabel={'delete'}
          id={'resource-card-delete-button'}
          variant={'outlined'}
          color={'secondary'}
          className={classes.button}
          startIcon={<DeleteIcon />}
          onClick={() => handleClickOpen(resource.listing_id)}
        />
      </CardActions>
    </Card>
  );
}

ResourceCard.propTypes = {
  resource: PropTypes.object.isRequired,
  owner: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  handleClickOpen: PropTypes.func.isRequired,
};

export default ResourceCard;
