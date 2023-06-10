import { useState } from "react";

const CreateClassroom = ({setCreateClassroom, userInfo}) => {
    const [name, setName] = useState("");
    const [inSession, setInSession] = useState(false);

    console.log('inSession:', inSession)

    function handleSubmit(e) {
        e.preventDefault()
        console.log('Submit')
    }

    return(
        <div>
        <h3>Create Classroom</h3>
        <p>Enter the name of your new classroom and check whether it is in session or not</p>
        <form onSubmit={handleSubmit}>
            <label htmlFor="classroom-name-input">Name</label>
            <input type="text" id="classroom-name-input" onChange={(e) => setName(e.target.value)}></input>
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