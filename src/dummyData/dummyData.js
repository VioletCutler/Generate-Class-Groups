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


const newInstructors = [
  {
    username: 'Admin',
    password: '12345678',
    isAdmin: true,
    email: "AdminUser@gmail.com"
  },
  {
    username: 'Test User 1',
    password: '12345678',
    isAdmin: false,
    email: "TestUser1@gmail.com"
  },
  {
    username: 'Test User 2',
    password: '12345678',
    isAdmin: false,
    email: "TestUser2@gmail.com"
  }
]

const newStudents = [
  {
    name: 'Gina S.',
    classroom: '2301-ftb-mt-web-ft',
    instructorId: 2
  },
  {
    name: 'Roberta P.',
    classroom: '2301-ftb-mt-web-ft',
    instructorId: 2
  },
  {
    name: 'Maxwell T.',
    classroom: '2301-ftb-mt-web-ft',
    instructorId: 2
  },
  {
    name: 'Juan R.',
    classroom: '2301-ftb-mt-web-ft',
    instructorId: 2
  },
  {
    name: 'Keesha L.',
    classroom: '2301-ftb-et-web-ft',
    instructorId: 1
  },
  {
    name: 'Trevor P.',
    classroom: '2301-ftb-et-web-ft',
    instructorId: 1
  },
  {
    name: 'Ramon R.',
    classroom: '2301-ftb-et-web-ft',
    instructorId: 1
  },
]

module.exports = {
  studentList,
  haveToBePaired,
  absentStudentList,
  studentsToAddToPreexistingGroup,
  newInstructors,
  newStudents
};
