import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./paginas/Home";
import Admin from "./paginas/Admin";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;