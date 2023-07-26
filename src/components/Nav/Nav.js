import { Link, useNavigate } from "react-router-dom";

const Nav = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/");
  }

  return (
    <nav>
      {loggedIn ? (
        <div>
          <Link to="/">Home</Link>
          <Link to="/userinfo">User Info</Link>
          <Link to="/classrooms">Classrooms & Students</Link>
          <button onClick={() => handleLogout()}>Log Out</button>
        </div>
      ) : null}
    </nav>
  );
};

export default Nav;
