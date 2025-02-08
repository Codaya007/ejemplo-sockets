import React from 'react'
import ReactDOM from 'react-dom/client'
// import ChannelsDrivers from './ChannelsDrivers'
import Channels from './Channels.jsx'
// import AppSails from './AppSails.jsx'
// import AppSocket from './AppSocket.jsx'
import Generaciones from './Generaciones.jsx'
// import TestEvents from './TestEvents.jsx'

// import App from './AppChat.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <AppSails /> */}
    {/* <AppSocket /> */}
    {/* <TestEvents /> */}
    {/* <ChannelsDrivers /> */}
    <Channels />
    <Generaciones />
  </React.StrictMode>,
)
