import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getClassroomById, updateClassroomInfo } from "../../api";

const SingleClassroom = ({ userInfo }) => {
  const { id } = useParams();
  const [classroomInfo, setClassroomInfo] = useState({});
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [editClassroom, setEditClassroom] = useState(false);
  //edit information
  const [name, setName] = useState("");
  const [inSession, setInSession] = useState(false);

  async function fetchClassroom() {
    try {
      const response = await getClassroomById(id);
      setClassroomInfo(response.classroom.classroomInfo);
      setInstructors(response.classroom.instructors);
      setStudents(response.classroom.students);
      setName(response.classroom.classroomInfo.name);
      setInSession(response.classroom.classroomInfo.inSession)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchClassroom();
  }, []);

  async function handleEditClassroom(e){
    e.preventDefault();
    console.log('Submit Edit Classroom')
    const updatedClassroom = await updateClassroomInfo({id: classroomInfo.id, name, inSession})
  }

  return (
    <div>
      {classroomInfo ? 
      editClassroom ? (
        <div>
            <form onSubmit={handleEditClassroom}>
                <label htmlFor="edit-classroom-name-input">Classroom Name</label>
                <input id="edit-classroom-name-input" type="text" defaultValue={classroomInfo.name} onChange={() => setName(e.target.value)}></input> 
                <label htmlFor="edit-classroom-inSession-input">In Session?</label>
                <input id="edit-classroom-is-active-input" type="checkbox" checked={inSession ? true : false} onChange={() => setInSession(!inSession)}></input>
                <button type="submit">Update</button>
            </form>
            <button onClick={() => setEditClassroom(false)}>Cancel</button>
        </div>

      ) :
      (
        <div className="profile-classroom-section" key={classroomInfo.id}>
          <h4>{classroomInfo.name}</h4>
          <h5>Instructors:</h5>
          {instructors.map((instructor) => {
            return <p key={instructor.id}>{instructor.name}</p>;
          })}
          <p>Students:</p>
          {students.map((student) => {
            return <p key={student.id}>{student.name}</p>;
          })}
          <button onClick={() => setEditClassroom(true)}>Edit Classroom Information</button>
        </div>

      ) : (
        <div>
          {console.log("Classroom.classinfo")}
          <p>Something went wrong</p>
        </div>
      )}
    </div>
  );
};

export default SingleClassroom;
