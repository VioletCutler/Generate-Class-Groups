import { useState, useEffect } from "react";
import { updateStudent, getStudentById, deleteStudent } from "../../api";
import { useParams, useNavigate } from "react-router-dom";

const Student = ({ setStudents }) => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [classroomId, setClassroomId] = useState(0)
  const [student, setStudent] = useState({});
  const [updateForm, setUpdateForm] = useState(false);
  const [name, setName] = useState("");
  const [deleteStudentPrompt, setDeleteStudentPrompt] = useState(false)

  useEffect(() => {
    async function fetchStudent(id) {
      try {
        const response = await getStudentById(id);
        console.log("response", response);
        if (response.success) {
          setStudent(response.student);
          setClassroomId(response.student.classroomId)
        } else {
          navigate('/classrooms')
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchStudent(studentId);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await updateStudent({
        studentId: student.studentId,
        name,
      });
      if (response.success) {
        console.log('response:', response)
        // student = response.studentToUpdate
        // const updatedStudentList = students.filter(
        //   (student) => student.studentId != response.updatedStudent.studentId
        // );
        // updatedStudentList.push(response.updatedStudent);
        // setStudents(updatedStudentList);
        setUpdateForm(false);
        navigate(`/classrooms/${classroomId}`)
        console.log("response:", response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(){
    try {
      console.log('student', student)
      const response = await deleteStudent(student.studentId)
      if (response.success){
        navigate(`/classrooms/${classroomId}`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      {student && student.name ? (
        updateForm ? (
          <>
            <form onSubmit={handleSubmit}>
              <label htmlFor="update-student-name-input">Name</label>
              <input
                id="update-student-name-input"
                type="text"
                defaultValue={student.name}
                onChange={(e) => setName(e.target.value)}
              />
              <button type="submit">Update Name</button>
              <button onClick={() => setUpdateForm(false)}>Cancel</button>
            </form>
          </>
        ) : (
          <>
            <p>{student.name}</p>
            <button
              onClick={() => {
                setName(student.name);
                setUpdateForm(true);
              }}
            >
              Update Student Name
            </button>
          </>
          
        )
      ) : null}
      {deleteStudentPrompt ?  
      <>
      <button
      onClick={() => {
        handleDelete()
      }}>
        Yes
      </button>
      <button
       onClick={() => {
        setDeleteStudentPrompt(false)
      }}
      >Cancel</button>
      </> : 
      <button
      onClick={() => {
        setDeleteStudentPrompt(true)
      }}
    >Delete Student</button>}
    </div>
  );
};

export default Student;


// There needs to be a way to prevent anyone from updating a student