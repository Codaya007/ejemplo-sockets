import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { BASE_URL } from "./constants/index.js"

const initialLogin = {
    // "dpi": "212121",
    // "password": "Mayonesa12345.",
    // "branch": "669840c8ddfc65129aa60547",
    // "dpi": "viviana.calva@lumation.co",
    // "password": "Mayonesa12345.",
    // "password": "Mayonesa12345.",
    // "dpi": "2323232323232",
    // "branch": "67533acdeb183875759c467a",
    "dpi": "444333222111",
    "password": "Lum12345!",
    "branch": "678aa46901f5bccd553c4e5d",
    "token": ""
};
// const BRANCH_ID = "6602696efc7df7b2bf5e8399"

function Generaciones() {
    const [login, setLogin] = useState(initialLogin);
    const socketRef = useRef(null);
    const [notificaciones, setNotificaciones] = useState([]);
    const [orders, setOrders] = useState([]);


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
            socketRef.current = io(BASE_URL, {
                transports: ['websocket'],
                auth: {
                    token: login.token
                }
            });

            // socketRef.current.on('notifications', (notification) => {
            //     console.log('Notificación recibida:', notification);
            //     // Aquí puedes manejar la notificación recibida
            // });

            socketRef.current.on('ordersDeliveryDriver66026a78fc7df7b2bf5e839d', (order) => {
                console.log('Orden asignada recibida:', order);
                // Aquí puedes manejar la orden asignada
                setOrders(prev => [...prev, order.newOrder])
            });

            // socketRef.current.on('error', (err) => {
            //     console.error('Error de Socket.IO:', err);
            // });

            // Recibo actualizaciones de sucursal
            socketRef.current.on('notificationsByBranch6602696efc7df7b2bf5e8399', (response) => {
                setNotificaciones(prev => [...prev, response.data]);
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
                companyId: "66218369aba789f960c9ffc6",
            });
        } catch (error) {
            console.error('Error al generar notificación:', error);
        }
    };

    const sendCoordinate = async () => {
        try {
            const sendCoordsBody = {
                coords: [8, 8],
                deliveryDriver: "66026a78fc7df7b2bf5e839d"
            };

            socketRef.current.emit('updateDriverCoord', sendCoordsBody);
        } catch (error) {
            console.error('Error al actualizar coordenada del motorista:', error);
        }
    }

    const generateNotificationProblem = async () => {
        try {
            socketRef.current.emit('sendAdminNotification', {
                status: 'Error en delivery',
                deliverydriverId: "66026a78fc7df7b2bf5e839d",
                branchId: "6602696efc7df7b2bf5e8399",
                orderId: "667f1bc65e0d8ae9618946a7",
            });
        } catch (error) {
            console.error('Error al generar notificación:', error);
        }
    };

    const assignOrder = async () => {
        try {
            console.log("Asignando orden");

            socketRef.current?.emit('assignOrder', {
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
                <input type="text" placeholder="DPI" value={login.dpi} onChange={(e) => setLogin({ ...login, dpi: e.target.value })} />
                <input type="password" placeholder="Password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
                <button type="submit">Login</button>
            </form>

            <button onClick={generateNotification}>Generar Notificación de Emergencia</button>
            <button onClick={generateNotificationProblem}>Generar Notificación con problemas</button>
            <button onClick={assignOrder}>Asignar Orden</button>
            <button onClick={sendCoordinate}>Generar coordenadas</button>

            <h2>Notificaciones sucursal 6602696efc7df7b2bf5e8399</h2>
            {notificaciones.map(n =>
                <div style={{ border: "1px solid black" }}>
                    <h5>{n.title}</h5>
                    <p>{n.content}</p>
                    <p>URL: {n.url}</p>
                </div>
            )}
            <h2>Ordenes motorista 66026a78fc7df7b2bf5e839d</h2>
            {orders.map(o =>
                <div style={{ border: "1px solid black" }}>
                    <h5>{o.code}</h5>
                    <p>id: {o._id}</p>
                    <p>Cliente: {o.clientFullName}</p>
                </div>
            )}
        </>
    );
}

export default Generaciones;
