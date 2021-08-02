import React from 'react';
import BookitLogo from '../assets/bookit-logo.png';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { StoreContext } from '../utils/store';
import {
  makeStyles,
  Container,
  Button,
  Box,
  TextField,
  Typography,
  Divider,
  FormControl,
  Tooltip,
  Input,
  InputLabel,
  Select,
  Chip,
  MenuItem,
  IconButton,
  FormHelperText,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import axios from 'axios';
import { toast } from 'react-toastify';

// Page styling used on the Register page and its subcomponents
const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: '50px',
    paddingBottom: '50px',
    alignItems: 'center',
    color: 'white',
    width: '100%',
    backgroundColor: theme.palette.background.default,
  },
  bookitTitle: {
    margin: theme.spacing(2),
    color: '#D0D0D0',
  },
  titleDivider: {
    height: '2px',
    backgroundColor: '#648dae',
  },
  logo: {
    display: 'flex',
    margin: '20px',
    justifyContent: 'center',
    maxHeight: '250px',
    maxWidth: '266px',
  },
  img: {
    maxHeight: '250px',
    maxWidth: '266px',
  },
  inputFieldsDiv: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  box: {
    margin: theme.spacing(1),
  },
  buttonRegister: {
    margin: theme.spacing(1),
    width: '12em',
  },
  button: {

  },
  toasty: {
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  chipsMenu: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chipItem: {
    margin: 1,
  },
  categoriesFormDiv: {
    display: 'flex',
    flexDirection: 'row',
    height: '6em',
    alignItems: 'center',
    margin: '1em 0em',
  },
  categoriesForm: {
    marginRight: '0.25em',
    width: '18em',
  },
  clearBtnDiv: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '1em',
  },
}));

// class used for the Toastify error component styling
const toastErrorStyle = {
  backgroundColor: '#cc0000',
  opacity: 0.8,
  textAlign: 'center',
  fontSize: '18px'
};

const resourceCategoriesList = [
  { key: 0, value: 'Entertainment'},
  { key: 1, value: 'Sport'},
  { key: 2, value: 'Accommodation'},
  { key: 3, value: 'Healthcare'},
  { key: 4, value: 'Other'},
];

// The Register page prompts the user to enter their email, password and name,
// which are all validated upon input. Appropriate error messages are shown
// using Toastify when incorrect input is detected, or if invalid details
// are submitted. If a user does have an account, a button exists
// 'Back to Login' which takes the user to the Login page allowing them to
// log into their existing account.
const Register = () => {
  // context variables used throughout the page
  const context = React.useContext(StoreContext);
  const baseUrl = context.baseUrl;
  const history = useHistory();
  // useForm hook comes from react-hook-form, which handles user input
  // and controls form submission
  const { handleSubmit, control } = useForm();
  const onSubmit = (data) => {
    let categoriesFlat = resourceCategories.join(',').toLowerCase();
    // Check for empty fields
    if (categoriesFlat === null || categoriesFlat === '') {
      toast.error(
        'Please enter one or more categories', {
          position: 'top-right',
          hideProgressBar: true,
          style: toastErrorStyle
        }
      );      
    } else if (data.email === '') {
      toast.error(
        'Please enter your Email address', {
          position: 'top-right',
          hideProgressBar: true,
          style: toastErrorStyle
        }
      );
    } else if (data.password === '') {
      toast.error(
        'Please enter your Password', {
          position: 'top-right',
          hideProgressBar: true,
          style: toastErrorStyle
        }
      );
    } else if (data.name === '') {
      toast.error(
        'Please enter your Name', {
          position: 'top-right',
          hideProgressBar: true,
          style: toastErrorStyle
        }
      );
    } else {
      // Post a register request
      axios({
        method: 'POST',
        url: `${baseUrl}/users`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
          email: data.email,
          password: data.password,
          username: data.username,
          user_description: categoriesFlat,
        }
      })
        .then((response) => {
          toast.success(
            'Successfully signed up to BookIt', {
              position: 'top-right',
              hideProgressBar: true,
              style: {
                opacity: 0.8,
                textAlign: 'center',
                fontSize: '18px'
              }
            }
          );
          // navigate to the Login screen
          history.push('/login');
        })
        .catch((error) => {
          let errorText = '';
          if (error.response?.data.error !== undefined) {
            errorText = error.response.data.error;
          } else if (error.response?.data.message !== undefined) {
            errorText = error.response.data.message;
          } else {
            errorText = 'Invalid input';
          }
          toast.error(
            errorText, {
              position: 'top-right',
              hideProgressBar: true,
              style: toastErrorStyle
            }
          );
        })
    }
  };
  const backButtonLogin = () => {
    // redirect user to the Login page
    history.push('/login');
  };

  const [resourceCategories, setResourceCategories] = React.useState([]);
  // handles the changing of listing category
  const handleChangeCategory = (event) => {
    setResourceCategories(event.target.value);
  };
  const handleDeleteCategoryChip = (categoryName) => () => {
    setResourceCategories(
      (categories) => categories.filter((category) => category !== categoryName)
    );
  };
  const handleClearResourceCategories = () => {
    setResourceCategories([]);
  };

  // classes used for Material UI component styling
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Box className={classes.logo}>
        <Tooltip title="BookIt" aria-label="bookit logo">
          <img className={classes.img} src={BookitLogo} alt="Bookit Logo" />
        </Tooltip>
      </Box>
      <br />
      <Box className={classes.bookitTitle}>
        <Typography variant="h3">
          BookIt
        </Typography>
        <Divider className={classes.titleDivider} />
        <Typography variant="h5">
          Sign Up
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className={classes.inputFieldsDiv}>
          <Box className={classes.box}>
            <FormControl required>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Email"
                    color="primary"
                    {...field}
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box className={classes.box}>
            <FormControl required>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    type="password"
                    label="Password"
                    color="primary"
                    {...field}
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box className={classes.box}>
            <FormControl required>
              <Controller
                name="username"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Username"
                    color="primary"
                    {...field}
                  />
                )}
              />
            </FormControl>
          </Box>
        </Box>
        <Box className={classes.categoriesFormDiv}>
          <FormControl required className={classes.categoriesForm}>
            <InputLabel id="mutiple-categories-label">
              User Resource Categories
            </InputLabel>
            <Select
              labelId="mutiple-categories-label"
              id="mutiple-categories"
              multiple
              value={resourceCategories}
              onChange={handleChangeCategory}
              input={<Input id="select-multiple-categories" />}
              renderValue={(selected) => (
                <div className={classes.chipsMenu}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      className={classes.chipItem}
                      onMouseDown={(event) => {
                        event.stopPropagation();
                      }}
                      onDelete={handleDeleteCategoryChip(value)}
                    />
                  ))}
                </div>
              )}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: '16em',
                    width: '16em',
                  },
                },
              }}
            >
              {resourceCategoriesList.map((category) => (
                <MenuItem key={category.key} value={category.value}>
                  {category.value}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Required - one or more
            </FormHelperText>
          </FormControl>
          <Box className={classes.clearBtnDiv}>
            <Tooltip title={'Clear Categories'} aria-label={'delete'}>
              <IconButton
                id={'clear-menu-button'}
                color={'default'}
                className={classes.button}
                size="small"
                onClick={() => {
                  handleClearResourceCategories()
                }}
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <br />
        <Tooltip title="Sign Up" aria-label="sign up">
          <Button
            className={classes.buttonRegister}
            variant="outlined" color="primary" type="submit"
          >
            Sign Up
          </Button>
        </Tooltip>
      </form>



      <Box className={classes.box}>
        <Tooltip title="Back to Login" aria-label="back to login">
          <Button
            className={classes.buttonRegister}
            variant="outlined" color="default" onClick={backButtonLogin}
          >
            Back to Login
          </Button>
        </Tooltip>
      </Box>
    </Container>
  )
}

export default Register;
