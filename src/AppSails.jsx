import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { generarCoordenadaAleatoria, randomChoice } from './utils';

const initialLogin = {
  email: 'viviana.calva@unl.edu.ec',
  password: 'mayonesa12345',
  token: '',
};

const orderIDs = [
  '6678c15a7f3d37f08fec36fa',
  '6678c10f45a4c2a0b93ec03c',
  '66723338f04783fa6d6447f3',
];

const deliveryDriversIDs = [
  '6660b761e652e5236f600a20',
  '6660b89665085cd8765e349b',
];

const ORDERS = [
  { id: orderIDs[0], route: [], deliveryDriver: deliveryDriversIDs[0] },
  { id: orderIDs[1], route: [], deliveryDriver: deliveryDriversIDs[1] },
  { id: orderIDs[2], route: [], deliveryDriver: deliveryDriversIDs[0] },
];

function AppSails() {
  const [login, setLogin] = useState(initialLogin);
  const [orders, setOrders] = useState(ORDERS);
  const socketRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data: loginResponse } = await axios.post(`${BASEURL}/auth/login`, login);
      localStorage.setItem('token', loginResponse.token);
      setLogin({ ...login, token: loginResponse.token });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setOrders(ORDERS);

    // if (login.token) {
    socketRef.current = io(BASEURL, {
      transports: ['websocket'],
      // auth: {
      // token: login.token,
      // },
    });

    socketRef.current.on('allOrders', (orderRoute) => {
      console.log('Nueva ruta actualizada recibida:', orderRoute);

      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) =>
          order.id === orderRoute.id ? orderRoute : order
        );
        return updatedOrders;
      });
    });

    const updateRouteRandomly = () => {
      console.info("Enviando coordenada aleatoria...");

      socketRef.current.emit('updateOrderCoords', {
        orderId: randomChoice(orderIDs),
        coords: generarCoordenadaAleatoria(), // Función de generación de coordenadas aleatorias
      });
    };

    const interval = setInterval(updateRouteRandomly, 1000);

    return () => {
      clearInterval(interval);
      socketRef.current.disconnect();
    };
    // }
  }, []);

  return (
    <>
      <h1>Probando sockets</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={login.email}
          onChange={(e) => setLogin({ ...login, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={login.password}
          onChange={(e) => setLogin({ ...login, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
      <h2>Actualización órdenes</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {orders.map((order) => (
          <article
            key={order.id}
            style={{
              border: '1px solid deeppink',
              borderRadius: '10px',
              padding: '0.5rem',
              margin: '0.3rem',
            }}
          >
            <h3>Orden #{order.id} </h3>
            <p>{order.deliveryDriver}</p>
            <p>Ruta: {JSON.stringify(order.route)}</p>
          </article>
        ))}
      </div>
      <h2>ORDENES RECIBIDAS</h2>
    </>
  );
}

export default AppSails;
