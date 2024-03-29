export async function apiHealth() {
  try {
    const response = await fetch(`http://localhost:1337/api/health`);
    console.log("API response :", response);
  } catch (error) {
    console.error(error);
  }
}

export async function registerUser({ name, username, email, password }) {
  try {
    const response = await fetch(
      "http://localhost:1337/api/instructors/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
        }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function loginUser({ username, password }) {
  try {
    const response = await fetch(
      "http://localhost:1337/api/instructors/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function createClassroom({ classroomName, inSession }) {
  try {
    const response = await fetch("http://localhost:1337/api/classrooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        classroomName,
        inSession,
      }),
    });
    const data = response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getMe() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:1337/api/instructors/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateUserInfo({
  name,
  username,
  email,
  isActive = true,
}) {
  try {
    const response = await fetch("http://localhost:1337/api/instructors", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name,
        username,
        email,
        isActive,
      }),
    });
    const data = response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteAccount(instructorId){
  try {
    const response = await fetch(`http://localhost:1337/api/instructors/${instructorId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await response.json();
    return data
  } catch (error) {
    console.error(error)
  }
}

// Classrooms ============ //

export async function getClassroomById(id) {
  try {
    const response = await fetch(`http://localhost:1337/api/classrooms/${id}`, {
      headers : {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await response.json();
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function updateClassroomInfo({id, name, inSession}){
  try {
    const response = await fetch(`http://localhost:1337/api/classrooms/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        name, inSession
      })
    })
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error)
  }
}

export async function deleteClassroom(id) {
  try {
    const response = await fetch(`http://localhost:1337/api/classrooms/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await response.json();
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function addStudentToClass({student, classroomId}){
  try {
    const response = await fetch(`http://localhost:1337/api/students/enrollment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        student,
        classroomId
      })
    })
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error)
  }
}

export async function updateStudent({studentId, name}){
  try {
    const response = await fetch(`http://localhost:1337/api/students/${studentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        name
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error)
  }
}

export async function getStudentById(id){
  try {
    const response = await fetch(`http://localhost:1337/api/students/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
    )
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error)
  }
}

export async function deleteStudent(id){
  try {
    const response = await fetch(`http://localhost:1337/api/students/${id}`,
    {
      headers: {
        'Content-Type': 'application-json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      method: 'DELETE'
    }
    )
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error)
  }
}