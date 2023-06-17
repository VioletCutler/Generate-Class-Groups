import { useState } from "react";
import { createClassroom } from "../../api/index"

const CreateClassroom = ({setCreateClassroom, userInfo, setUserInfo}) => {
    const [classroomName, setClassroomName] = useState("");
    const [inSession, setInSession] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        const response = await createClassroom({classroomName, inSession});
        if (response.success){
            const updatedUserInfo = userInfo;
            updatedUserInfo.classrooms.push(response.classroom)
            setUserInfo(updatedUserInfo)
            setCreateClassroom(false)
        } else {
            setErrorMessage(response.message)
        }
    }

    return(
        <div>
        <h3>Create Classroom</h3>
        <p>Enter the name of your new classroom and check whether it is in session or not</p>
        <p className="error-message">{errorMessage.length ? errorMessage : null}</p>
        <form onSubmit={handleSubmit}>
            <label htmlFor="classroom-name-input">Classroom Name</label>
            <input type="text" id="classroom-name-input" onChange={(e) => setClassroomName(e.target.value)}></input>
            <label htmlFor="inSession">Currently in Session?</label>
            <input type="checkbox" onChange={() => setInSession(!inSession)}></input>
            <p id="inSession-indicator">{inSession ? "yes" : "no"}</p>
            <input type="submit"></input>
        </form>
        <button onClick={()=>setCreateClassroom(false)}>Cancel</button>
        </div>
    )
}

export default CreateClassroom