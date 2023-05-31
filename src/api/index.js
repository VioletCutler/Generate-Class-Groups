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
