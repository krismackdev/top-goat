import React from 'react'
import { Outlet } from 'react-router-dom'
import { AuthPage } from '../../pages'

interface PrivateRouteProps {
  user: any
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ user }) => {
  return user ? <Outlet /> : <AuthPage />
}

export default PrivateRoute
