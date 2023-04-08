import React, { useState, useEffect } from 'react'
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
  const [showImgInput, setShowImgInput] = useState(true)

  const {
    productName,
    category,
    description,
    images,
    id,
    price,
    setProductName,
    setCategory,
    setDescription,
    setImages,
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
    setImages([])
    setDescription('')
    setPrice(0)
  }

  const sendRequest = async (imagesDownloadURL = []) => {
    const order = {
      id: operation === 'create' ? uuidv4() : id,
      category: category,
      description: description,
      images: imagesDownloadURL,
      price: price ? price : 0,
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

  const getImgUrl = async img => {
    const storageRef = ref(storage, `files/${img.name}`)
    const uploadTask = uploadBytesResumable(storageRef, img)
    console.log(img, storageRef, uploadTask)

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        snapshot => {},
        error => {
          console.log('error', error)
          reject(error)
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(
              uploadTask.snapshot.ref
            )
            console.log(downloadURL)
            resolve(downloadURL)
          } catch (error) {
            reject(error)
          }
        }
      )
    })
  }

  const saveProduct = async () => {
    let imagesUrl = []

    if (images.length) {
      console.log(images)
      imagesUrl = await Promise.all(
        images.map(async img => {
          return {
            id: img.id,
            name: img.name,
            url: img.url
              ? img.url
              : await getImgUrl(img.file)
          }
        })
      )
      sendRequest(imagesUrl)
    } else {
      sendRequest()
    }

    await getProducts()
    handleClose()
  }

  const addPendingImage = e => {
    const newImg = {
      id: Date.now(),
      name: e.target.files[0].name,
      preview: URL.createObjectURL(e.target.files[0]),
      file: e.target.files[0]
    }

    setImages([...images, newImg])
  }

  const removePendingImage = id => {
    const updatedItems = images.filter(
      item => item.id !== id
    )

    setImages(updatedItems)
  }

  useEffect(() => {
    images.length < 4
      ? setShowImgInput(true)
      : setShowImgInput(false)
  }, [images])

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
          {images.map(img => (
            <div
              className="CrudActions__preview"
              key={img.id}
            >
              <img
                src={img.preview ? img.preview : img.url}
                alt={img.name}
              />
              <p className="CrudActions__preview-text">
                {img.name}
              </p>
              <p
                className="CrudActions__preview-delete"
                onClick={() => removePendingImage(img.id)}
              >
                x
              </p>
            </div>
          ))}
          {showImgInput ? (
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
              onChange={e => addPendingImage(e)}
            />
          ) : (
            <></>
          )}
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
