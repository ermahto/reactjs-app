src/data/users.json
[
  {
    "id": "1",
    "email": "admin@test.com",
    "phone": "9999999999",
    "password": "admin123",
    "role": "admin"
  },
  {
    "id": "2",
    "email": "user@test.com",
    "phone": "8888888888",
    "password": "user123",
    "role": "user"
  }
]

src/data/songs.json
[
  {
    "id": "1",
    "name": "Shape of You",
    "director": "Ed Sheeran",
    "releaseDate": "2017",
    "album": "Divide"
  },
  {
    "id": "2",
    "name": "Blinding Lights",
    "director": "The Weeknd",
    "releaseDate": "2019",
    "album": "After Hours"
  }
]



src/data/playlists.json
[
  {
    "id": "1",
    "userId": "2",
    "name": "My Favorites",
    "songs": ["1"]
  }
]






src/api/apiService.js
import users from "../data/users.json";
import songs from "../data/songs.json";
import playlists from "../data/playlists.json";

export const getUsers = () => {
  return Promise.resolve(users);
};

export const getSongs = () => {
  return Promise.resolve(songs);
};

export const getPlaylists = () => {
  return Promise.resolve(playlists);
};

Later you can replace this with:

axios.get("/api/songs")

without changing UI code.




src/context/AuthContext.js
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};





import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />


      </Routes>

    </BrowserRouter>
  );
}

export default App;




src/pages/Login.js
import { useState, useContext } from "react";
import { getUsers } from "../api/apiService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {

const usersFromStorage =
  JSON.parse(localStorage.getItem("users")) || [];

const users = [...usersFromApi, ...usersFromStorage];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {

    const users = await getUsers();

    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (user) {

      login(user);

      if (user.role === "admin") {
        navigate("/admin/songs");
      } else {
        navigate("/dashboard");
      }

    } else {
      alert("Invalid credentials");
    }
  };

  return (

    <div>

      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

    </div>

  );
}

export default Login;



src/pages/Register.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {

    const newUser = {
      id: Date.now().toString(),
      email: email,
      phone: phone,
      password: password,
      role: "user"
    };

    // Get existing users from localStorage
    const existingUsers =
      JSON.parse(localStorage.getItem("users")) || [];

    existingUsers.push(newUser);

    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert("Registration Successful");

    navigate("/");
  };

  return (

    <div>

      <h2>Register</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br/><br/>

      <input
        type="text"
        placeholder="Phone Number"
        onChange={(e) => setPhone(e.target.value)}
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={handleRegister}>
        Register
      </button>

      <br/><br/>

      <button onClick={() => navigate("/")}>
        Back to Login
      </button>

    </div>
  );
}

export default Register;




------------------------------------------------------------ modified

src/styles/auth.css

Add the following styles:

body{
  font-family: Arial, Helvetica, sans-serif;
  background:#f4f6f9;
}

.auth-container{
  width:350px;
  margin:120px auto;
  padding:30px;
  background:white;
  border-radius:8px;
  box-shadow:0 0 10px rgba(0,0,0,0.1);
  text-align:center;
}

.auth-container h2{
  margin-bottom:20px;
}

.auth-input{
  width:100%;
  padding:10px;
  margin:8px 0;
  border:1px solid #ccc;
  border-radius:4px;
}

.auth-btn{
  width:100%;
  padding:10px;
  margin-top:10px;
  background:#3b82f6;
  border:none;
  color:white;
  border-radius:4px;
  cursor:pointer;
}

.auth-btn:hover{
  background:#2563eb;
}
Step 2 – Update Login.js

Import the CSS and apply the classes.

import { useState, useContext } from "react";
import { getUsers } from "../api/apiService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {

    const users = await getUsers();

    const user = users.find(
      u => u.email === email && u.password === password
    );

    if(user){
      login(user);

      if(user.role === "admin"){
        navigate("/admin/songs");
      }else{
        navigate("/dashboard");
      }

    }else{
      alert("Invalid credentials");
    }
  };

  return (

    <div className="auth-container">

      <h2>Music Library Login</h2>

      <input
        className="auth-input"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        className="auth-input"
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button
        className="auth-btn"
        onClick={handleLogin}
      >
        Login
      </button>

    </div>

  );
}

export default Login;























