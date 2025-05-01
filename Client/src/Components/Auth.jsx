import React, { useState } from "react";
import "./Auth.css";
import axios from "axios";

function Auth() {
  const [form, setForm] = useState("login");
  const [success, setSuccess] = useState(null);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [register, setRegister] = useState({
    username: "",
    email: "",
    password: "",
    cnfpassword: "",
  });
  const [error, setError] = useState(null);

  const handleLoginChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    setError(null);
    setSuccess(null);
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/login", login, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Login Success:", res.data);
      setSuccess("Login Successfully redirecting to Video!")
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response.data.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    setError(null);
    setSuccess(null);
    e.preventDefault();
    if (register.password !== register.cnfpassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      const res = await axios.post("http://localhost:3000/register", register, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Register Success:", res.data);
      setSuccess("Registered Successfully Please Login.")
      setForm("login")
    } catch (err) {
      console.error("Register Error:", err);
      setError(err.response.data.message);
    }
  };

  return (
    <div className="auth-container">
      {success && <p className="success-message">{success}</p>}
      <div className="form-switch">
        <button
          className={form === "login" ? "active" : ""}
          onClick={() => setForm("login")}
        >
          Login
        </button>
        <button
          className={form === "register" ? "active" : ""}
          onClick={() => setForm("register")}
        >
          Register
        </button>
      </div>
      <div className="form-wrapper">
        <form
          className={`form login-form ${form === "login" ? "show" : "hide"}`}
          onSubmit={handleLoginSubmit}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={login.email}
            onChange={handleLoginChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={login.password}
            onChange={handleLoginChange}
            required
          />
          <button type="submit">Login</button>
        </form>

        <form
          className={`form register-form ${
            form === "register" ? "show" : "hide"
          }`}
          onSubmit={handleRegisterSubmit}
        >
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={register.username}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={register.email}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={register.password}
            onChange={handleRegisterChange}
            required
          />
          <input
            type="password"
            name="cnfpassword"
            placeholder="Confirm Password"
            value={register.cnfpassword}
            onChange={handleRegisterChange}
            required
          />
          <button type="submit">Register</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default Auth;
