import { useState, useEffect } from "react";
import { updateStudent } from "../../api";

const Student = ({ student, students, setStudents }) => {
  const [updateForm, setUpdateForm] = useState(false);
  const [name, setName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await updateStudent({ studentId: student.studentId, name });
      if (response.success){
        // student = response.updatedStudent
        const updatedStudentList = students.filter((student) => student.studentId != response.updatedStudent.studentId)
        updatedStudentList.push(response.updatedStudent)
        setStudents(updatedStudentList)
        console.log('response:', response)
        setUpdateForm(false)
      }
    } catch (error) {
      console.log(error);
    }
  }

  console.log('student info:', student)
  
  return (
    <div>
      {updateForm ? (
        <>
          <form onSubmit={handleSubmit}>
            <label htmlFor="update-student-name-input">Name</label>
            <input
              id="update-student-name-input"
              type="text"
              defaultValue={student.name}
              onChange={(e)=>setName(e.target.value)}
            />
            <button type="submit">Update Name</button>
            <button onClick={() => setUpdateForm(false)}>Cancel</button>
          </form>
        </>
      ) : (
        <>
          <p>{student.name}</p>
          <button onClick={() => {
            setName(student.name)
            setUpdateForm(true)
          }
            }>
            Update Student Name
          </button>
        </>
      )}
    </div>
  );
};

export default Student;
