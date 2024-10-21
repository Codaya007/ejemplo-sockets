import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ROLES } from './roles';

const events = ["notification", "user", "role", "branch", "order"];

export default function TestEvents() {
    const [socket, setSocket] = useState(null);
    const [eventsReceived, setEventsReceived] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({
        event: events[0],
        data: '',
        userId: '',
    });

    // Establecer conexión con el servidor Socket.IO y unirse a una sala con un rol aleatorio
    useEffect(() => {
        const socketClient = io('http://localhost:3000'); // Cambia a la URL de tu servidor Socket.IO

        // Escoge un rol aleatorio del array de roles
        const randomRole = ROLES[Math.floor(Math.random() * ROLES.length)];
        setSelectedRole(randomRole._id);

        // Unirse a la sala de este rol
        socketClient.emit('joinRoom', { role: randomRole._id });

        // Escuchar eventos desde el servidor
        socketClient.on(`events/role/${randomRole._id}`, (eventData) => {
            setEventsReceived((prevEvents) => [...prevEvents, eventData]);
        });

        // Limpiar conexión cuando se desmonta el componente
        setSocket(socketClient);
        return () => {
            socketClient.disconnect();
        };
    }, []);

    // Manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.event || (!selectedRole && !formData.userId)) {
            alert("Debes seleccionar un evento y un rol o un ID de usuario.");
            return;
        }

        // Enviar el evento al servidor
        socket.emit('sendEvent', {
            event: formData.event,
            data: formData.data,
            user: formData.userId || null,  // Enviar si se provee
            role: selectedRole || null,     // Enviar si se selecciona un rol
        });

        // Resetear el formulario
        setFormData({ event: events[0], data: '', userId: '' });
    };

    // Actualizar el estado del formulario en base a los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div>
            <h1>Enviando evento</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Rol seleccionado automáticamente:</label>
                    <p>{ROLES.find(role => role._id === selectedRole)?.name}</p>
                </div>
                <div>
                    <label>Evento:</label>
                    <select name="event" value={formData.event} onChange={handleChange}>
                        {events.map((event) => (
                            <option value={event} key={event}>{event}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Data:</label>
                    <input
                        type="text"
                        name="data"
                        value={formData.data}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Usuario Id (opcional):</label>
                    <input
                        type="text"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                    />
                </div>
                <input type="submit" value="Enviar evento" />
            </form>

            <h1>Eventos recibidos</h1>
            <div>
                {eventsReceived.map((event, index) => (
                    <article key={index}>
                        <h3>{event.event}</h3>
                        <p>ID: {event.id}</p>
                        <p>Data: {event.data}</p>
                    </article>
                ))}
            </div>
        </div>
    );
}
