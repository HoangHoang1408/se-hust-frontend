import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetUser } from "./hooks/useGetUser";
import KeToanLayout from "./layouts/KeToanLayout";
import LoginProtect from "./layouts/LoginProtect";
import ManagerLayout from "./layouts/ManagerLayout";
import NormalUserLayout from "./layouts/UserLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ChangePassword from "./pages/nguoiDan/ChangePassword";
import NormalUserHomePage from "./pages/nguoiDan/NormalUserHomePage";
import TamTruUserPage from "./pages/nguoiDan/TamTru";
import ThanhVien from "./pages/nguoiDan/ThanhVien";
import UserDetailsForUsers from "./pages/nguoiDan/UserDetailsForUsers";
import CapNhatHoKhau from "./pages/quanLi/hoKhau/CapNhatHoKhau";
import HoKhauDetail from "./pages/quanLi/hoKhau/HoKhauDetail";
import QuanLiHoKhau from "./pages/quanLi/hoKhau/QuanLiHoKhau";
import TachHoKhau from "./pages/quanLi/hoKhau/TachHoKhau";
import ThemHoKhau from "./pages/quanLi/hoKhau/ThemHoKhau";
import KhoanPhiDetails from "./pages/quanLi/ketoan/KhoanPhiDetails";
import ThemDongGop from "./pages/quanLi/ketoan/ThemDongGop2";
import AddKhoanPhi from "./pages/quanLi/ketoan/ThemKhoanPhi";
import DanhSachKhoanPhi from "./pages/quanLi/ketoan/XemKhoanPhi";
import ManagerHomePage from "./pages/quanLi/ManagerHomePage";
import AddTamTru from "./pages/quanLi/tamTru/AddTamTru";
import EditTamTru from "./pages/quanLi/tamTru/EditTamTru";
import HetTamTru from "./pages/quanLi/tamTru/HetTamTru";
import QuanLiTamTru from "./pages/quanLi/tamTru/QuanLiTamTru";
import ThongKeUser from "./pages/quanLi/thongKeUser/ThongKeUser";
import AddTamVang from "./pages/quanLi/tamVang/AddTamVang";
import EditTamVang from "./pages/quanLi/tamVang/EditTamVang";
import KetThucTamVang from "./pages/quanLi/tamVang/KetThucTamVang";
import QuanLiTamVang from "./pages/quanLi/tamVang/QuanLiTamVang";
import AddUser from "./pages/quanLi/user/AddUser";
import EditUser from "./pages/quanLi/user/EditUser";
import UserDetails from "./pages/quanLi/user/UserDetails";
import UserManager from "./pages/quanLi/user/UserManager";
import DanhSachDongGopChoNguoiDung from "./pages/quanLi/user/XemDanhSachDongGopChoNguoiDung";

function App() {
  useGetUser();
  return (
    <div className="">
      <Routes>
        <Route element={<LoginProtect />}>
          <Route path="/" element={<NormalUserLayout />}>
            <Route index element={<NormalUserHomePage />} />
            <Route path="thanhvien/:id" element={<ThanhVien />} />
            <Route path="thongtin" element={<UserDetailsForUsers />} />
            <Route path="changepassword" element={<ChangePassword />} />
            <Route path="tamtru" element={<TamTruUserPage />} />
            <Route
              path="account/user"
              element={<DanhSachDongGopChoNguoiDung />}
            />
          </Route>
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<ThongKeUser />} />
            <Route path="users">
              <Route index element={<UserManager />} />
              <Route path="add" element={<AddUser />} />
              <Route path=":id" element={<UserDetails />} />
              <Route path="edit/:id" element={<EditUser />} />
            </Route>
            <Route path="hokhau">
              <Route index element={<QuanLiHoKhau />} />
              <Route path="them" element={<ThemHoKhau />} />
              <Route path="phanchia/:id" element={<TachHoKhau />} />
              <Route path=":id" element={<HoKhauDetail />} />
              <Route path="capnhat/:id" element={<CapNhatHoKhau />} />
            </Route>
            <Route path="tamtru">
              <Route index element={<QuanLiTamTru />} />
              <Route path="add" element={<AddTamTru />} />
              <Route path="edit" element={<EditTamTru />} />
              <Route path="end" element={<HetTamTru />} />
            </Route>
            <Route path="tamvang">
              <Route index element={<QuanLiTamVang />} />
              <Route path="add" element={<AddTamVang />} />
              <Route path="edit" element={<EditTamVang />} />
              <Route path="ketthuc" element={<KetThucTamVang />} />
            </Route>
          </Route>
          <Route path="/account" element={<KeToanLayout />}>
            <Route index element={<div>Account page</div>} />
            <Route path="add" element={<AddKhoanPhi />} />
            <Route path="show" element={<DanhSachKhoanPhi />} />
            <Route path="khoanphi/:id" element={<KhoanPhiDetails />} />
            <Route path="edit/:id" element={<ThemDongGop />} />
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
