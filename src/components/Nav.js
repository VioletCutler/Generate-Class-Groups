import { Link, useNavigate } from "react-router-dom"

const Nav = ({loggedIn, setLoggedIn}) => {
    const navigate = useNavigate()

    function handleLogout(){
        localStorage.setItem('token', null);
        setLoggedIn(false);
        navigate('/')
    }

    return (
        <nav>
            {
                loggedIn ? 
                    <div>
                        <Link to="/home">Home</Link>
                        <button onClick={() => handleLogout()}>Log Out</button> 
                    </div>
                : null
            }
     
        </nav>
    )
}

export default Nav