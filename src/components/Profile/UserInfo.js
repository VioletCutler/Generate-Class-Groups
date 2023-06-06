import { useState, useEffect } from "react";
import { getMe, updateUserInfo } from "../../api";

const UserInfo = ({ userInfo, setUserInfo }) => {
  const { details } = userInfo;

  const [updateForm, setupdateForm] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);

  //This seems hacky but is my current idea for dealing with setting the state from fetched state above
  useEffect(() => {
    if (updateForm) {
      setName(details.name);
      setUsername(details.username);
      setEmail(details.email);
    }
  }, [updateForm]);

  async function handleSubmit(e) {
    e.preventDefault();
    const updatedUser = await updateUserInfo({
      name,
      username,
      email,
      isActive,
    });
    console.log("Updated User:", updatedUser);

    //send PATCH fetch request
  }

  return (
    <div>
      <h2>User Info</h2>
      {updateForm ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setupdateForm(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button onClick={() => setupdateForm(true)}>
          Click to Update User Info
        </button>
      )}
      <button>Delete Account</button>
    </div>
  );
};

export default UserInfo;
