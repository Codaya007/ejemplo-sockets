import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { BASE_URL, USER_ID } from "./constants";

const socket = io(BASE_URL);

const ChannelsDrivers = () => {
    const [userEvents, setUserEvents] = useState([]);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        // Conexión y unión a las salas
        socket.emit("joinRoom", { userId: USER_ID });

        // Eventos del usuario motorista
        socket.on(`events`, (event) => {
            console.log({ event });

            setUserEvents((prev) => [...prev, event]);
        });

        // Respuesta general
        socket.on("response", (res) => {
            setResponse(res.message);
        });

        return () => {
            socket.off(`events`);
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

            {response && (
                <div>
                    <h3>Response</h3>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
};

export default ChannelsDrivers;
