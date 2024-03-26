import { useState } from 'react'
import axios from 'axios';
import "./App.css";

const BASEURL = "https://odala.api.v2.dev.lumationsuite.com";
// const BASEURL = "http://localhost:3000";
const initialLogin = { email: "", password: "", token: "" }
const initialUser = { name: "", lastname: "", email: "", birthday: "" }

function App() {
  const [login, setLogin] = useState(initialLogin);
  const [user, setUser] = useState(initialUser);
  // const [userApiAxios, setUserApiAxios] = useState(null);
  // const [userApiFetch, setUserApiFetch] = useState(null);
  // const OLD_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2aXZpYW5hLmNhbHZhQGx1bWF0aW9uLmNvIiwiaXNzIjoiT2RhbGEgQVBJIiwiaWF0IjoxNjk3ODQwNDYyLCJleHAiOjE2OTc5MjY4NjJ9.788GiBetXFAs2HIMbWNkzt9A2vIJc8EL6j9_lgIcGaE"

  const handleLogin = async (e) => {
    try {
      e.preventDefault();

      console.log(login);

      const { data: loginResponse } = await axios.post(BASEURL + "/auth/login", login);

      // Seteando token en el localStorage 
      localStorage.setItem("token", loginResponse.token);
      setLogin({ ...login, token: loginResponse.token });

      console.log(loginResponse);
    } catch (error) {
      console.log(error.message);
    }
  }

  // const handleGetUserAxios = async e => {
  //   e.preventDefault();

  //   try {
  //     const { data: userFetched } = await axios.get(BASEURL + "/user/650e3a925c6d5b504648720f", { headers: { Authorization: `Bearer ${login.token}` } })

  //     console.log(userFetched);

  //     setUserApiAxios(userFetched)
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  // const handleGetUserFetch = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await fetch(
  //       BASEURL + "/user/650e3a925c6d5b504648720f",
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${login.token}`,
  //           "Content-Type": "application/json", // Aseguramos que se envíen y reciban datos en formato JSON
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP Error! Status: ${response.status}`);
  //     }

  //     const userFetched = await response.json(); // Parseamos la respuesta JSON

  //     console.log(userFetched);

  //     setUserApiFetch(userFetched);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };


  // const handleUpdateUser = async e => {
  //   e.preventDefault();

  //   try {
  //     console.log({ user });

  //     const { data: userResponse } = await axios.patch(BASEURL + "/user/650e3a925c6d5b504648720f", user, { headers: { Authorization: `Bearer ${login.token}` } });

  //     console.log(userResponse);
  //   } catch (error) {
  //     console.log(error);
  //     console.log(error.message);
  //   }
  // }

  // const handleGetBank = async e => {
  //   e.preventDefault();

  //   try {
  //     const { data: response } = await axios.get(BASEURL + "/bank", user, { headers: { Authorization: `Bearer ${OLD_TOKEN}` } });

  //     console.log(response);
  //   } catch (error) {
  //     console.log(error);
  //     console.log(error.message);
  //   }
  // }

  // const handleChangeUser = e => {
  //   const { name, value } = e.target;

  //   setUser({ ...user, [name]: value })
  // }

  return (
    <>
      <h1>Probando ODALA</h1>
      <h2>Hacer login</h2>
      <form style={{ padding: "0.5rem" }}>
        <div>
          <label>Email</label>
          <input type="email" name="email" id="email" value={login.email} onChange={e => setLogin({ ...login, email: e.target.value })} />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" name="password" id="password" value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} />
        </div>
        <input type="submit" onClick={handleLogin} value={login.token ? "Refrescar token" : "Iniciar sesión"} />
      </form>
      {/* <h2>Actualizar usuario con token viejo</h2> */}
      {/* <form style={{ padding: "0.5rem" }}>
        <input type="submit" onClick={handleGetBank} value={"GET BANK"} />
      </form> */}
      {/* <div>
        <h2>Usuario axios</h2>
        {userApiAxios ?
          <p>JSON.stringify(userApiAxios)</p> :
          <input type="submit" value="Obtener usuario" onClick={handleGetUserAxios} />}
      </div> */}
      {/* <div>
        <h2>Usuario fetch</h2>
        {userApiFetch ?
          <p>JSON.stringify(userApiFetch)</p> :
          <input type="submit" value="Obtener usuario" onClick={handleGetUserFetch} />}
      </div> */}
      {/* <h2>Editar usuario</h2> */}
      {/* <form style={{ padding: "0.5rem" }}>
        <div>
          <label>Nombre</label>
          <input name="name" id="name" value={user.name} onChange={handleChangeUser} />
        </div>
        <div>
          <label>Apellido</label>
          <input type="text" name="lastname" id="lastname" value={user.lastname} onChange={handleChangeUser} />
        </div>
        <div>
          <label>Fecha de nacimiento</label>
          <input type="date" name="birthday" id="birthday" value={user.birthday} onChange={handleChangeUser} />
        </div>
        <input type="submit" onClick={handleUpdateUser} value="Actualizar usuario" />
      </form> */}
    </>
  )
}

export default App
