import React from 'react'
import ReactDOM from 'react-dom/client'
// import AppSails from './AppSails.jsx'
import AppSocket from './AppSocket.jsx'
import Generaciones from './Generaciones.jsx'

// import App from './AppChat.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <AppSails /> */}
    <AppSocket />
    <Generaciones />
  </React.StrictMode>,
)
