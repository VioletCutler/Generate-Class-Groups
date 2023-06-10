import { CreateClassroom } from "../index";
import { useState } from "react";

const Classrooms = ({ userInfo, setUserInfo, setLoggedIn, setTokenErrorMessage }) => {
  const user = userInfo ? userInfo.details : null;
  const classrooms = userInfo ? userInfo.classrooms : null;

  const [createClassroom, setCreateClassroom] = useState(false);

  console.log("User:", user);
  console.log("Classrooms:", classrooms);

  return (
    <div>
      <h2>Classrooms and Students</h2>
      {createClassroom ? (
        <CreateClassroom setCreateClassroom={setCreateClassroom} userInfo={userInfo} setUserInfo={setUserInfo}/>
      ) : (
        <div>
          <h3>Current Classrooms</h3>
          {classrooms && classrooms.length ? (
            classrooms.map((classroom) => {
              return (
                <div key={classroom.id}>
                  <h4>{classroom.name}</h4>
                </div>
              );
            })
          ) : (
            <p>You don't currently have any classrooms.</p>
          )}
          <button onClick={() => {setCreateClassroom(true)}}>Click Here to Create A New Classroom</button>
        </div>
      )}
    </div>
  );
};

export default Classrooms;
