import { Link } from "react-router-dom"

const Nav = () => {
    return (
        <nav>
            <Link to='/'>Generate Groups</Link>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Register</Link>
        </nav>
    )
}

export default Nav