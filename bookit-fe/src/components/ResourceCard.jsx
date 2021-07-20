import React from 'react';
import PropTypes from 'prop-types';
import { StoreContext } from '../utils/store';
import { useHistory } from "react-router-dom";
import PlaceholderImage from '../assets/mountaindawn.png';
import CustomButton from './CustomButton';
import {
  makeStyles,
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
import Rating from '@material-ui/lab/Rating';
import axios from 'axios';

// Page styling used on the ResourceCard component
const useStyles = makeStyles((theme) => ({
  cardRoot: {
    maxWidth: 345,
    minWidth: 345,
  },
  button: {
    margin: theme.spacing(1),
    paddingBottom: '8px',
  },
  resourceBorder: {
    margin: theme.spacing(1),
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  resourceCardActions: {
    justifyContent: 'space-between',
  },
  resourceCardCentered: {
    justifyContent: 'center',
    padding: 0,
  },
  resourceCardRating: {
    display: 'flex',
    justifyContent: 'center',
    padding: 0,
  },
  resourceCardDescDiv:{
    maxHeight: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '128px',
  },
  resourceCardDesc:{
    maxHeight: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: "-webkit-box",
    "-webkit-line-clamp": 4,
    "-webkit-box-orient": "vertical",
  },  
  locationDiv: {
    display: 'flex',
    flexDirection: 'row',
    maxHeight: '40px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  locationIcon: {
    paddingRight: '4px',
    width: '16px',
    height: '16px',
  },
  locationText: {
    height: '56px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
  },  
}));

// The ResourceCard component is a subcomponent representing a resource
// and contains various information about a particular resource.
// The contents include a title, default thumbnail image, resource owner,
// address and brief description and relevant interaction buttons.
const ResourceCard = (
{
  resource, owner, parentPage, handleClickOpen
}) => {
  const context = React.useContext(StoreContext);
  const token = context.token[0];
  const baseUrl = context.baseUrl;
  const currPage = context.pageState[0];
  const user = context.username[0];
  const history = useHistory();
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
        await setAvailabilities(response.data.availabilities);
      } catch(error) {

        console.log(error.response);

        await setAvailabilities([]);
      }
    }
    fetchAvailabilities();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const classes = useStyles();

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
          <Typography className={classes.locationText} paragraph align="left" variant="caption" component="p">
            {resource.address}
          </Typography>
        </Box>
      </CardContent>

      <CardContent className={classes.resourceCardRating}>
        <Tooltip title={`Average rating: ${resource.avg_rating}`} placement="top" >
          <div>
            <Rating name="avg-rating" defaultValue={resource.avg_rating} precision={0.1} readOnly />
          </div>
        </Tooltip>
      </CardContent>

      <CardContent className={classes.resourceCardDescDiv}>
        <Typography className={classes.resourceCardDesc} paragraph align="left" variant="body2" color="textSecondary" component="p">
          {resource.description}
        </Typography>
      </CardContent>

      <CardContent className={classes.resourceCardCentered}>
        <Typography variant="overline" align="center" color="textPrimary" component="p">
          Availabilities: {availabilities.length}
        </Typography>
      </CardContent>

      <CardActions
        className={
          user === resource.username && parentPage === '/mylistings' ?
            classes.resourceCardActions :
            classes.resourceCardCentered
        }
      >
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
                  givenListingId: parseInt(resource.listing_id),
                }
              })
            }}
          />
        </Box>

        {
          user === resource.username &&
          parentPage !== '/search' &&
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
                      givenListingId: parseInt(resource.listing_id),
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
  parentPage: PropTypes.string.isRequired,
  handleClickOpen: PropTypes.func,
};

export default ResourceCard;
