import { useReactiveVar } from "@apollo/client";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import {
  LoginStatus,
  loginStatusVar,
  setLoginStatusToLocal,
  userVar,
} from "../../apollo/reactiveVar/loginStatusVar";
import { FormInput, FormInputProps } from "../../components/form/FormInput";
import LoadingButton from "../../components/LoadingButton";
import { useLoginLazyQuery } from "../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../utils/getApolloErrorMessage";

type Props = {};
type LoginInputForm = {
  canCuocCongDan: string;
  matKhau: string;
  ghiNhoDangNhap: boolean;
};
const loginInputSchema = yup.object().shape({
  canCuocCongDan: yup.string().required("Cần điền căn cước công dân"),
  matKhau: yup.string().required("Cần điền mật khẩu"),
});
const LoginPage = (props: Props) => {
  const navigate = useNavigate();
  const user = useReactiveVar(userVar);
  useEffect(() => {
    if (user) navigate("/");
  }, [user]);
  const [login, { loading }] = useLoginLazyQuery({
    onCompleted: (data) => {
      const { error, accessToken } = data.login;
      if (error) {
        toast.error(error.message);
        return;
      }
      if (!accessToken) {
        toast.error("Lỗi khi đăng nhập, thử lại sau");
        return;
      }
      const status: LoginStatus = {
        accessToken: accessToken,
        isLoggedIn: true,
      };
      loginStatusVar(status);
      if (getValues("ghiNhoDangNhap")) setLoginStatusToLocal(status);
    },
    onError: (error) => {
      const errorMsg = getApolloErrorMessage(error);
      toast.error(errorMsg);
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginInputForm>({
    resolver: yupResolver(loginInputSchema),
    mode: "onBlur",
  });
  const loginFormProps: FormInputProps[] = [
    {
      id: "canCuocCongDan",
      labelText: "Căn cước công dân",
      errorMessage: errors.canCuocCongDan?.message,
      registerReturn: register("canCuocCongDan"),
      type: "text",
    },
    {
      id: "matKhau",
      labelText: "Mật khẩu",
      errorMessage: errors.matKhau?.message,
      registerReturn: register("matKhau"),
      type: "password",
    },
  ];
  const submitHandler = (data: LoginInputForm) => {
    const { canCuocCongDan, matKhau } = data;
    login({
      variables: {
        input: {
          canCuocCongDan,
          matKhau,
        },
      },
    });
  };
  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        {/* <img className="mx-auto h-16 w-auto" alt="carIT" /> */}
        <FontAwesomeIcon
          className="w-16 h-16 text-indigo-700 mx-auto"
          icon={faHome}
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
            {loginFormProps.map((p, i) => (
              <FormInput key={i} {...p} />
            ))}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register("ghiNhoDangNhap")}
                  id="remember-me"
                  type="checkbox"
                  defaultChecked={true}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Ghi nhớ
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/auth/forgotpassword"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Quên mật khẩu
                </Link>{" "}
                hoặc{" "}
                <Link
                  to="/auth/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Đăng kí
                </Link>
              </div>
            </div>
            <LoadingButton loading={loading} text={"Đăng nhập"} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
