import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const BASEURL = "http://localhost:3000";
const initialLogin = {
    "email": "sergio.molina@lumation.co",
    "password": "mayonesa12345",
    token: ""
};

function Generaciones() {
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

    useEffect(() => {
        if (login.token) {
            socketRef.current = io(BASEURL, {
                transports: ['websocket'],
                auth: {
                    token: login.token
                }
            });

            socketRef.current.on('notifications', (notification) => {
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

            return () => {
                socketRef.current.disconnect();
            };
        }
    }, [login.token]);

    const generateNotification = async () => {
        try {
            // const { data: branchId } = await axios.get("http://tacobell-delivery-api-dev-env.us-east-2.elasticbeanstalk.com/branches");

            socketRef.current.emit('sendAdminNotification', {
                status: 'Emergencia',
                deliverydriverId: "66026a78fc7df7b2bf5e839d",
                branchId: "6602696efc7df7b2bf5e8399",
            });
        } catch (error) {
            console.error('Error al generar notificación:', error);
        }
    };

    const assignOrder = async () => {
        try {
            console.log("Asignando orden")
            socketRef.current.emit('assignOrder', {
                orderId: "667f1bc65e0d8ae9618946a7",
                deliveryDriver: "66026a78fc7df7b2bf5e839d",
            });
        } catch (error) {
            console.error('Error al asignar orden:', error);
        }
    };

    return (
        <>
            <h1>Generaciones</h1>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
                <input type="password" placeholder="Password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
                <button type="submit">Login</button>
            </form>

            <button onClick={generateNotification}>Generar Notificación de Emergencia</button>
            <button onClick={assignOrder}>Asignar Orden</button>
        </>
    );
}

export default Generaciones;
