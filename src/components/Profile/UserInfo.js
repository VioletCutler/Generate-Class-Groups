import { useState, useEffect } from "react";
import { getMe, updateUserInfo, deleteAccount } from "../../api";
import { useNavigate } from 'react-router-dom'

const UserInfo = ({ setTokenErrorMessage, setLoggedIn }) => {
  const navigate = useNavigate()

  const [updateForm, setupdateForm] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [deleteButton, setDeleteButton] = useState(false);

  async function fetchMe() {
    try {
      const response = await getMe();
      if (response.success) {
        setTokenErrorMessage("");
        const user = response.instructor.details;
        setUserInfo(user);
        setName(user.name);
        setUsername(user.username);
        setEmail(user.email);
      } else if ((response.message = "jwt expired")) {
        setTokenErrorMessage("Your session has expired. You must log back in.");
        localStorage.removeItem("token");
        setLoggedIn(false);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchMe();
  }, []);

  //This seems hacky but is my current idea for dealing with setting the state from fetched state above

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await updateUserInfo({
      name,
      username,
      email,
      isActive,
    });
    const user = response.updatedInstructor
    setUserInfo(user);
    console.log(user)
    setName(user.name);
    setUsername(user.username);
    setEmail(user.email);
    setupdateForm(false);
  }

  async function handleDelete(){
    try {
      await deleteAccount(userInfo.id);
      setLoggedIn(false);
      navigate('/')
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div>
      <h2>User Info</h2>

      {!userInfo.name ? null : updateForm ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setupdateForm(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <button onClick={() => setupdateForm(true)}>
            Click to Update User Info
          </button>
          <div>
            <p>Name: {name}</p>
            <p>Username: {username}</p>
            <p>Email: {email}</p>
          </div>
        </div>
      )}
      <div id="user-info-display"></div>

      <h3>Danger zone</h3>
      <p>Deleting your account cannot be undone.</p>
      {deleteButton ? (
        <div>
        <button onClick={() => handleDelete()}>Are you sure? This cannot be undone.</button>
        <button onClick={() => setDeleteButton(false)}>Cancel</button>
        </div>
      ) : (
        <div>
 
        <button onClick={() => setDeleteButton(true)}>Click to Delete Account</button></div>
      )}
    </div>
  );
};

export default UserInfo;
