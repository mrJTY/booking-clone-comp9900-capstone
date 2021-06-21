import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#90caf9'
    },
    secondary: {
      main: '#f48fb1'
    }
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
