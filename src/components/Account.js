import { useState } from "react"
import {Login, Register} from './'

const Account = ({loggedIn, setLoggedIn}) => {
    const [registered, setRegistered] = useState(false)

    return (
        <div>
        {
            loggedIn ? <h3>Profile</h3> : 
            registered ? <Login setRegistered={setRegistered} setLoggedIn={setLoggedIn} /> : <Register setRegistered={setRegistered} setLoggedIn={setLoggedIn}/>
        }</div>
    )
}

export default Account