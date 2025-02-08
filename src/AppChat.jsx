import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);
  const [messagesReceived, setMessagesReceived] = useState([]);

  const socketRef = useRef(null); // Referencia para mantener la instancia del socket

  // Conectar al backend usando Socket.io
  useEffect(() => {
    if (token) {
      socketRef.current = io(BASEURL, {
        auth: {
          token
        }
      });

      socketRef.current.on("message", receiveMessage);

      // Cerrar la conexión del socket cuando el componente se desmonte
      return () => {
        socketRef.current.off("message", receiveMessage);
        // socketRef.current.disconnect();
      };
    }
  }, [token]);

  const receiveMessage = message => {
    setMessagesReceived(state => [...state, message])
  }

  const handleSubmitMessage = e => {
    e.preventDefault();

    setMessagesReceived([...messagesReceived, { id: "Me", body: message }]);
    socketRef.current.emit("message", message);
    setMessage("");
  }

  const handleLogin = async e => {
    try {
      e.preventDefault();

      const { data } = await axios.post(`${BASEURL}/auth/login`, { email, password });

      setToken(data.token)
    } catch (error) {
      alert(
        error.response?.data?.message ||
        error.message ||
        "No se ha podido iniciar sesión"
      );
    }
  }

  // client-side
  if (socketRef.current) {
    socketRef.current.on("connect_error", (err) => {
      console.log("Mensaje: ", err.message);
      console.log("Data: ", err.data);
    });
  }

  return (
    <div style={{ width: "75%", margin: "auto", backgroundColor: "pink", borderRadius: "10px", padding: "1rem" }}>
      {!token && <>
        <h1 style={{ color: "deeppink" }}>Login</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email: </label>
            <input
              onChange={e => setEmail(e.target.value)}
              type="text"
              name="Email"
              id="email"
            />
          </div>
          <div>
            <label>Contraseña: </label>
            <input
              onChange={e => setPassword(e.target.value)}
              type="password"
              name="Contraseña"
              id="password"
            />
          </div>
          <input type="submit" value="Ingresar" />
        </form>
      </>}
      <h1 style={{ color: "deeppink" }}>CHAT REACT</h1>
      <div>
        {messagesReceived.map(({ id, body }, i) =>
          <div style={{ backgroundColor: "deeppink", borderRadius: "8px", padding: "3px 10px", margin: "5px", width: "fit-content" }} key={i}>
            <h4>{id}</h4>
            {body}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmitMessage} style={{ width: "100%" }} >
        <input
          type="text"
          placeholder='Escribe tu mensaje...'
          onChange={e => setMessage(e.target.value)}
          value={message}
        />
        <input type='submit' value={"Enviar"} style={{ maxWidth: "100px", backgroundColor: "deeppink" }} />
      </form>
    </div>
  )
}

export default App;