import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import CreateActionReaction from "./pages/createActionReaction";

import AuthCallback from "./pages/AuthCallback";
import ServicesCallback from "./pages/servicesCallback";


const PrivateRoute = () => {
  let auth = localStorage.getItem("authToken")

  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function App() {
  console.log("TEST log");
  localStorage.setItem("authToken", "");
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute/>}>
        <Route path='/createActionReaction' element={<CreateActionReaction/>} />
        <Route path='/services/callback' element={<ServicesCallback/>} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path='/settings' element={<Settings/>} />
        <Route path='/home' element={<Home/>} />
      </Route>
      
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;