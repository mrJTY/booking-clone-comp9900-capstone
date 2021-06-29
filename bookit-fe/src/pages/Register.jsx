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
  FormControl,
  Tooltip
} from '@material-ui/core';
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
  toasty: {
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  }
}));

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
    // Check for empty fields
    if (data.email === '') {
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
          username: data.username
        }
      })
        .then((response) => {

          console.log(response);

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
          error.response.data.error !== undefined
            ? errorText = error.response.data.error
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
  const backButtonLogin = () => {
    // redirect user to the Login page
    history.push('/login');
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
      <Box>
        <h3>BookIt Sign Up</h3>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className={classes.box}>
          <FormControl>
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
          <FormControl>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  type="password"
                  label="Password"
                  color="secondary"
                  {...field}
                />
              )}
            />
          </FormControl>
        </Box>
        <Box className={classes.box}>
          <FormControl>
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
        <br />
        <Tooltip title="Sign Up" aria-label="sign up">
          <Button
            className={classes.button}
            variant="outlined" color="secondary" type="submit"
          >
            Sign Up
          </Button>
        </Tooltip>
      </form>
      <Box className={classes.box}>
        <Tooltip title="Back to Login" aria-label="back to login">
          <Button
            className={classes.button}
            variant="outlined" color="primary" onClick={backButtonLogin}
          >
            Back to Login
          </Button>
        </Tooltip>
      </Box>
    </Container>
  )
}

export default Register;
