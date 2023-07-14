import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getClassroomById,
  updateClassroomInfo,
  deleteClassroom,
  addStudentToClass
} from "../../api";
import { useNavigate, Link } from "react-router-dom";
import { Student } from "../index";

const SingleClassroom = ({ userInfo, setUserInfo, count, setCount }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [classroomInfo, setClassroomInfo] = useState({});
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [editClassroom, setEditClassroom] = useState(false);

  //Edit Classroom Information
  const [name, setName] = useState("");
  const [inSession, setInSession] = useState(false);

  //Create New Students
  const [newStudentName, setNewStudentName] = useState("");

  useEffect(() => {
    fetchClassroom();
  }, []);

  async function fetchClassroom() {
    try {
      const response = await getClassroomById(id);
      setClassroomInfo(response.classroom.classroomInfo);
      setInstructors(response.classroom.instructors);
      setStudents(response.classroom.students);
      setName(response.classroom.classroomInfo.name);
      setInSession(response.classroom.classroomInfo.inSession);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEditClassroom(e) {
    e.preventDefault();
    const response = await updateClassroomInfo({
      id: classroomInfo.id,
      name,
      inSession,
    });

    if (response.success) {
      //remove existing classroom information:
      const untouchedClassrooms = userInfo.classrooms.filter(
        (classroom) =>
          classroom.classroomInfo.id != response.updatedClassroom.id
      );

      //remove updated classroom from state
      const updatedClassroom = userInfo.classrooms.filter(
        (classroom) =>
          classroom.classroomInfo.id == response.updatedClassroom.id
      );

      //update that information to add back into state
      const finalizedUpdatedClassroom = {
        ...updatedClassroom[0],
        classroomInfo: response.updatedClassroom,
      };

      //set state with updated classroom and pre-existing classrooms
      setUserInfo({
        ...userInfo,
        classrooms: [...untouchedClassrooms, finalizedUpdatedClassroom],
      });
      setClassroomInfo(response.updatedClassroom);
      setEditClassroom(false);
      setCount(count + 1);
    }
  }

  async function handleDeleteClassroom(e) {
    try {
      e.preventDefault();
      const response = await deleteClassroom(id);

      const updatedClassroomList = userInfo.classrooms.filter((classroom) => {
        console.log("classroom.classroomInfo.id", classroom.classroomInfo.id);
        console.log(
          "response.deletedClassroom.id",
          response.deletedClassroom.id
        );
        return classroom.classroomInfo.id != response.deletedClassroom.id;
      });

      setUserInfo({
        ...userInfo,
        classrooms: [...updatedClassroomList],
      });

      console.log("updated classroom list", updatedClassroomList);

      navigate("/classrooms");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmitStudent(e) {
    e.preventDefault();
    try {
      const response = await addStudentToClass({ student: newStudentName, classroomId: id });

      if (response.success){
        setStudents([...students, response.student])
        setNewStudentName("")
        document.getElementById("add-student").value = ""
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>

      {/* Eventually add in ability for multiple instructors to run the same classroom */}
      {/* {instructors.length ? (
        <div>
          <p>Instructors from Single Classroom: {instructors[0].name}</p>
        </div>
      ) : null} */}
      {instructors.length ? (
        editClassroom ? (
          <div>
            <form onSubmit={handleEditClassroom}>
              <label htmlFor="edit-classroom-name-input">Classroom Name</label>
              <input
                id="edit-classroom-name-input"
                type="text"
                defaultValue={classroomInfo.name}
                onChange={(e) => setName(e.target.value)}
              ></input>
              <label htmlFor="edit-classroom-inSession-input">
                In Session?
              </label>
              <input
                id="edit-classroom-is-active-input"
                type="checkbox"
                checked={inSession ? true : false}
                onChange={() => setInSession(!inSession)}
              ></input>
              <button type="submit">Update</button>
            </form>
            <button onClick={() => setEditClassroom(false)}>Cancel</button>
          </div>
        ) : (
          <div className="profile-classroom-section" key={classroomInfo.id}>
            <h4>{classroomInfo.name}</h4>
            <p>
              Classroom is currently {classroomInfo.inSession ? null : "not"} in
              Session
            </p>
            {/* <h5>Instructors:</h5>
            {instructors.map((instructor) => {
              return <p key={instructor.id}>{instructor.name}</p>;
            })} */}
            {/* <h5>Students:</h5> */}
            <button onClick={() => navigate(`/generategroups/${classroomInfo.id}`)}>Generate Groups
              </button>
            <form onSubmit={handleSubmitStudent}>
              <p>Add Student to class</p>
              <label htmlFor="add-student">Name</label>
              <input id="add-student" type="text" onChange={(e) => setNewStudentName(e.target.value)}/>
              <button type="submit">Add</button>
            </form>
            {students.map((student) => {
              return <Link key={student.id} to={`/studentinfo/${student.studentId}`}>{student.name}</Link>
              // return <Student key={student.id} student={student} students={students} setStudents={setStudents}/>;
            })}
            <button onClick={() => setEditClassroom(true)}>
              Edit Classroom Information
            </button>
            <button onClick={handleDeleteClassroom}>Delete Classroom</button>
          </div>
        )
      ) : (
        <div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default SingleClassroom;
