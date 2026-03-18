import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: ""
  });

  const submit = async () => {
    if (!form.email || !form.phone || !form.password) {
      alert("All fields required");
      return;
    }

    await register(form);
    nav("/dashboard");
  };

  return (
    <div>
      <h2>Register</h2>

      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Phone" onChange={e => setForm({ ...form, phone: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />

      <button onClick={submit}>Register</button>
    </div>
  );
}