import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

interface NotFoundPageProps {
  user: any
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ user }) => {
  let navigate = useNavigate()

  if (!user) {
    navigate('/login')
  }

  return (
    <>
      <h2>Page Not Found</h2>
    </>
  )
}

export default NotFoundPage
