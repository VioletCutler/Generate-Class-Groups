import { useState, useEffect } from "react"
import { studentList } from "../helperFunctions/dummyData"

const Homepage = () => {
    const [classList, setClassList] = useState(studentList)
    const [absentStudents, setAbsentStudents] = useState([])
 

    function handleAbsentStudentClick(e){
        console.log(e.target.id)
        console.log(classList[e.target.id])
        setAbsentStudents([...absentStudents, classList[e.target.id]])
        const updatedClassList = [];
        for (let i = 0; i < classList.length; i++){
            if (i != e.target.id)updatedClassList.push(classList[i])
        }
        setClassList(updatedClassList)
    }

    return (
        <div>
        <h2>Generate Groups Below</h2>
        <div>      
             <h3>Absent Students</h3> 
            {absentStudents.length ? 
     absentStudents.map((absentStudent, idx) => {
                return (
                    <p key={idx}>{absentStudent}</p>
                )
            }) : null}
        </div>
        <div>
            {classList.length ? classList.map((student, idx) => {
                return(
                    <div className="current-class-list" key={idx}>
                    <p>{student}</p>
                    <button id={idx} onClick={handleAbsentStudentClick}>Absent</button>
                    </div>
                )
            }) : <p>No Students Yet</p>}
        </div>
        </div>
    )
}

export default Homepage