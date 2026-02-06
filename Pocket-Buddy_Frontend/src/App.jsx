import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./Layout";
import "./axiosConfig"; // Import axios configuration

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
