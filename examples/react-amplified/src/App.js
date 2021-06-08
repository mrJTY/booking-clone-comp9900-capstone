/* src/App.js */
import React from 'react'
import Amplify from 'aws-amplify'
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Components
import Home from './components/Home';
import Navigation from './components/Navigation';
import Songs from './components/Songs';
import Todo from './components/Todo';
import TravelDeals from './components/TravelDeals';

// For API endpoint
import awsExports from "./aws-exports";
// Auth component
import { withAuthenticator } from '@aws-amplify/ui-react'

// For API endpoint
Amplify.configure(awsExports);

const App = () => {
  // https://www.golangprograms.com/how-to-create-simple-react-router-to-navigate-multiple-pages.html
  return (
      <BrowserRouter>
        <div>
          <Navigation />
          <Switch>
            <Route path="/" component={Home} exact/>
              <Route path="/todo" component={Todo}/>
              <Route path="/songs" component={Songs}/>
              <Route path="/travel-deals" component={TravelDeals}/>
            <Route component={Error}/>
          </Switch>
        </div>
      </BrowserRouter>
  )
}
export default withAuthenticator(App)
