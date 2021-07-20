import React from 'react';
import BookitLogo from '../assets/bookit-logo.png';
import { useHistory } from 'react-router-dom';
import {
  useForm,
  Controller,
} from 'react-hook-form';
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
  Tooltip
} from '@material-ui/core';
import axios from 'axios';
import { toast } from 'react-toastify';

// Page styling used on the Login page and its subcomponents
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
  box: {
    display: 'flex',
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
    width: '12em',
  },
  textarea: {
    color: '#648dae'
  },
  toasty: {
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  }
}));

// The Login page prompts the user to enter their email and password,
// which are both validated upon input. Appropriate error messages are shown
// using Toastify when incorrect input is detected, or if invalid details
// are submitted. If a user does not have an account, a button exists
// 'New User' which takes the user to the Register page allowing them to
// create a new account in order to log in successfully in the future.
const Login = () => {
  // context variables used throughout the page
  const context = React.useContext(StoreContext);
  const setToken = context.token[1];
  const setUsername = context.username[1];
  const baseUrl = context.baseUrl;
  const setPage = context.pageState[1];
  const history = useHistory();
  // class used for the Toastify error component styling
  const toastErrorStyle = {
    backgroundColor: '#cc0000',
    opacity: 0.8,
    textAlign: 'center',
    fontSize: '18px'
  };
  // useForm hook comes from react-hook-form, which handles user input
  // and controls form submission
  const { handleSubmit, control } = useForm();
  const onSubmit = (data) => {
    setUsername(data.username);
    // Check for empty fields
    if (data.username === '') {
      toast.error(
        'Please enter your Username', {
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
    } else {
      // Post a Login request
      axios({
        method: 'POST',
        url: `${baseUrl}/auth/login`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
          username: data.username,
          password: data.password
        }
      })
        .then((response) => {
          console.log(response)
          // store the authorization token
          setToken(response.data.accessToken);
          // navigate to the Home screen
          history.push('/home');
        })
        .catch((error) => {
          let errorText = '';
          error.response.data.message !== undefined
            ? errorText = error.response.data.message
            : errorText = 'Invalid input'
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
  // the useEffect hook simply sets the page variable to the login page itself
  React.useEffect(() => {
    setPage('/login');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const registerScreenButton = () => {
    // redirect user to the Register page
    history.push('/register');
  };
  // classes used for Material UI component styling
  const classes = useStyles();
  return (
    <Container className={classes.container}>
      <Box className={classes.logo}>
        <Tooltip title="Bookit" aria-label="bookit logo">
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
          Login
        </Typography>
      </Box>
      <br />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className={classes.box}>
          <FormControl>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label="Username"
                  {...field}
                />
              )}
            />
          </FormControl>
        </Box>
        <Box className={classes.box}>
          <FormControl>
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
        <br />
        <Tooltip title="Login" aria-label="log in">
          <Button
            className={classes.button}
            variant="outlined" color="primary" type="submit"
          >
            Login
          </Button>
        </Tooltip>
      </form>
      <Box className={classes.box}>
        <Tooltip title="New User" aria-label="new user">
          <Button
            className={classes.button}
            variant="outlined"
            color="secondary"
            onClick={registerScreenButton}
          >
            New User
          </Button>
        </Tooltip>
      </Box>
      <br />
    </Container>
  );
}

export default Login;
