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






------------------------------------------------------------------------bl 3

body{
  font-family: Arial, Helvetica, sans-serif;
  background:#f4f6f9;
  margin:0;
}

.auth-container{
  width:360px;
  margin:120px auto;
  padding:30px;
  background:white;
  border-radius:8px;
  box-shadow:0 4px 12px rgba(0,0,0,0.15);
  text-align:center;
}

.auth-title{
  margin-bottom:20px;
  color:#333;
}

.auth-input{
  width:100%;
  padding:10px;
  margin:8px 0;
  border:1px solid #ccc;
  border-radius:4px;
  font-size:14px;
}

.auth-btn{
  width:100%;
  padding:10px;
  margin-top:12px;
  background:#3b82f6;
  border:none;
  color:white;
  border-radius:4px;
  cursor:pointer;
  font-size:15px;
}

.auth-btn:hover{
  background:#2563eb;
}

.link-btn{
  margin-top:10px;
  background:transparent;
  border:none;
  color:#3b82f6;
  cursor:pointer;
  font-size:14px;
}






import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Register(){

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [password,setPassword] = useState("");

  const handleRegister = () => {

    const newUser = {
      id: Date.now().toString(),
      email,
      phone,
      password,
      role:"user"
    };

    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    users.push(newUser);

    localStorage.setItem("users",JSON.stringify(users));

    alert("Registration successful");

    navigate("/");
  };

  return(

    <div className="auth-container">

      <h2 className="auth-title">Register</h2>

      <input
        className="auth-input"
        type="email"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        className="auth-input"
        placeholder="Phone Number"
        onChange={(e)=>setPhone(e.target.value)}
      />

      <input
        className="auth-input"
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button
        className="auth-btn"
        onClick={handleRegister}
      >
        Register
      </button>

      <button
        className="link-btn"
        onClick={()=>navigate("/")}
      >
        Back to Login
      </button>

    </div>
  );
}

export default Register;







---------------------------------------------------------- ml3
src/styles/dashboard.css
.navbar{
  background:#1f2937;
  color:white;
  padding:15px;
  display:flex;
  justify-content:space-between;
}

.container{
  padding:30px;
}

.search-box{
  padding:10px;
  width:300px;
  margin-bottom:20px;
}

.song-card{
  border:1px solid #ddd;
  padding:15px;
  margin-bottom:10px;
  border-radius:6px;
  display:flex;
  justify-content:space-between;
}

.song-btn{
  background:#2563eb;
  border:none;
  color:white;
  padding:6px 10px;
  border-radius:4px;
  cursor:pointer;
}








src/pages/Dashboard.js

import { useEffect,useState } from "react";
import { getSongs } from "../api/apiService";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard(){

 const [songs,setSongs]=useState([]);
 const [search,setSearch]=useState("");

 useEffect(()=>{

  getSongs().then(data=>setSongs(data));

 },[]);

 const filteredSongs=songs.filter(song =>
   song.name.toLowerCase().includes(search.toLowerCase())
 );

 return(

 <div>

  <div className="navbar">
    <h3>Music Library</h3>
  </div>

  <div className="container">

   <input
     className="search-box"
     placeholder="Search song"
     onChange={(e)=>setSearch(e.target.value)}
   />

   {filteredSongs.map(song=>(

     <div
       key={song.id}
       className="song-card"
     >

       <div>

        <b>{song.name}</b>

        <p>{song.album}</p>

       </div>

       <Link to={`/song/${song.id}`}>
        <button className="song-btn">
          View
        </button>
       </Link>

     </div>

   ))}

  </div>

 </div>

 );
}

export default Dashboard;







-----------------------------------------------------ml5

body{
  margin:0;
  font-family: Arial, Helvetica, sans-serif;
  background:#f4f6f9;
}

/* Top Navbar */

.navbar{
  background:#1f2937;
  color:white;
  padding:16px 30px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.nav-title{
  font-size:20px;
  font-weight:bold;
}

/* Main Container */

.container{
  padding:30px;
}

/* Search */

.search-box{
  padding:10px;
  width:320px;
  border-radius:6px;
  border:1px solid #ccc;
  margin-bottom:25px;
}

/* Song Grid */

.song-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
  gap:20px;
}

/* Card */

.song-card{
  background:white;
  border-radius:10px;
  padding:20px;
  box-shadow:0 4px 10px rgba(0,0,0,0.1);
  transition:transform 0.2s;
}

.song-card:hover{
  transform:translateY(-5px);
}

/* Song Info */

.song-title{
  font-size:16px;
  font-weight:bold;
  margin-bottom:8px;
}

.song-album{
  font-size:14px;
  color:#555;
  margin-bottom:15px;
}

/* Button */

.song-btn{
  background:#2563eb;
  border:none;
  color:white;
  padding:8px 14px;
  border-radius:5px;
  cursor:pointer;
}

.song-btn:hover{
  background:#1d4ed8;
}












import { useEffect, useState } from "react";
import { getSongs } from "../api/apiService";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard(){

  const [songs,setSongs] = useState([]);
  const [search,setSearch] = useState("");

  useEffect(()=>{

    getSongs().then(data => setSongs(data));

  },[]);

  const filteredSongs = songs.filter(song =>
    song.name.toLowerCase().includes(search.toLowerCase())
  );

  return(

    <div>

      <div className="navbar">
        <div className="nav-title">🎵 Music Library</div>
      </div>

      <div className="container">

        <input
          className="search-box"
          placeholder="Search song..."
          onChange={(e)=>setSearch(e.target.value)}
        />

        <div className="song-grid">

          {filteredSongs.map(song => (

            <div
              key={song.id}
              className="song-card"
            >

              <div className="song-title">
                {song.name}
              </div>

              <div className="song-album">
                {song.album}
              </div>

              <Link to={`/song/${song.id}`}>
                <button className="song-btn">
                  View Details
                </button>
              </Link>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}

export default Dashboard;













admin.css

.admin-container{
 padding:30px;
}

.admin-input{
 padding:8px;
 margin-right:10px;
}

.admin-btn{
 background:#2563eb;
 color:white;
 border:none;
 padding:8px 12px;
 cursor:pointer;
}

.song-row{
 border:1px solid #ddd;
 padding:10px;
 margin-top:10px;
 display:flex;
 justify-content:space-between;
}




AdminSongs.js

import { useState,useEffect } from "react";
import { getSongs } from "../api/apiService";
import { v4 as uuid } from "uuid";
import "../styles/admin.css";

function AdminSongs(){

 const [songs,setSongs]=useState([]);
 const [name,setName]=useState("");

 useEffect(()=>{
   getSongs().then(data=>setSongs(data));
 },[]);

 const addSong=()=>{

  const newSong={
    id:uuid(),
    name:name
  };

  setSongs([...songs,newSong]);
 };

 const deleteSong=(id)=>{

  setSongs(songs.filter(song=>song.id!==id));

 };

 return(

 <div className="admin-container">

  <h2>Admin Song Management</h2>

  <input
   className="admin-input"
   placeholder="Song name"
   onChange={(e)=>setName(e.target.value)}
  />

  <button
   className="admin-btn"
   onClick={addSong}
  >
   Add Song
  </button>

  {songs.map(song=>(

   <div
    key={song.id}
    className="song-row"
   >

    {song.name}

    <button
     onClick={()=>deleteSong(song.id)}
    >
     Delete
    </button>

   </div>

  ))}

 </div>

 );
}

export default AdminSongs;







import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSongs } from "../api/apiService";
import Navbar from "../components/Navbar";
import "../styles/layout.css";

function SongDetails(){

  const { id } = useParams();
  const [song,setSong] = useState(null);

  useEffect(()=>{

    getSongs().then(data=>{
      const selected = data.find(s => s.id === id);
      setSong(selected);
    });

  },[id]);

  if(!song){
    return <div>Loading...</div>;
  }

  return(

    <div>

      <Navbar/>

      <div className="page-container">

        <div className="card">

          <h2>{song.name}</h2>

          <p><b>Director:</b> {song.director}</p>

          <p><b>Album:</b> {song.album}</p>

          <p><b>Release Date:</b> {song.releaseDate}</p>

          <button className="btn">
            Add to Playlist
          </button>

          <button
            className="btn"
            style={{marginLeft:"10px"}}
          >
            ❤ Favourite
          </button>

        </div>

      </div>

    </div>

  );

}

export default SongDetails;





import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/layout.css";

function Navbar(){

  const {logout} = useContext(AuthContext);

  return(

    <div className="navbar">

      <h3>🎵 Music Library</h3>

      <div className="nav-links">

        <Link to="/dashboard">Library</Link>

        <Link to="/playlist">Playlist</Link>

        <Link to="/favorites">Favorites</Link>

        <span
          style={{marginLeft:"20px",cursor:"pointer"}}
          onClick={logout}
        >
          Logout
        </span>

      </div>

    </div>

  );

}

export default Navbar;











import { useEffect,useState } from "react";
import { getSongs } from "../api/apiService";
import { v4 as uuid } from "uuid";
import Navbar from "../components/Navbar";
import "../styles/layout.css";

function AdminSongs(){

 const [songs,setSongs] = useState([]);
 const [name,setName] = useState("");
 const [album,setAlbum] = useState("");
 const [director,setDirector] = useState("");

 useEffect(()=>{

  getSongs().then(data => setSongs(data));

 },[]);

 const addSong = () => {

  const newSong = {
    id:uuid(),
    name:name,
    album:album,
    director:director
  };

  setSongs([...songs,newSong]);

 };

 const deleteSong = (id) => {

  setSongs(
   songs.filter(song => song.id !== id)
  );

 };

 return(

 <div>

  <Navbar/>

  <div className="page-container">

   <h2>Admin Song Management</h2>

   <div style={{marginBottom:"20px"}}>

     <input
       placeholder="Song name"
       onChange={(e)=>setName(e.target.value)}
     />

     <input
       placeholder="Album"
       onChange={(e)=>setAlbum(e.target.value)}
     />

     <input
       placeholder="Director"
       onChange={(e)=>setDirector(e.target.value)}
     />

     <button
       className="btn"
       onClick={addSong}
     >
       Add Song
     </button>

   </div>

   <div className="grid">

    {songs.map(song=>(

     <div
      key={song.id}
      className="card"
     >

       <div className="card-title">
         {song.name}
       </div>

       <div className="card-text">
         {song.album}
       </div>

       <button
         className="btn"
         onClick={()=>deleteSong(song.id)}
       >
         Delete
       </button>

     </div>

    ))}

   </div>

  </div>

 </div>

 );

}

export default AdminSongs;








body{
  margin:0;
  font-family: Arial, Helvetica, sans-serif;
  background:#f4f6f9;
}

/* top navigation */

.navbar{
  background:#1f2937;
  color:white;
  padding:16px 30px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.nav-links a{
  color:white;
  margin-left:20px;
  text-decoration:none;
}

/* page container */

.page-container{
  padding:30px;
}

/* grid layout */

.grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
  gap:20px;
}

/* card style */

.card{
  background:white;
  padding:20px;
  border-radius:10px;
  box-shadow:0 4px 10px rgba(0,0,0,0.1);
  transition:transform .2s;
}

.card:hover{
  transform:translateY(-5px);
}

.card-title{
  font-weight:bold;
  margin-bottom:8px;
}

.card-text{
  color:#555;
  margin-bottom:12px;
}

.btn{
  background:#2563eb;
  color:white;
  border:none;
  padding:8px 14px;
  border-radius:5px;
  cursor:pointer;
}

.btn:hover{
  background:#1d4ed8;
}























