import { useState, useEffect } from "react"
import { studentList, absentStudentList } from "../../dummyData/dummyData.js"
import { useParams } from 'react-router-dom'
import { getClassroomById } from "../../api/index.js" 

const CreateGroups = () => {
    const { id } = useParams();

    const [classList, setClassList] = useState([])
    const [absentStudents, setAbsentStudents] = useState([])

    async function fetchStudents(){
        try {
            const response = await getClassroomById(id);
            console.log('Create Groups Fetch Classroom:', response);
            if (response.success){
                setClassList(response.classroom.students)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Fetch students for this classroom
    useEffect(() => {
        fetchStudents()
    }, [])


    function handleAbsentStudentClick(e){
        const [ absentStudent ] = classList.filter((student) => student.id == e.target.id)
        console.log('absentStudent:', absentStudent);
        setAbsentStudents([...absentStudents, absentStudent])
        const updatedClassList = classList.filter((student) => student.id != e.target.id);
        // for (let i = 0; i < classList.length; i++){
        //     if (i != e.target.id)updatedClassList.push(classList[i])
        // }
        console.log('updatedClassList:', updatedClassList)
        setClassList(updatedClassList)
    }

    console.log('Absent Student State:', absentStudents)

    return (
        <div>
        <h2>Generate Groups Below</h2>
        <form>
            <label htmlFor="group-size-input"/>
            <input id="group-size-input" type="number"/>
            <button type="submit">Generate Groups</button>
        </form>
        <div>      
             <h3>Absent Students</h3> 
            {absentStudents.length ? 
     absentStudents.map((absentStudent) => {
                return (
                    <p key={absentStudent.id}>{absentStudent.name}</p>
                )
            }) : null}
        </div>
        <div>
            {classList.length ? classList.map((student, idx) => {
                return(
                    <div className="current-class-list" key={idx}>
                    <p>{student.name}</p>
                    <button id={student.id} onClick={handleAbsentStudentClick}>Absent</button>
                    </div>
                )
            }) : null}
        </div>

        </div>
    )
}

export default CreateGroups
