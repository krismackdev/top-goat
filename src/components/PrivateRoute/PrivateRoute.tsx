import React from 'react'
import { Outlet } from 'react-router-dom'
import { LogInPage } from '../../pages'

interface PrivateRouteProps {
  user: any
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ user }) => {
  return user ? <Outlet /> : <LogInPage />
}

export default PrivateRoute
