import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { FormInput, FormInputProps } from "../../components/form/FormInput";
import LoadingButton from "../../components/form/LoadingButton";
import { useRegisterMutation } from "../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../utils/getApolloErrorMessage";
interface SignUpInputForm {
  canCuocCongDan: string;
  matKhau: string;
  matKhauLapLai: string;
}
const signupInputSchema = yup.object().shape({
  canCuocCongDan: yup.string().required("Cần điền căn cước công dân"),
  matKhau: yup.string().required("Cần điền mật khẩu"),
  matKhauLapLai: yup.string().required("Cần điền xác nhận mật khẩu"),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpInputForm>({
    resolver: yupResolver(signupInputSchema),
    mode: "onBlur",
  });
  const [registerUser, { loading }] = useRegisterMutation();
  const signupFormProps: FormInputProps[] = [
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
    {
      id: "matKhauLapLai",
      labelText: "Mật khẩu xác nhận",
      errorMessage: errors.matKhauLapLai?.message,
      registerReturn: register("matKhauLapLai"),
      type: "password",
    },
  ];
  const submitHandler: SubmitHandler<SignUpInputForm> = async (data) => {
    if (data.matKhauLapLai !== data.matKhau) {
      setError("matKhauLapLai", { message: "Mật khẩu xác nhận không đúng" });
      return;
    }
    const { canCuocCongDan, matKhau, matKhauLapLai } = data;
    registerUser({
      variables: {
        input: {
          canCuocCongDan,
          matKhau,
          matKhauLapLai,
        },
      },
      onCompleted: (data) => {
        const {
          registerUser: { ok, error },
        } = data;
        if (error) {
          toast.error(error.message);
          return;
        }
        if (ok) {
          toast.success("Đăng ký thành công");
          navigate("/auth/login");
        }
      },
      onError: (error) => {
        const errorMessage = getApolloErrorMessage(error);
        if (errorMessage) toast.error(errorMessage);
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
          Tạo tài khoản mới
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-2">
            {signupFormProps.map((p, i) => (
              <FormInput key={i} {...p} />
            ))}
            <div className="flex justify-end text-sm space-x-1">
              <p>Đã có tài khoản?</p>
              <Link
                to={"/auth/login"}
                className="text-indigo-600 cursor-pointer"
              >
                Đăng nhập
              </Link>
            </div>
            <LoadingButton loading={loading} text={"Đăng kí"} />
          </form>
        </div>
      </div>
    </div>
  );
}
