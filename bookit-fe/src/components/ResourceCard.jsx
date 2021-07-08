import React from 'react';
import PropTypes from 'prop-types';
import { StoreContext } from '../utils/store';
import PlaceholderImage from '../assets/mountaindawn.png';
import CustomButton from './CustomButton';
import {
  Tooltip,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  Typography,
  Box,
  Link,
  IconButton,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowRight from '@material-ui/icons/ArrowRight';
import RoomIcon from '@material-ui/icons/Room';
import axios from 'axios';

// The ResourceCard component is a subcomponent of representing a resource
// and contains various information about a particular resource.
// The contents include a title, default thumbnail image, resource owner,
// address and brief description and relevant interaction buttons.
const ResourceCard = (
  {
    resource, owner, history, classes, handleClickOpen
  }) => {
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const baseUrl = context.baseUrl;
  const currPage = context.pageState[0];
  const user = context.username[0];
  const [availabilities, setAvailabilities] = React.useState([]);

  React.useEffect(() => {
    async function fetchAvailabilities () {
      try {
        const response = await axios({
          method: 'GET',
          url: `${baseUrl}/availabilities?listing_id=${resource.listing_id}`,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": `JWT ${token}`,
          },
        })

        console.log(response);

        await setAvailabilities(response.data.availabilities);

      } catch(error) {
        
        console.log(error.response);

        await setAvailabilities([]);
      }
    }
    fetchAvailabilities();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
            <Link
              component={RouterLink}
              to={`/profile/${resource.username}`}
            >
              {resource.username}
            </Link>
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
        <Box className={classes.locationDiv}>
          <RoomIcon className={classes.locationIcon} />
          <Typography paragraph align="left" variant="caption" component="p">
            {resource.address}
          </Typography>
        </Box>
      </CardContent>

      <CardContent>
        <Typography paragraph align="left" variant="body2" color="textSecondary" component="p">
          {resource.description}
        </Typography>
      </CardContent>

      <CardContent className={classes.resourceCardCentered}>
        <Typography variant="overline" align="center" color="textPrimary" component="p">
        Availabilities: {availabilities.length}
        </Typography>
      </CardContent>

      <CardActions className={user === owner ? classes.resourceCardActions : classes.resourceCardCentered}>
        <Box>
          <CustomButton
            title={'View Listing'}
            ariaLabel={'listing'}
            id={'resource-card-listing-button'}
            variant={'contained'}
            color={'primary'}
            className={classes.button}
            endIcon={<ArrowRight />}
            onClick={() => {
              history.push({
                pathname: `/listings/${resource.listing_id}`,
                state: {
                  givenId: parseInt(resource.listing_id),
                  resource: resource,
                  availabilities: availabilities,
                }
              })
            }}
          />
        </Box>

        {
          user === owner &&
          <Box>
            <Tooltip title={'Edit'} aria-label={'edit'}>
              <IconButton
                id={'resource-card-edit-button'}
                color={'primary'}
                className={classes.button}
                onClick={() => {
                  history.push({
                    pathname: `/listings/edit/${resource.listing_id}`,
                    state: {
                      givenId: parseInt(resource.listing_id),
                      prevPage: currPage,
                    }
                  })
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={'Delete'} aria-label={'delete'}>
              <IconButton
                id={'resource-card-delete-button'}
                color={'secondary'}
                className={classes.button}
                onClick={() => handleClickOpen(resource.listing_id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
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
