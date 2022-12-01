import { useReactiveVar } from "@apollo/client";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userVar } from "./apollo/reactiveVar/loginStatusVar";
import { useGetUser } from "./hooks/useGetUser";
import LoginProtect from "./layouts/LoginProtect";
import ManagerProtect from "./layouts/ManagerProtect";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NormalUserHomePage from "./pages/nguoiDan/NormalUserHomePage";
import ManagerHomePage from "./pages/quanLi/ManagerHomePage";

function App() {
  useGetUser();
  const user = useReactiveVar(userVar);
  return (
    <div className="">
      <Routes>
        <Route element={<LoginProtect />}>
          <Route path="/" element={<NormalUserHomePage />} />
          <Route element={<ManagerProtect />}>
            <Route path="/manager" element={<ManagerHomePage />} />
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
