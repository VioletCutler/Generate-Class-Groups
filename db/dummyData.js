// Class List
const studentList = [];
for (let i = 0; i < 50; i++) {
  studentList.push(`Student Number ${i}`);
}

console.log(studentList)
const absentStudentList = [];
for (let i = 0; i < 3; i++){
  const absentStudentListIndex = Math.floor(Math.random() * studentList.length)
  absentStudentList.push(studentList[absentStudentListIndex])
  studentList.splice(absentStudentListIndex, 1)
}





// For any students who need extra support, you can add them to this list and they will be added to a pre-existing group
const studentsToAddToPreexistingGroup = [
  // student1, student2
];

const haveToBePaired = {
  // 1: ["Student1", "Student2"],
};


const newUsers = [
  {
    username: 'Admin',
    password: '12345678',
    isAdmin: true
  },
  {
    username: 'Test User 1',
    password: '12345678',
    isAdmin: false
  }
]

module.exports = {
  studentList,
  haveToBePaired,
  absentStudentList,
  studentsToAddToPreexistingGroup,
  newUsers
};
