import React, {
  useState,
  createContext,
  useContext
} from 'react'
import { useNotificationsContext } from './NotificationsContext'

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
  const [img, setImg] = useState({})
  const [id, setId] = useState({})

  const [price, setPrice] = useState('')

  const { setOpenNotification } = useNotificationsContext()

  const [operation, setOperation] = useState('create')

  const getProducts = async () => {
    try {
      const products = await fetch(`/api`)
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
        `/api/product/${productId}`
      )
      const productParsed = await product.json()
      setProductName(productParsed.title)
      setCategory(productParsed.category)
      setDescription(productParsed.description)
      setImg(productParsed.image)
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
        img,
        price,
        id,
        productList,
        setProductName,
        setCategory,
        setDescription,
        setImg,
        setPrice,
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
