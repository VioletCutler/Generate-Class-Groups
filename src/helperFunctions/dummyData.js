// Class List
const studentList = [];
for (let i = 0; i < 50; i++) {
  studentList.push(`Student Number ${i}`);
}
const absentStudents = [];


// For any students who need extra support, you can add them to this list and they will be added to a pre-existing group
const studentsToAddToPreexistingGroup = [
  // student1, student2
];

const haveToBePaired = {
  // 1: ["Student1", "Student2"],
};

module.exports = {
  studentList,
  haveToBePaired,
  absentStudents,
  studentsToAddToPreexistingGroup,
};
