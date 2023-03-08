import { useState, useEffect } from "react"
import { studentList } from "../helperFunctions/dummyData"

const Homepage = () => {
    const [classList, setClassList] = useState(studentList)
    console.log(classList)
    return (
        <h2>This is the Homepage</h2>
    )
}

export default Homepage