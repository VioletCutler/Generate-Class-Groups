import { useState } from "react"
import {Login, Register} from './'

const Account = ({loggedIn}) => {
    const [registered, setRegistered] = useState(false)

    return (
        <div>
        {
            loggedIn ? <h3>Profile</h3> : 
            registered ? <Login setRegistered={setRegistered}/> : <Register setRegistered={setRegistered}/>
        }</div>
    )
}

export default Account