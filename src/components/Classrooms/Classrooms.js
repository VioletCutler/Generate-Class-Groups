import { CreateClassroom, SingleClassroom } from "../index";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
const Classrooms = (props) => {
  // const user = userInfo ? userInfo.details : null;
  // const classrooms = userInfo ? userInfo.classrooms : null;

  // const userInfo = props.userInfo
  // const setUserInfo = props.setUserInfo

  const [createClassroom, setCreateClassroom] = useState(false);
  // const [classrooms, setClassrooms] = useState(props.classrooms && Object.keys(props.classrooms).length ? props.classrooms : [])

  // function userInfoFunction(){
  //   console.log('user info function', userInfo.classrooms)
  //   const returnObj = [{classroomInfo: {
  //     id:1, name: "test"}, instructors: [{
  //       id: 2, name: "test name"
  // }]}]
  //   return userInfo.classrooms
  // }
  // console.log('userInfo Classrooms.js', userInfo.classroom)
  console.log('props.classrooms:', props.classrooms)


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
          {props.classrooms && props.classrooms.length ? (
            props.classrooms.map((classroom) => {
              const { classroomInfo, instructors, students } = classroom;

              return (
                <div className="profile-classroom-section" key={classroomInfo.id}>
                  <Link to={`/classroom/${classroomInfo.id}`}>{classroomInfo.name}</Link>
                  <h4>Instructors:</h4>
                  {instructors.map((instructor) => {
                    return <p key={instructor.id}>{instructor.name}</p>;
                  })}
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
