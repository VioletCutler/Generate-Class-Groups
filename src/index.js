import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import {
  Nav,
  CreateGroups,
  Account,
  Profile,
  UserInfo,
  Classrooms,
  SingleClassroom,
  Student
} from "./components/index";
import { getMe } from "./api/index";

const App = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [tokenErrorMessage, setTokenErrorMessage] = useState("");
  const [count, setCount] = useState(0)

  async function fetchMe() {
    try {
      const response = await getMe();
      if (response.success) {
        setTokenErrorMessage("");
        setUserInfo(response.instructor);
      } else if ((response.message = "jwt expired")) {
        setTokenErrorMessage("Your session has expired. You must log back in.");
        localStorage.removeItem("token");
        setLoggedIn(false);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (loggedIn){
      fetchMe();
    }
  }, [loggedIn])
  return (
    <div>
      <h1>Generate Student Groups</h1>
      <Nav loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <main>
        {tokenErrorMessage ? <p>{tokenErrorMessage}</p> : null}
        <Routes>
          {!loggedIn ? (
            <>
              <Route path="/" element={<Account setLoggedIn={setLoggedIn} />} />
              <Route
                path="*"
                element={
                  <p>This page does not exist or you are not logged in</p>
                }
              />
            </>
          ) : (
            <>
              <Route
                path="/"
                element={
                  <Profile loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                }
              />
              <Route
                path="/generategroups/:id"
                element={
                  <CreateGroups loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                }
              />
              <Route
                path="/userinfo"
                element={
                  <UserInfo
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                    setTokenErrorMessage={setTokenErrorMessage}
                    setLoggedIn={setLoggedIn}
                    count={count}
                    setCount={setCount}
                  />
                }
              />
              <Route
                path="/classrooms/:id"
                element={
                  <SingleClassroom
                    setUserInfo={setUserInfo}
                    userInfo={userInfo}
                    setTokenErrorMessage={setTokenErrorMessage}
                    setLoggedIn={setLoggedIn}
                    classrooms={userInfo.classrooms}
                    count={count}
                    setCount={setCount}
                  />
                }
              />
              <Route
                path="/classrooms"
                element={
                  <Classrooms
                    setUserInfo={setUserInfo}
                    userInfo={userInfo}
                    setTokenErrorMessage={setTokenErrorMessage}
                    setLoggedIn={setLoggedIn}
                    classrooms={userInfo.classrooms}
                    count={count}
                    setCount={setCount}
                  />
                }
              />
              <Route
              path="/studentinfo/:studentId"
              element={
                <Student 

                />
              } 
              />
              <Route path="*" element={<p>Path not resolved</p>} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
};

const appElement = document.getElementById("app");
const root = createRoot(appElement);
root.render(
  <Router>
    <App />
  </Router>
);
