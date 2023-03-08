import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'



const Register = () => {
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
      <h2>Register</h2>
      <form onSubmit={handleSubmit} id='register-form'>
        <label htmlFor="register-username-input">Username</label>
        <input id="register-username-input" type="text" onChange={(e) => {setUsername(e.target.value)}} minLength='3' required></input>
        <label htmlFor="register-password-input">Password</label>
        <input id="register-password-input" type="password" onChange={(e) => {setPassword(e.target.value)}} minLength='8' maxLength='16' required></input>
        <input type='submit'  ></input>
        <p>password must be 8-16 characters long</p>
      </form>
      <div>Already signed up? click <Link to='/login'>here</Link> to login</div>
    </div>
    )
}

export default Register