import React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import storage from '../../firebaseConfig.js'
import {
  ref,
  getDownloadURL,
  uploadBytesResumable
} from 'firebase/storage'
import './CrudActions.scss'
import { v4 as uuidv4 } from 'uuid'
import { useProductsContext } from '../../context/ProductsContext'

import config from '../../config.js'

const CrudActions = () => {
  const {
    productName,
    category,
    description,
    img,
    id,
    price,
    setProductName,
    setCategory,
    setDescription,
    setImg,
    setPrice,
    openProductForm,
    setOpenProductForm,
    operation,
    setOperation,
    getProducts
  } = useProductsContext()

  const handleClickOpen = () => {
    setOperation('create')
    setOpenProductForm(true)
  }

  const handleClose = () => {
    setOpenProductForm(false)
    resetValues()
  }

  const resetValues = () => {
    setProductName('')
    setCategory('')
    setImg('')
    setDescription('')
    setPrice(0)
  }

  const sendRequest = async (downloadURL = img) => {
    const order = {
      id: operation === 'create' ? uuidv4() : id,
      category: category,
      description: description,
      image: downloadURL,
      price: price,
      title: productName
    }

    if (operation === 'create') {
      await fetch(`${config.url}/api/createProduct`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      })
    } else {
      await fetch(
        `${config.url}/api/editProduct/${order.id}`,
        {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(order)
        }
      )
    }

    resetValues()
    getProducts()
  }

  const saveProduct = async () => {
    if (img.name) {
      const storageRef = ref(storage, `files/${img.name}`)
      const uploadTask = uploadBytesResumable(
        storageRef,
        img
      )

      uploadTask.on(
        'state_changed',
        snapshot => {},
        error => {
          console.log('error', error)
        },
        async () => {
          await getDownloadURL(
            uploadTask.snapshot.ref
          ).then(downloadURL => {
            sendRequest(downloadURL)
          })
        }
      )
    } else {
      sendRequest()
    }

    await getProducts()
    handleClose()
  }

  return (
    <div>
      <div className="CrudActions__buttons">
        <Button
          variant="outlined"
          size="small"
          onClick={handleClickOpen}
        >
          Crear un nuevo producto
        </Button>
      </div>
      <Dialog
        open={openProductForm}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={'md'}
      >
        <DialogTitle>Guardar nuevo producto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Agregar un nuevo producto
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Nombre del producto"
            type="text"
            fullWidth
            variant="outlined"
            value={productName}
            onChange={e => setProductName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="category"
            label="Categoria"
            type="text"
            fullWidth
            variant="outlined"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Descripcion"
            type="text"
            fullWidth
            multiline
            variant="outlined"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="mainImage"
            label="Imagen"
            accept=".png, .jpg, .jpeg"
            type="file"
            fullWidth
            variant="outlined"
            required
            onChange={e => setImg(e.target.files[0])}
          />
          <TextField
            autoFocus
            margin="dense"
            id="price"
            label="Precio"
            type="number"
            variant="outlined"
            value={price}
            onChange={e => {
              setPrice(parseInt(e.target.value))
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={saveProduct}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CrudActions
