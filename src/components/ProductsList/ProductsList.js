import React, { useState, useEffect } from 'react'
import SnackbarMessage from '../SnackbarMessage/SnackbarMessage'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import { useProductsContext } from '../../context/ProductsContext'
import { useNotificationsContext } from '../../context/NotificationsContext'

import config from '../../config.js'

import './ProductsList.scss'

export default function BasicTable() {
  const {
    getProducts,
    productList,
    getProduct,
    openProductForm,
    setOpenProductForm,
    setOperation
  } = useProductsContext()

  const { setOpenNotification } = useNotificationsContext()

  const [openErrorAlert, setOpenErrorAlert] =
    useState(false)

  const handleClickEdit = async productId => {
    try {
      setOperation('edit')
      await getProduct(productId)
      setOpenProductForm(!openProductForm)
      getProducts()
    } catch (error) {
      setOpenNotification(true)
    }
  }

  const handleClickDelete = async productId => {
    try {
      setOpenErrorAlert(false)
      await fetch(
        `${config.url}/api/deleteProduct/${productId}`,
        {
          method: 'DELETE'
        }
      )
      getProducts()
    } catch (error) {
      setOpenNotification(true)
    }
  }

  useEffect(() => {
    console.log('productList changed')

    getProducts()
  }, [])

  return (
    <div className="ProductList">
      <SnackbarMessage
        openProp={openErrorAlert}
        message="Error de servidor, contactar a soporte"
        severity="error"
      />
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Categoria</TableCell>
              <TableCell align="right">
                Descripcion
              </TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Imagen</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productList.length <= 0 && (
              <TableRow>
                <TableCell>Cargando...</TableCell>
              </TableRow>
            )}
            {productList.map(row => (
              <TableRow
                key={row.id}
                sx={{
                  '&:last-child td, &:last-child th': {
                    border: 0
                  }
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                >
                  {row.title}
                </TableCell>
                <TableCell align="right">
                  {row.category}
                </TableCell>
                <TableCell
                  align="right"
                  className="ProductList__description"
                >
                  {row.description}
                </TableCell>
                <TableCell align="right">
                  {row.price}
                </TableCell>
                <TableCell align="right">
                  <img
                    className="productList__img"
                    src={row.image}
                    alt={row.title}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  className="ProductList__edit-button"
                >
                  <FontAwesomeIcon
                    icon={faPen}
                    onClick={() => handleClickEdit(row.id)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() =>
                      handleClickDelete(row.id)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
