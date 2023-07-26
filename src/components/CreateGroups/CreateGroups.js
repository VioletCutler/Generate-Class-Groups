import { useState, useEffect } from "react";
// import { studentList, absentStudentList } from "../../dummyData/dummyData.js"
import { useParams } from "react-router-dom";
import { getClassroomById } from "../../api/index.js";
import {
  pickRandomStudent,
  helperObj,
  createGroupsObject,
  addStudentsToPreexistingGroups,
} from "../../helperFunctions/functionality.js";

const CreateGroups = () => {
  const { id } = useParams();

  const [classList, setClassList] = useState([]);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [finalGroups, setFinalGroups] = useState([]);
  //Add in later:
  // const [haveToBePaired, setHaveToBePaired] = useState([])
  // const [addToPreexistingroup, setAddToPreexistingGroup] = useState([])

  async function fetchStudents() {
    try {
      const response = await getClassroomById(id);
      if (response.success) {
        setClassList(response.classroom.students);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch students for this classroom
  useEffect(() => {
    fetchStudents();
  }, []);

  console.log("classList", classList);

  function handleAbsentStudentClick(e) {
    e.preventDefault();
    const [absentStudent] = classList.filter(
      (student) => student.id == e.target.id
    );
    setAbsentStudents([...absentStudents, absentStudent]);
    const updatedClassList = classList.filter(
      (student) => student.id != e.target.id
    );
    // for (let i = 0; i < classList.length; i++){
    //     if (i != e.target.id)updatedClassList.push(classList[i])
    // }
    setClassList(updatedClassList);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    console.log("Generate Groups");

    const generatedGroups = createGroupsObject(classList, 3);
    console.log("Final Groups", generatedGroups);
    const finalGroupsArray = []
    for (let key in generatedGroups){
        console.log('Generated Group', typeof generatedGroups[key])
        if (typeof generatedGroups[key] === 'object'){
            finalGroupsArray.push(generatedGroups[key])
        }
    }
    console.log(finalGroupsArray)
    setFinalGroups(finalGroupsArray)
  }

  return (
    <div>
      {finalGroups && finalGroups.length ? (
        <div>{finalGroups.map((group, idx) => {

            return(
            <div key={idx}>
            <p>Group #{idx + 1}</p>
            {group.map((student) => {
                return(
                    <div>{student.name}</div>
                )
            })}
            </div>
            )
        })}</div>
      ) : (
        <div>
          <h2>Generate Groups Below</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="group-size-input" />
            <input id="group-size-input" type="number" />
            <button type="submit">Generate Groups</button>
          </form>
          <div>
            <h3>Absent Students</h3>
            {absentStudents.length
              ? absentStudents.map((absentStudent) => {
                  return <p key={absentStudent.id}>{absentStudent.name}</p>;
                })
              : null}
          </div>
          <div>
            {classList.length
              ? classList.map((student, idx) => {
                  return (
                    <div className="current-class-list" key={idx}>
                      <p>{student.name}</p>
                      <button
                        id={student.id}
                        onClick={handleAbsentStudentClick}
                      >
                        Absent
                      </button>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGroups;
