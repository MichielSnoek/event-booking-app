import React from 'react';
import {BrowserRouter, Switch, Redirect, Route} from 'react-router-dom';
import AuthPage from './pages/Auth'
import BookingsPage from './pages/Bookings'
import EventsPage from './pages/Events'
import MainNavigation from './components/Navigation/MainNavigation'
import './App.css';

function App() {
  return (
   <BrowserRouter>
   <React.Fragment>
      <MainNavigation/>
      <main className="main-content">
      <Switch>
            <Redirect exact from="/" to="/auth"/>
            <Route exact path="/auth" component={AuthPage} />
            <Route path="/events" component={EventsPage}/>
            <Route path="/bookings" component={BookingsPage}/>
          </Switch>
      </main>  
      </React.Fragment>
   </BrowserRouter>

  );
}

export default App;
