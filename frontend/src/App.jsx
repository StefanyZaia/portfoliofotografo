import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Home from "./paginas/Home";
import Admin from "./paginas/Admin";
import Login from "./paginas/Login";
import AlbumDetails from "./paginas/AlbumDetails";
import "./App.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("@portfolio:token");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/albuns/:id" element={<AlbumDetails />} />

        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;