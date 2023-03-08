import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    function handleSubmit(e){
        e.preventDefault()
        navigate('/')
    }

    console.log('username :', username)
    console.log('password :', password)
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} id='login-form'>
        <label htmlFor="login-username-input">Username</label>
        <input id="login-username-input" type="text" onChange={(e) => {setUsername(e.target.value)}} minLength='3' required></input>
        <label htmlFor="login-password-input">Password</label>
        <input id="login-password-input" type="password" onChange={(e) => {setPassword(e.target.value)}} minLength='8' maxLength='16' required></input>
        <input type='submit'  ></input>
        <p>password must be 8-16 characters long</p>
      </form>
      <div>Not signed up? click <Link to='/register'>here</Link> to register</div>
    </div>
  );
};

export default Login;
