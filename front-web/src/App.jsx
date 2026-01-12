import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import CreateActionReaction from "./pages/createActionReaction";
import AuthCallback from "./pages/AuthCallback";
import ServicesCallback from "./pages/servicesCallback";
import AdminPage from "./pages/AdminPage";


const PrivateRoute = () => {
  let auth = localStorage.getItem("authToken")

  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function App() {
<<<<<<< HEAD
=======
  localStorage.setItem("authToken", "");
  localStorage.setItem("userId", "");
  localStorage.setItem("userName", "");
  localStorage.setItem("userEmail", "");
  localStorage.setItem("oauth_return", "");

>>>>>>> c3fb2346acf96a620e945084304faa5b18a2c06a
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<AdminPage />} />

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