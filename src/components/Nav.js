import { Link, useNavigate } from "react-router-dom"

const Nav = ({loggedIn, setLoggedIn}) => {
    const navigate = useNavigate()
    return (
        <nav>
            {
                loggedIn ? 
                    <div>
                        <Link to='/makegroups'>Generate Groups</Link>
                        <button onClick={navigate('/login')}>Log Out</button> 
                    </div>
                : null
            }
     
        </nav>
    )
}

export default Nav