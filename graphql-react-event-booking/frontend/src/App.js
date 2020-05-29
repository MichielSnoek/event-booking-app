import React, {Component} from 'react';
import {BrowserRouter, Switch, Redirect, Route} from 'react-router-dom';
import AuthPage from './pages/Auth'
import BookingsPage from './pages/Bookings'
import EventsPage from './pages/Events'
import MainNavigation from './components/Navigation/MainNavigation'
import AuthService from './utils/AuthService';
import AuthContext from './context/auth-context'
import './App.css';

const auth = new AuthService();

let token, userId = null
if(auth.getUser() !== null ){
  token = auth.getUser().token
  userId = auth.getUser().userId
}
export default class App extends Component {
  state = {
    token: token,
    userId: userId
  }
  login = (token, userId, tokenExpiration) => {
    
    this.setState({ token, userId })
  }

  logout = () => {
    localStorage.removeItem('user');
    this.setState({token: null, userId: null})
  }

  render(){
    return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider 
          value={{
            token: this.state.token, 
            userId: this.state.userId, 
            login: this.login, 
            logout: this.logout}}>
            <MainNavigation/>
            <main className="main-content">
              <Switch>
                    {this.state.token && <Redirect exact from="/" to="/events"/>}
                    {this.state.token && <Redirect exact from="/auth" to="/events"/>}
                    {!this.state.token && <Route exact path="/auth" component={AuthPage} />}
                    <Route path="/events" component={EventsPage}/>
                    {this.state.token && <Route path="/bookings" component={BookingsPage}/>}
                    {!this.state.token && <Redirect exact to="/auth"/>}
              </Switch>
            </main>  
          </AuthContext.Provider>
        </React.Fragment>
    </BrowserRouter>

    );
  }
}
