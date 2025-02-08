import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import "./App.css";
import { generarCoordenadaAleatoria, randomChoice } from './utils';
import { BASE_URL } from "./constants/index.js"


// const BASEURL = "http://localhost:3000";
const initialLogin = {
  "email": "sergio.molina@lumation.co",
  "password": "mayonesa12345",
  token: ""
};

function AppSocket() {
  const [motoristas, setMotoristas] = useState([]);
  const [login, setLogin] = useState(initialLogin);
  const socketRef = useRef(null);

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const { data: loginResponse } = await axios.post("http://tacobell-delivery-api-dev-env.us-east-2.elasticbeanstalk.com/auth/login", login);

      localStorage.setItem("token", loginResponse.token);
      setLogin({ ...login, token: loginResponse.token });
    } catch (error) {
      console.log(error.message);
    }
  }

  const getDeliveryDrivers = async () => {
    try {
      const { data: deliveryDriverResponse } = await axios.get(
        "http://tacobell-delivery-api-dev-env.us-east-2.elasticbeanstalk.com/location/map/deliverydrivers",
        {
          headers: {
            Authorization: `Bearer ${login.token}`
          }
        });

      deliveryDriverResponse.forEach(e => {
        e.coords = e.coords ? [e.lastCoord] : [];
      });

      setMotoristas(deliveryDriverResponse);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    if (login.token) {
      getDeliveryDrivers();
    }
  }, [login.token]);

  useEffect(() => {
    if (login.token) {
      socketRef.current = io(BASE_URL, {
        transports: ['websocket'],
        auth: {
          token: login.token
        }
      });

      socketRef.current.on('allDeliveryDrivers', (received) => {
        console.log('Nueva ruta actualizada recibida:', received);
        const { deliveryDriver, coords } = received;

        setMotoristas(prevMt => {
          return prevMt.map(mt => {
            if (mt.id === deliveryDriver) {
              mt.lastCoord = coords;
              mt.coords.push(coords);
            }
            return mt;
          });
        });
      });

      socketRef.current.on('notifications6602696efc7df7b2bf5e8399', (notification) => {
        console.log('Notificación recibida:', notification);
        // Aquí puedes manejar la notificación recibida
      });

      socketRef.current.on('ordersDeliveryDriver', (order) => {
        console.log('Orden asignada recibida:', order);
        // Aquí puedes manejar la orden asignada
      });

      socketRef.current.on('error', (err) => {
        console.error('Error de Socket.IO:', err);
      });

      const updateRouteRandomly = () => {
        const driverId = randomChoice(motoristas.map(m => m.id));
        const coords = generarCoordenadaAleatoria();

        socketRef.current.emit('updateDriverCoord', {
          deliveryDriver: driverId,
          coords
        });
      };

      const interval = setInterval(updateRouteRandomly, 5000);

      return () => {
        clearInterval(interval);
        socketRef.current.disconnect();
      };
    }
  }, [login.token, motoristas]);

  return (
    <>
      <h1>Probando sockets</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
        <input type="password" placeholder="Password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
        <button type="submit">Login</button>
      </form>

      <h2>Motoristas</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            {/* <th>Telf.</th> */}
            {/* <th>DPI</th> */}
            <th>Coordenada</th>
            <th>Coordenadas</th>
          </tr>
        </thead>
        <tbody>
          {motoristas.map((motorista) => (
            <tr key={motorista.id}>
              <td>{motorista.id}</td>
              <td>{motorista.fullName}</td>
              {/* <td>{motorista.phone}</td> */}
              {/* <td>{motorista.dpi}</td> */}
              <td>{motorista.lastCoord}</td>
              <td>{motorista.coords.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default AppSocket;
