import React, {
  useState,
  createContext,
  useContext
} from 'react'
import { useNotificationsContext } from './NotificationsContext'

import config from '../config.js'

export const ProductsContext = createContext()

export function useProductsContext() {
  return useContext(ProductsContext)
}

export const ProductsProvider = ({ children }) => {
  const [productList, setProductList] = useState([])
  const [openProductForm, setOpenProductForm] =
    useState(false)

  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  const [images, setImages] = useState([])

  const [id, setId] = useState({})

  const [price, setPrice] = useState('')
  const [destacado, setDestacado] = useState('noDestacado')

  const { setOpenNotification } = useNotificationsContext()

  const [operation, setOperation] = useState('create')

  const getProducts = async () => {
    try {
      const products = await fetch(`${config.url}/api`)
      const parsedProducts = await products.json()
      setProductList(parsedProducts)
    } catch (err) {
      console.error(err)
      setOpenNotification(true)
    }
  }

  const getProduct = async productId => {
    try {
      const product = await fetch(
        `${config.url}/api/product/${productId}`
      )
      const productParsed = await product.json()
      setProductName(productParsed.title)
      setCategory(productParsed.category)
      setDescription(productParsed.description)
      setImages(productParsed.images)
      setPrice(productParsed.price)
      setId(productParsed.id)
    } catch (error) {
      console.error('error prossesing the product')
    }
  }

  return (
    <ProductsContext.Provider
      value={{
        productName,
        category,
        description,
        images,
        price,
        destacado,
        id,
        productList,
        setProductName,
        setCategory,
        setDescription,
        setImages,
        setPrice,
        setDestacado,
        getProducts,
        getProduct,
        openProductForm,
        setOpenProductForm,
        operation,
        setOperation
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}
