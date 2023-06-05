export async function apiHealth() {
  try {
    const response = await fetch(`http://localhost:1337/api/health`);
    console.log("API response :", response);
  } catch (error) {
    console.log(error);
  }
}

export async function registerUser({ name, username, email, password }) {
  try {
    console.log(name, username, email, password);
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
    console.log(data)
    if (data.success){
        localStorage.setItem('token', data.token)
    }
  } catch (error) {
    console.log(error);
  }
}

export async function loginUser({username, password}){
  try {
    const response = await fetch('http://localhost:1337/api/instructors/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username, 
        password
      })
    })
    const data = await response.json();
    return data
  } catch (error) {
    console.log(error)
  }
}

export async function createClassroom({classroomName, inSession}){
  try {
    const response = await fetch('http://localhost:1337/api/classrooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: json.stringify({
        classroomName,
        inSession
      })
    })
    const data = response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}