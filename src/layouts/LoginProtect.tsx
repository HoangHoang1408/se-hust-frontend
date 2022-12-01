import { useReactiveVar } from "@apollo/client";
import { Fragment, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { loginStatusVar } from "../apollo/reactiveVar/loginStatusVar";

type Props = {};

const LoginProtect = (props: Props) => {
  const navigate = useNavigate();
  const loginStatus = useReactiveVar(loginStatusVar);
  useEffect(() => {
    if (!loginStatus || !loginStatus.isLoggedIn) navigate("/auth/login");
  }, [loginStatus]);
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
};

export default LoginProtect;
