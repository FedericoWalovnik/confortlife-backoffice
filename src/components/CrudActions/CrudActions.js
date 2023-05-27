import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import storage from '../../firebaseConfig.js'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import './CrudActions.scss'
import { v4 as uuidv4 } from 'uuid'
import { useProductsContext } from '../../context/ProductsContext'

import config from '../../config.js'

const CrudActions = () => {
  const [showImgInput, setShowImgInput] = useState(true)
  const [crudError, setCrudError] = useState('')

  const {
    productName,
    category,
    description,
    images,
    id,
    price,
    destacado,
    setProductName,
    setCategory,
    setDescription,
    setImages,
    setPrice,
    setDestacado,
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

  const addDestacado = async productId => {
    if (destacado === 'superDestacado') {
      await fetch(`${config.url}/api/addSuperDestacado`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productId)
      })
    } else if (destacado === 'destacado') {
      await fetch(`${config.url}/api/addDestacado`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productId)
      })
    }
  }

  const sendRequest = async (imagesDownloadURL = []) => {
    const productId = operation === 'create' ? uuidv4() : id
    const order = {
      id: productId,
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
      await fetch(`${config.url}/api/editProduct/${order.id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      })
    }

    await addDestacado(productId)

    resetValues()
    await getProducts()
  }

  const getImgUrl = async img => {
    const storageRef = ref(storage, `files/${img.name}`)
    const uploadTask = uploadBytesResumable(storageRef, img)

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
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            console.log(downloadURL)
            resolve(downloadURL)
          } catch (error) {
            reject(error)
          }
        }
      )
    })
  }

  const isFormValid = () => {
    if (!productName.length || !category.length || images.length <= 0) {
      setCrudError('Debes completar los campos obligatorios')
      return false
    } else {
      setCrudError('')
      return true
    }
  }

  const saveProduct = async () => {
    let imagesUrl = []

    if (isFormValid()) {
      if (images.length) {
        imagesUrl = await Promise.all(
          images.map(async img => {
            return {
              id: img.id,
              name: img.name,
              url: img.url ? img.url : await getImgUrl(img.file)
            }
          })
        )
        sendRequest(imagesUrl)
      } else {
        sendRequest()
      }
      handleClose()
    }

    await getProducts()
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
    const updatedItems = images.filter(item => item.id !== id)

    setImages(updatedItems)
  }

  useEffect(() => {
    images.length < 4 ? setShowImgInput(true) : setShowImgInput(false)
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
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Nombre del producto"
            type="text"
            fullWidth
            required
            variant="outlined"
            value={productName}
            onChange={e => setProductName(e.target.value)}
          />
          <div className="CrudActions__category-select">
            <InputLabel id="category-label">Category *</InputLabel>

            <Select
              labelId="category-label"
              id="category"
              label="Categoria"
              value={category}
              required={true}
              onChange={e => setCategory(e.target.value)}
            >
              <MenuItem value="Colchones">Colchones</MenuItem>
              <MenuItem value="ColchonesEspuma">Colchones Espuma</MenuItem>
              <MenuItem value="ColchonesResortes">Colchones Resortes</MenuItem>
              <MenuItem value="Sommiers">Sommiers</MenuItem>
              <MenuItem value="PillowTop">Pillow Top</MenuItem>
              <MenuItem value="Confort">Confort</MenuItem>
              <MenuItem value="Almohadas">Almohadas</MenuItem>
              <MenuItem value="AlmohadonesOrtopedicos">Almohadones Ortopedicos</MenuItem>
              <MenuItem value="Mascotas">Mascotas</MenuItem>
              <MenuItem value="Confort">Confort</MenuItem>
              <MenuItem value="Accesorios">Accesorios</MenuItem>
            </Select>
          </div>

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
              <p className="CrudActions__preview-text">{img.name}</p>
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
          <div>
            <FormLabel id="demo-row-radio-buttons-group-label">Destacado</FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={destacado}
              // onChange={e => {
              //   setDestacado(e.target.value)
              // }}
            >
              <FormControlLabel
                value="noDestacado"
                control={<Radio />}
                label="No Destacado"
              />
              <FormControlLabel
                value="Destacado"
                control={<Radio />}
                label="Destacado"
              />
              <FormControlLabel
                value="superDestacado"
                control={<Radio />}
                label="Super Destacado"
              />
            </RadioGroup>
          </div>
          {crudError ? <p className="CrudActions__error">{crudError}</p> : <></>}
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
