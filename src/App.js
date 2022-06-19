import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Grid from "./Componentes/Grid";

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
            <Route path="/" element={<Grid/>}>
            </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
