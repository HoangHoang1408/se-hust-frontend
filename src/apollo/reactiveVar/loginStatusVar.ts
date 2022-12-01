import { makeVar } from "@apollo/client";
import { UserFragmentFragment } from "../../graphql/generated/schema";

export const LOGIN_STATUS = "LOGIN_STATUS";
export type LoginStatus = {
  isLoggedIn: boolean;
  accessToken: string | null;
};
export function setLoginStatusToLocal(status: LoginStatus) {
  localStorage.setItem(LOGIN_STATUS, JSON.stringify(status));
}
export function getLoginStatusFromLocal(): LoginStatus {
  const temp = localStorage.getItem(LOGIN_STATUS);
  if (!temp)
    return {
      accessToken: null,
      isLoggedIn: false,
    };
  return JSON.parse(temp) as LoginStatus;
}
export function logout() {
  localStorage.removeItem(LOGIN_STATUS);
  loginStatusVar({
    accessToken: null,
    isLoggedIn: false,
  });
  userVar(null);
}
export const loginStatusVar = makeVar<LoginStatus>(getLoginStatusFromLocal());
export const userVar = makeVar<UserFragmentFragment | null>(null);
