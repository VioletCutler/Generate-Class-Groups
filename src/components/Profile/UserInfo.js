import { useState } from 'react'

const UserInfo = ({userInfo}) => {
  const {details} = userInfo;

    const [name, setName] = useState(details.name)
    const [username, setUsername] = useState(details.username)
    const [email, setEmail] = useState(details.email)
    const [updateUserInfo, setUpdateUserInfo] = useState(false)

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