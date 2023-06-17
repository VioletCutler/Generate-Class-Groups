const helperObj = {
    currentRoom: 1,
    finalGroups: {
      projectName: "",
    },
    trackerString: "",
  };
  
  function addStudentsToPreexistingGroups(studentsArray) {
    if (helperObj.currentRoom > 1){
      helperObj.currentRoom = helperObj.currentRoom - 1;
    }
    for (let i = 0; i < studentsArray.length; i++) {
      helperObj.finalGroups[`roomNumber${helperObj.currentRoom}`].push(
        studentsArray[i]
      );
      if (helperObj.currentRoom > 1){helperObj.currentRoom--;
      }
    }
  }
  
  function placeGroupInRoom(studentArray) {
    helperObj.finalGroups[`roomNumber${helperObj.currentRoom}`] = studentArray;
    helperObj.currentRoom++;
  }
  
  function pickRandomStudent(listOfStudents, currentGroup) {
    let randomStudent =
      listOfStudents[Math.floor(Math.random() * listOfStudents.length)];
    while (currentGroup.includes(randomStudent)) {
      randomStudent = pickRandomStudent(listOfStudents, currentGroup);
    }
    return randomStudent;
  }
  
  function createGroupsObject(studentList, groupSize) {
  // This section needs to be reworked. It is a stopgap to prevent the 'pickRandomStudent()' from running an infinite loop. However, it will sort of mess up the intended groups sizes if the groups size is supposed to be 3
    if (studentList.length === groupSize) {
      placeGroupInRoom(studentList);
      return helperObj;
    }
    if (studentList.length < groupSize){
      addStudentsToPreexistingGroups(studentList)
      return helperObj;
    }
  
    const currentGroup = [];
    for (let i = 0; i < groupSize; i++) {
      currentGroup.push(pickRandomStudent(studentList, currentGroup));
    }
    placeGroupInRoom(currentGroup);
  
    const updatedStudentList = studentList.filter(
      (student) => !currentGroup.includes(student)
    );
  
    if (updatedStudentList.length > 0) {
      createGroupsObject(updatedStudentList, groupSize);
    }
    return helperObj.finalGroups;
  }
  

  module.exports = {
    // === helper functions === //
    pickRandomStudent,
    helperObj,
    createGroupsObject,
    addStudentsToPreexistingGroups,
  };
  