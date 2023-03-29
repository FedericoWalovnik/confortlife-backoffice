import React, { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import './Home.scss'
import CrudActions from '../../components/CrudActions/CrudActions'
import ProductsList from '../../components/ProductsList/ProductsList'
import { ProductsProvider } from '../../context/ProductsContext'
import { NotificationsProvider } from '../../context/NotificationsContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (!user) {
        navigate('/')
      }
    })
  }, [])

  return (
    <div className="Home">
      <div className="Home__section">
        <NotificationsProvider>
          <ProductsProvider>
            <CrudActions />
            <ProductsList />
          </ProductsProvider>
        </NotificationsProvider>
      </div>
    </div>
  )
}

export default Home
