import { useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  loginStatusVar,
  LOGIN_STATUS,
  userVar,
} from "../apollo/reactiveVar/loginStatusVar";

import { useUserLazyQuery } from "../graphql/generated/schema";

export function useGetUser() {
  const [userQuery] = useUserLazyQuery({
    onCompleted(data) {
      const {
        xemThongTinNguoiDung: { user, error },
      } = data;
      if (error || !user) toast.error("Không thể nhận thông tin người dùng");
      userVar(user);
    },
    onError(err) {
      localStorage.removeItem(LOGIN_STATUS);
      userVar(null);
      loginStatusVar({
        accessToken: null,
        isLoggedIn: false,
      });
    },
    fetchPolicy: "network-only",
  });
  const user = useReactiveVar(userVar);
  const loginStatus = useReactiveVar(loginStatusVar);
  useEffect(() => {
    if (!loginStatus) return;
    if (!loginStatus.isLoggedIn) return;
    if (!user) userQuery();
  }, [user, loginStatus]);
}
