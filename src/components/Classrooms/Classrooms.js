import { CreateClassroom, SingleClassroom } from "../index";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const Classrooms = ({userInfo, setUserInfo}) => {
  const [createClassroom, setCreateClassroom] = useState(false);

  return (
    <div>
      <h2>Classrooms and Students</h2>
      {createClassroom ? (
        <CreateClassroom
          setCreateClassroom={setCreateClassroom}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
      ) : (
        <div>
          <h3>Current Classrooms</h3>
          {userInfo && userInfo.classrooms ? (
            userInfo.classrooms.map((classroom) => {
              const { classroomInfo, instructors, students } = classroom;

              return (
                <div
                  className="profile-classroom-section"
                  key={classroomInfo.id}
                >
                  <Link to={`/classrooms/${classroomInfo.id}`}>
                    {classroomInfo.name}
                  </Link>
                  {/* <h4>Instructors:</h4>
                  {instructors.map((instructor) => {
                    return <p key={instructor.id}>{instructor.name}</p>;
                  })} */}
                </div>
              );
            })
          ) : (
            <p>You don't currently have any classrooms.</p>
          )}
          <button
            onClick={() => {
              setCreateClassroom(true);
            }}
          >
            Click Here to Create A New Classroom
          </button>
        </div>
      )}
    </div>
  );
};

export default Classrooms;
