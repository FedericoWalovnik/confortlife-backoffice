import React, {
  useState,
  createContext,
  useContext
} from 'react'

export const NotificationsContext = createContext()

export function useNotificationsContext() {
  return useContext(NotificationsContext)
}

export const NotificationsProvider = ({ children }) => {
  const [openNotification, setOpenNotification] =
    useState(false)
  const [textNotification, setTextNotification] = useState(
    'Error en el servidor, contactar a soporte'
  )
  const [severityNotification, setseverityNotification] =
    useState('error')

  return (
    <NotificationsContext.Provider
      value={{
        openNotification,
        setOpenNotification,
        textNotification,
        setTextNotification,
        severityNotification,
        setseverityNotification
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}
