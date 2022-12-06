import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetUser } from "./hooks/useGetUser";
import LoginProtect from "./layouts/LoginProtect";
import ManagerLayout from "./layouts/ManagerLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NormalUserHomePage from "./pages/nguoiDan/NormalUserHomePage";
import ManagerHomePage from "./pages/quanLi/ManagerHomePage";
import UserManager from "./pages/quanLi/user/UserManager";

function App() {
  useGetUser();
  return (
    <div className="">
      <Routes>
        <Route element={<LoginProtect />}>
          <Route path="/" element={<NormalUserHomePage />} />
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<ManagerHomePage />} />
            <Route path="users" element={<UserManager />} />
          </Route>
        </Route>
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
      <ToastContainer closeOnClick autoClose={3000} hideProgressBar />
    </div>
  );
}

export default App;
