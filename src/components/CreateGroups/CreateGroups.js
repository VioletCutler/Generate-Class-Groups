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

  function handleAbsentStudentClick(e) {
    e.preventDefault();
    const [absentStudent] = classList.filter(
      (student) => student.id == e.target.id
    );
    setAbsentStudents([...absentStudents, absentStudent]);
    const updatedClassList = classList.filter(
      (student) => student.id != e.target.id
    );
    setClassList(updatedClassList);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const generatedGroups = createGroupsObject(classList, 3);
    const finalGroupsArray = []
    for (let key in generatedGroups){
        if (typeof generatedGroups[key] === 'object'){
            finalGroupsArray.push(generatedGroups[key])
        }
    }
    setFinalGroups(finalGroupsArray)
  }

  function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

  function exportToCSV(){
    console.log('Export to CSV')
    console.log('Final Groups', finalGroups)
    const array = []
    for (let i = 0; i < finalGroups.length; i++){
        const currentGroup = finalGroups[i];
        const currentGroupArray = []
        for (let k = 0; k < currentGroup.length; k++){
            currentGroupArray.push(currentGroup[k].name)
        }
        array.push(currentGroupArray)
    }




    const jsonObject = JSON.stringify(array);
    console.log('Convert Obj to JSON', jsonObject)



    
    const CSVConvertedText = convertToCSV(jsonObject)
    
    console.log('CSV Converted Text', CSVConvertedText)

    var encodedUri = encodeURI(CSVConvertedText);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF
    
    link.click();
  }

  return (
    <div>
      {finalGroups && finalGroups.length ? (
        <div>
            <button onClick={exportToCSV}>Export to CSV</button>
            {finalGroups.map((group, idx) => {

            return(
            <div key={idx}>
            <p>Group #{idx + 1}</p>
            {group.map((student, studentIdx) => {
                return(
                    <div key={studentIdx}>{student.name}</div>
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
