import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { VerifyEmailPage } from '../../pages'

interface PrivateRouteProps {
  user: any
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ user }) => {
  // if (user.emailVerified === false) {
  //   return <VerifyEmailPage />
  return user ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute
