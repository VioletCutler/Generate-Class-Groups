import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Nav, CreateGroups, Account, Profile } from "./components/index";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <div>
        <h1>Generate Student Groups</h1>
        <Nav loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <main>
          <Routes>
            {!loggedIn ?   <Route
              path="/"
              element={<Account setLoggedIn={setLoggedIn} />}
            /> : <>
            <Route path="/" element={<Profile loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
            <Route
              path="/creategroups"
              element={
                <CreateGroups loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
              }
            />
            </>}
            
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const appElement = document.getElementById("app");
const root = createRoot(appElement);
root.render(<App />);
