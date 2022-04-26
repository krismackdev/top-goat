import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { LogInPage } from '../../pages'

interface PrivateRouteProps {
  user: any
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ user }) => {
  return user ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute
