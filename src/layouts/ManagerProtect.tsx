import { useReactiveVar } from "@apollo/client";
import { Fragment, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { userVar } from "../apollo/reactiveVar/loginStatusVar";
import { VaitroNguoiDung } from "../graphql/generated/schema";

type Props = {};

const ManagerProtect = (props: Props) => {
  const user = useReactiveVar(userVar);
  const navigate = useNavigate();
  useEffect(() => {
    if (
      user &&
      ![VaitroNguoiDung.ToTruong, VaitroNguoiDung.ToPho].includes(
        user.vaiTroNguoiDung
      )
    )
      navigate("/");
  }, [user]);
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
};

export default ManagerProtect;
