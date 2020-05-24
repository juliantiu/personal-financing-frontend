import React, { useCallback, useContext, useState } from "react";
import { withRouter, Redirect } from "react-router";

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';

import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';

import app from "../../firebase";

import { AuthContext } from "../../contexts/AuthState";

const Acess = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = useCallback(
    async () => {
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email, password);
        setInvalid(false);
        history.push('/');
      } catch (error) {
        setInvalid(true);
        throw error;
      }
    },
    [history, email, password, setInvalid]
  );

  const handleRegisterChange = () => {
    setEmail('');
    setPassword('');
    setInvalid(false);
    setIsRegister(!isRegister);
  }

  const handleRegister = useCallback(
    async () => {
      try {
        await app
          .auth()
          .createUserWithEmailAndPassword(email, password);
        history.push('/');
      }
      catch(error){
        alert('Error signing up with email and password');
      }
    },
    [history, email, password]
  )

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <Container fluid="true">
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className="login-container"
      >
        <Grid item>
          <div className="login-banner-container">
            <div className="login-banner">
              <Typography variant="h4">Personal Financing</Typography>
            </div>
          </div>
          <Paper elevation={3} className="login-body">
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              className="login-body-row"
            >
              <Grid item xs={8}>
                <TextField
                  label="Email"
                  color="secondary"
                  value={email}
                  error={invalid}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleEmailChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              className="login-body-row"
            >
              <Grid item xs={8}>
                <FormControl error={invalid}>
                  <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
            { (invalid) &&
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid>
                  <Typography variant="caption" color="error">The username or password is incorrect</Typography>
                </Grid>
              </Grid>
            }
            <div className="login-register-buttons-container">
              <div className={ isRegister ? 'login-hide' : 'login-show' }>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  className="login-body-row"
                >
                  <Grid item>
                    <Button onClick={handleLogin} variant="outlined">
                      <Typography variant="body1">
                        Log in
                      </Typography>
                    </Button>
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography variant="caption">
                      Don't have an account with us?
                    </Typography>{' '}
                    <Button onClick={handleRegisterChange}>
                      <Typography variant="caption">
                        Register Now!
                      </Typography>
                    </Button>
                  </Grid>
                </Grid>
              </div>
              <div>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  className="login-body-row"
                >
                  <Grid item>
                    <Button variant="outlined">
                      <Typography onClick={handleRegister} variant="body1">
                        Submit
                      </Typography>
                    </Button>
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography variant="caption">
                      Already have an account with us?
                    </Typography>{' '}
                    <Button onClick={handleRegisterChange}>
                      <Typography variant="caption">
                        Login!
                      </Typography>
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default withRouter(Acess);