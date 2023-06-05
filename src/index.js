import { createRoot } from "react-dom/client";
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { 
    Nav,
    Homepage,
    Account
} from './components/index'

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false)

  return (
    <Router>
      <div>
        <h1>Generate Student Groups</h1>
        <Nav loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
        <main>
            <Routes>
                <Route path="/makegroups" element={<Homepage loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}/>
                <Route path='/' element={<Account/>}/>
            </Routes>
        </main>
      </div>
    </Router>
  );
};

const appElement = document.getElementById("app");
const root = createRoot(appElement);
root.render(<App />);
