import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { 
    Nav,
    Homepage,
    Login,
    Register 
} from './components/index'

const App = () => {
  return (
    <Router>
      <div>
        <h1>Generate Student Groups</h1>
        <Nav/>
        <main>
            <Routes>
                <Route path="/" element={<Homepage/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
            </Routes>
        </main>
      </div>
    </Router>
  );
};

const appElement = document.getElementById("app");
const root = createRoot(appElement);
root.render(<App />);
