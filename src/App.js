import React from 'react'
import './App.scss'
import * as $ from 'jquery'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

// components
import PrivateRoute from './components/PrivateRoute/PrivateRoute'

// views
import Login from './views/Login/Login'
import SignUp from './views/SignUp/SignUp'
import Chat from './views/Chat/Chat'

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login">
            <Login/>
          </Route>
          <Route path="/signup">
            <SignUp/>
          </Route>
          <PrivateRoute path="/">
            <Chat/>
          </PrivateRoute>
        </Switch>
      </Router>
    )
  }
}

export default App
