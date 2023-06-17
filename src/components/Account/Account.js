import { useState } from "react"
import {Login, Register, Profile} from '..'

const Account = ({setLoggedIn}) => {
    const [registered, setRegistered] = useState(true)

    return (
        <div>
        {
            !registered ? <Register setRegistered={setRegistered} setLoggedIn={setLoggedIn} /> : <Login setRegistered={setRegistered} setLoggedIn={setLoggedIn}/>
        }</div>
    )
}

export default Account