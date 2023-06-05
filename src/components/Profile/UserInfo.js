import { useState } from 'react'

const UserInfo = () => {
    const [name, setName] = useState('useState test name value')
    const [username, setUsername] = useState('useState test username value')
    const [email, setEmail] = useState('useState test email value')
    const [updateUserInfo, setUpdateUserInfo] = useState(false)

console.log('__User Info__')
console.log('Name:', name);
console.log('Username :', username);
console.log('Email :', email)

function handleSubmit(e){
    e.preventDefault();
    //send PATCH fetch request
}

  return (
    <div>
      <h2>User Info</h2>
      {updateUserInfo ? 
      <form onSubmit={handleSubmit}>
      <label htmlFor="name" >Name</label>
      <input id="name" value={name} onChange={(e)=>setName(e.target.value)}/>
      <label htmlFor="username" >Username</label>
      <input id="username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
      <label htmlFor="email" >Email</label>
      <input id="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
      <button type="submit">Submit</button>
      <button type="button" onClick={()=> setUpdateUserInfo(false)}>Cancel</button>
    </form> :
    <button onClick={() => setUpdateUserInfo(true)}>Click to Update User Info</button>
    }
      
    </div>
  );
};

export default UserInfo