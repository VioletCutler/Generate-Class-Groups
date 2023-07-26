const seedInstructors = [
  {
    name: "Administrator",
    username: "Admin",
    password: "12345678",
    isAdmin: true,
    email: "AdminUser@gmail.com",
  },
  {
    name: "Davey",
    username: "Test User 1",
    password: "12345678",
    isAdmin: false,
    email: "TestUser1@gmail.com",
  },
  {
    name: "Joan",
    username: "Test User 2",
    password: "12345678",
    isAdmin: false,
    email: "TestUser2@gmail.com",
  },
  {
    name: "Kiley",
    username: "Test User 3",
    password: "12345678",
    isAdmin: false,
    email: "TestUser3@gmail.com",
  },
  {
    name: "Rafiq",
    username: "Test User 4",
    password: "12345678",
    isAdmin: false,
    email: "TestUser4@gmail.com",
  },
  {
    name: "Jose",
    username: "Test User 5",
    password: "12345678",
    isAdmin: false,
    email: "TestUser5@gmail.com",
  },
  {
    name: "Liu",
    username: "Test User 6",
    password: "12345678",
    isAdmin: false,
    email: "TestUser6@gmail.com",
  },
  {
    name: "Marcus",
    username: "Test User 7",
    password: "12345678",
    isAdmin: false,
    email: "TestUser7@gmail.com",
  },
  {
    name: "Nava",
    username: "Test User 8",
    password: "12345678",
    isAdmin: false,
    email: "TestUser8@gmail.com",
  },
  {
    name: "Asha",
    username: "Test User 9",
    password: "12345678",
    isAdmin: false,
    email: "TestUser9@gmail.com",
  },
  {
    name: "Beata",
    username: "Test User 10",
    password: "12345678",
    isAdmin: false,
    email: "TestUser10@gmail.com",
  },
];

const seedStudentNames = [
  "Liam A.",
  "Noah B.",
  "Oliver C.",
  "Elijah D.",
  "James E.",
  "William F.",
  "Benjamin G.",
  "Lucas H.",
  "Henry I.",
  "Theodore T.",
  "Jack J.",
  "Levi L.",
  "Alexander A.",
  "Jackson J.",
  "Mateo M.",
  "Daniel D.",
  "Michael M.",
  "Mason M.",
  "Sebastian S.",
  "Ethan E.",
  "Logan L.",
  "Owen O.",
  "Samuel S.",
  "Jacob J.",
  "Asher A.",
  "Aiden A.",
  "John J.",
  "Joseph J.",
  "Wyatt W.",
  "David D.",
  "Leo L.",
  "Luke L.",
  "Julian J.",
  "Hudson H.",
  "Grayson G.",
  "Matthew M.",
  "Ezra E.",
  "Gabriel G.",
  "Carter C.",
  "Issac I.",
  "Jayden J.",
  "Luca L.",
  "Anthony A.",
  "Dylan D.",
  "Lincoln L.",
  "Thomas T.",
  "Maverick M.",
  "Elias E.",
  "Josiah J.",
  "Charles C.",
  "Olivia O.",
  "Emma E.",
  "Charlotte C.",
  "Amelia A.",
  "Ava A.",
  "Sophia S.",
  "Isabella I.",
  "Mia M.",
  "Evelyn E.",
  "Harper H.",
  "Luna L.",
  "Camila C.",
  "Gianna G.",
  "Elizabeth E.",
  "Eleanor E.",
  "Ella E.",
  "Abigail A.",
  "Sofia S.",
  "Avery A.",
  "Scarlett S.",
  "Emily E.",
  "Aria A.",
  "Penelope P.",
  "Chloe C.",
  "Layla L.",
  "Mila M.",
  "Nora N.",
  "Hazel H.",
  "Madison M.",
  "Ellie E.",
  "Lily L.",
  "Nova N.",
  "Isla I.",
  "Grace G.",
  "Aurora A.",
  "Riley R.",
  "Zoey Z.",
  "Willow W.",
  "Emilia E.",
  "Stella S.",
  "Stella S.",
  "Victoria V.",
  "Hannah H.",
  "Addison A.",
  "Leah L.",
  "Lucy L.",
  "Eliana E.",
  "Ivy I.",
  "Evelyn E.",
  "Lillian L.",
  "Liam Z.",
  "Noah X.",
  "Oliver Y.",
  "Elijah Q.",
  "James W.",
  "William R.",
  "Benjamin S.",
  "Lucas T.",
  "Henry A.",
  "Theodore A.",
  "Jack B.",
  "Levi C.",
  "Alexander D.",
  "Jackson E.",
  "Mateo F.",
  "Daniel G.",
  "Michael H.",
  "Mason I.",
  "Sebastian J.",
  "Ethan K.",
  "Logan K.",
  "Owen L.",
  "Samuel M.",
  "Jacob S.",
  "Asher O.",
  "Aiden P.",
  "John Q.",
  "Joseph R.",
  "Wyatt S.",
  "David T.",
  "Leo U.",
  "Luke V.",
  "Julian W.",
  "Hudson X.",
  "Grayson Y.",
  "Matthew Z.",
  "Ezra A.",
  "Gabriel B.",
  "Carter D.",
  "Issac C.",
  "Jayden E.",
  "Luca D.",
  "Anthony F.",
  "Dylan G.",
  "Lincoln H.",
  "Thomas I.",
  "Maverick J.",
  "Elias K.",
  "Josiah L.",
  "Charles M.",
  "Olivia N.",
  "Emma O.",
  "Charlotte P.",
  "Amelia Q.",
  "Ava R.",
  "Sophia T.",
  "Isabella S.",
  "Mia Y.",
  "Evelyn T.",
  "Harper U.",
  "Luna V.",
  "Camila Q.",
  "Gianna W.",
  "Elizabeth X.",
  "Eleanor Y.",
  "Ella Z.",
  "Abigail S.",
  "Sofia A.",
  "Avery B.",
  "Scarlett C.",
  "Emily D.",
  "Aria E.",
  "Penelope R.",
  "Chloe G.",
  "Layla H.",
  "Mila I.",
  "Nora J.",
  "Hazel K.",
  "Madison L.",
  "Ellie M.",
  "Lily N.",
  "Nova O.",
  "Isla P.",
  "Grace Q.",
  "Aurora R.",
  "Riley S.",
  "Zoey T.",
  "Willow U.",
  "Emilia V.",
  "Stella Q.",
  "Stella R.",
  "Victoria S.",
  "Hannah T.",
  "Addison U.",
  "Leah V.",
  "Lucy Q.",
  "Eliana W.",
  "Ivy X.",
  "Evelyn Y.",
  "Lillian Z.",
];

const seedStudents = seedStudentNames.map((student) => {
return {name:student}
})

const seedClassrooms = [
  {
    name: "2301-ftb-mt-web-ft",
    inSession: false,
  },
  {
    name: "2301-ftb-et-web-ft",
    inSession: false,
  },
  {
    name: "2303-ftb-mt-web-ft",
    inSession: false,
  },
  {
    name: "2303-ftb-et-web-ft",
    inSession: false,
  },
  {
    name: "2305-ftb-mt-web-ft",
    inSession: false,
  },
  {
    name: "2305-ftb-et-web-ft",
    inSession: false,
  },
  {
    name: "2308-ftb-mt-web-ft",
    inSession: false,
  },
  {
    name: "2308-ftb-et-web-ft",
    inSession: false,
  },
  {
    name: "2310-ftb-mt-web-ft",
    inSession: true,
  },
  {
    name: "2310-ftb-et-web-ft",
    inSession: true,
  },
  {
    name: "2401-ftb-mt-web-ft",
    inSession: true,
  },
  {
    name: "2401-ftb-et-web-ft",
    inSession: true,
  },
];


function createSeedClassEnrollments(studentList){
    const seedClassEnrollments = []
    
    const studentsAlreadyPicked = []
    for (let i = 0; i < studentList.length; i++){
      let randomStudentIndex = Math.ceil(Math.random(0, 1) * studentList.length)
      while (studentsAlreadyPicked.includes(randomStudentIndex)){
        randomStudentIndex = Math.ceil(Math.random(0, 1) * studentList.length)
      }
      studentsAlreadyPicked.push(randomStudentIndex)

      seedClassEnrollments.push({
          classroomId: Math.ceil(Math.random(0, 1) * seedClassrooms.length),
          studentId: randomStudentIndex
      })

    }
    return seedClassEnrollments;
}

function createSeedInstructorAssignments(instructorsList){
  const seedClassAssignments = []
    
  const instructorsAlreadyPicked = []
    for (let i = 0; i < instructorsList.length; i++){
      let randomInstructorIndex = Math.ceil(Math.random(0, 1) * instructorsList.length)
      while (instructorsAlreadyPicked.includes(randomInstructorIndex)){
        randomInstructorIndex = Math.ceil(Math.random(0, 1) * instructorsList.length)
      }
      instructorsAlreadyPicked.push(randomInstructorIndex)

      seedClassAssignments.push({
          classroomId: Math.ceil(Math.random(0, 1) * seedClassrooms.length),
          instructorId: randomInstructorIndex
      })

    }

    return seedClassAssignments;
}

module.exports = {
  seedInstructors,
  seedStudents,
  seedClassrooms,
  createSeedClassEnrollments,
  createSeedInstructorAssignments
};
