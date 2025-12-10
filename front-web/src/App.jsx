import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import CreateActionReaction from "./pages/createActionReaction";

import AuthCallback from "./pages/AuthCallback";
import ServicesCallback from "./pages/servicesCallback.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/createActionReaction" element={<CreateActionReaction />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/services/callback" element={<ServicesCallback />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;