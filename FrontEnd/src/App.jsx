import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";

import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/" Component={Login} />
      </Routes>
    </>
  );
}

export default App;
