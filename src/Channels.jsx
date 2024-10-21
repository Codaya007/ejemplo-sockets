import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { BASE_URL } from "./constants";

const socket = io(BASE_URL);
// Saldría del id del usuario
const userID = "65b0afd9cc366fdb713b53e5"

const Channels = () => {
    const [userEvents, setUserEvents] = useState([]);
    const [adminEvents, setAdminEvents] = useState([]);
    const [adminNotifications, setAdminNotifications] = useState([]);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        // Conexión y unión a las salas
        socket.emit("joinRoom", { userId: userID, panel: true });

        // Eventos para usuarios específicos
        socket.on(`events/user/${userID}`, (event) => {
            setUserEvents((prev) => [...prev, event]);
        });


        // Notificaciones del panel admin
        socket.on("notification", (notification) => {
            setAdminNotifications((prev) => [...prev, notification]);
        });

        // Eventos del panel admin
        socket.on("event", (ev) => {
            setAdminEvents((prev) => [...prev, ev]);
        });

        // Respuesta general
        socket.on("response", (res) => {
            setResponse(res.message);
        });

        return () => {
            socket.off(`events/user/${userID}`);
            socket.off("notification");
            socket.off("event");
            socket.off("response");
        };
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Socket Rooms and Events</h2>

            <div>
                <h3>User Events</h3>
                {userEvents.length > 0 ? (
                    <ul>
                        {userEvents.map((event, index) => (
                            <li key={index}>
                                <strong>Event:</strong> {event.event}, <strong>Data:</strong> {JSON.stringify(event.data)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No events for this user.</p>
                )}
            </div>

            <div>
                <h3>Eventos admin</h3>
                {adminEvents.length > 0 ? (
                    <ul>
                        {adminEvents.map((event, index) => (
                            <li key={index}>
                                <strong>Event:</strong> {event.event}, <strong>Data:</strong> {JSON.stringify(event.data)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No admin events.</p>
                )}
            </div>

            <div>
                <h3>Admin Notifications</h3>
                {adminNotifications.length > 0 ? (
                    <ul>
                        {adminNotifications.map((notification, index) => (
                            <li key={index}>
                                <strong>Title:</strong> {notification.title}, <strong>Content:</strong> {notification.content}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No admin notifications.</p>
                )}
            </div>

            {response && (
                <div>
                    <h3>Response</h3>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
};

export default Channels;
