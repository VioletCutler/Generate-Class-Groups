import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";

const Login = ({ setRegistered, setLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      const data = await loginUser({ username, password });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
        navigate('/home')
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} id="login-form">
        <label htmlFor="login-username-input">Username</label>
        <input
          id="login-username-input"
          type="text"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          minLength="3"
          required
        ></input>
        <label htmlFor="login-password-input">Password</label>
        <input
          id="login-password-input"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          minLength="8"
          maxLength="16"
          required
        ></input>
        <input type="submit"></input>
        <p>password must be 8-16 characters long</p>
      </form>
      <div>
        Not signed up? click{" "}
        <button onClick={() => setRegistered(false)}>here</button> to register
      </div>
    </div>
  );
};

export default Login;
