import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Nav,
  CreateGroups,
  Account,
  Profile,
  UserInfo,
} from "./components/index";
import { getMe } from './api/index'

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoggedIn(true);
      const userInfo = getMe()
    }


  }, []);

  return (
    <Router>
      <div>
        <h1>Generate Student Groups</h1>
        <Nav loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <main>
          <Routes>
            {!loggedIn ? (
              <>
              <Route path="/" element={<Account setLoggedIn={setLoggedIn} />} />
              <Route path="*" element={<p>This page does not exist or you are not logged in</p>} /></>
            ) : (
              <>
                <Route
                  path="/"
                  element={
                    <Profile loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                  }
                />
                <Route
                  path="/creategroups"
                  element={
                    <CreateGroups
                      loggedIn={loggedIn}
                      setLoggedIn={setLoggedIn}
                    />
                  }
                />
                <Route path="/userinfo" element={<UserInfo />} />
                <Route path="*" element={<p>Path not resolved</p>} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const appElement = document.getElementById("app");
const root = createRoot(appElement);
root.render(<App />);
