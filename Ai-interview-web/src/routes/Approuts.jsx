import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import About from '../pages/About'
 
 
import Header from "../components/common/Header"; // Adjust path as needed
import Upgrade from "../pages/Upgrade";
import Howitwork from "@/pages/Howitwork";
import NotFound from "@/pages/NotFound";

function AppRoutes() {
  return (
    <>
      <Header /> {/* Show header on all pages */}
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sign-in/*" element={<Login routing="path" path="/sign-in" />} />
        <Route path="/sign-up/*" element={<Signup routing="path" path="/sign-up" />} />
        <Route path="/about/*" element={<About routing="path" path="/about" />} />
        <Route path="/upgrade/*" element={<Upgrade routing="path" path="/upgrade" />} />
        <Route path="/howitwork/*" element={<Howitwork routing="path" path="/howitwork" />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
