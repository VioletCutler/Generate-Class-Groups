import { useState, useEffect } from "react";
import { getMe, updateUserInfo, deleteAccount } from "../../api";
import { useNavigate } from "react-router-dom";

const UserInfo = ({ userInfo, setUserInfo, setTokenErrorMessage, setLoggedIn }) => {
  const navigate = useNavigate();

  const [updateForm, setupdateForm] = useState(false);
  // const [userInfo, setUserInfo] = useState({});
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [deleteButton, setDeleteButton] = useState(false);

  // async function fetchMe() {
  //   try {
  //     const response = await getMe();
  //     if (response.success) {
  //       setTokenErrorMessage("");
  //       const user = response.instructor.details;
  //       setUserInfo(user);
  //       setName(user.name);
  //       setUsername(user.username);
  //       setEmail(user.email);
  //     } else if ((response.message = "jwt expired")) {
  //       setTokenErrorMessage("Your session has expired. You must log back in.");
  //       localStorage.removeItem("token");
  //       setLoggedIn(false);
  //       navigate("/");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // useEffect(() => {
  //   fetchMe();
  // }, []);

  async function handleUpdate(e) {
    e.preventDefault();
    const response = await updateUserInfo({
      name,
      username,
      email,
      isActive,
    });
    const classrooms = userInfo.classrooms;
    if (name != userInfo.details.name || username != userInfo.details.username){
      function removeAndReplaceInstructor(classroom){
        const [ instructorInfo ] = classroom.instructors.filter((instructor) => instructor.id == userInfo.details.id)
        instructorInfo.name = response.updatedInstructor.name;
        instructorInfo.username = response.updatedInstructor.username;
        const updatedInstructorsList = classroom.instructors.filter((instructor) => instructor.id != userInfo.details.id)
        updatedInstructorsList.push(instructorInfo)
      }
      classrooms.map(removeAndReplaceInstructor)
    }
    const user = response.updatedInstructor;
    setUserInfo({details:user, classrooms})

    // setUserInfo(user);
    // setName(user.name);
    // setUsername(user.username);
    // setEmail(user.email);
    setupdateForm(false);

  }

  async function handleDelete() {
    try {
      await deleteAccount(userInfo.id);
      setLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h2>User Info</h2>

      {/* {userInfo && userInfo.details ? <p>Welcome {userInfo.name}</p> : null} */}

      {!userInfo ? null : updateForm ? (
        <form onSubmit={handleUpdate}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            defaultValue={userInfo.details.name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
          <label htmlFor="username">Username</label>
          <input
            id="username"
            defaultValue={userInfo.details.username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            defaultValue={userInfo.details.email}
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
          {userInfo.details ? 
          <div>
          <p>Name: {userInfo.details.name}</p>
          <p>Username: {userInfo.details.username}</p>
          <p>Email: {userInfo.details.email}</p>
        </div> : null}
        </div>
      )}
      <div id="danger-zone">
        <h3>Danger zone</h3>
        <p>Deleting your account cannot be undone.</p>
        {deleteButton ? (
          <div>
            <button onClick={() => handleDelete()}>
              Are you sure? This cannot be undone.
            </button>
            <button onClick={() => setDeleteButton(false)}>Cancel</button>
          </div>
        ) : (
          <div>
            <button onClick={() => setDeleteButton(true)}>
              Click to Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
