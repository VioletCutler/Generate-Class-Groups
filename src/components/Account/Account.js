import { useState } from "react"
import {Login, Register, Profile} from '..'

const Account = ({loggedIn, setLoggedIn}) => {
    const [registered, setRegistered] = useState(false)

    return (
        <div>
        {
            registered ? <Login setRegistered={setRegistered} setLoggedIn={setLoggedIn} /> : <Register setRegistered={setRegistered} setLoggedIn={setLoggedIn}/>
        }</div>
    )
}

export default Account