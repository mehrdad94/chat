import React from 'react'
import {
  Route,
  Redirect
} from 'react-router-dom'
import { getToken } from '../../api'

export default function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        getToken() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  )
}
