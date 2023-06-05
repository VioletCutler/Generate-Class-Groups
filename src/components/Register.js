import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";

const Register = ({ setRegistered, setLoggedIn }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    try {
      e.preventDefault();
    const data = await registerUser({ name, username, email, password });
    if (data.success){
      localStorage.setItem('token', token);
      setLoggedIn(true);
      navigate('/home');
    }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} id="register-form">
        <label htmlFor="register-name-input">Name</label>
        <input
          type="text"
          id="register-name-input"
          onChange={(e) => setName(e.target.value)}
        ></input>
        <label htmlFor="register-username-input">Username</label>
        <input
          id="register-username-input"
          type="text"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          minLength="3"
          required
        ></input>
        <label htmlFor="register-email-input">Email</label>
        <input
          id="register-email-input"
          type="text"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <label htmlFor="register-password-input">Password</label>
        <input
          id="register-password-input"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          minLength="8"
          maxLength="16"
          required
        ></input>
        <label htmlFor="register-confirm-password-input">ConfirmPassword</label>
        <input
          id="register-confirm-password-input"
          type="password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          minLength="8"
          maxLength="16"
          required
        ></input>
        <input type="submit"></input>
        <p>password must be 8-16 characters long</p>
      </form>
      <div>
        Already signed up? click{" "}
        <button onClick={() => setRegistered(true)}>here</button> to login
      </div>
    </div>
  );
};

export default Register;
