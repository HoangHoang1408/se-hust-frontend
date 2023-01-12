import TextSearchInput from "../../components/form/TextSearchInput";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput } from "../../components/form/FormInput";
import { FC } from "react";
import LoadingButton from "../../components/form/LoadingButton";
import { useNavigate } from "react-router-dom";
import { useChangePasswordMutation } from "../../graphql/generated/schema";
import { toast } from "react-toastify";
import { getApolloErrorMessage } from "../../utils/getApolloErrorMessage";

type ChangePasswordInputForm = {
  matKhauCu: string;
  matKhauMoi: string;
  matKhauLapLai: string;
};
const ChangePasswordInputSchema = yup.object().shape({
  matKhauCu: yup.string().required("Cần điền mật khẩu cũ"),
  matKhauMoi: yup.string().required("Cần điền mật khẩu mới"),
  matKhauLapLai: yup.string().required("Cần điền mật khẩu mới lặp lại"),
});

const ChangePassword: FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<ChangePasswordInputForm>({
    resolver: yupResolver(ChangePasswordInputSchema),
    mode: "onBlur",
  });

  const [changePassword, { loading }] = useChangePasswordMutation({
    onCompleted: (data) => {
      const { error, ok } = data.changePassword;
      if (ok) {
        toast.success("Đổi mật khẩu thành công");
        reset();
        return;
      }
      if (error) {
        toast.error(error.message);
        return;
      }
    },

    onError: (error) => {
      const errorMsg = getApolloErrorMessage(error);
      toast.error(errorMsg);
    },
  });

  const submitHandler = (data: ChangePasswordInputForm) => {
    const { matKhauCu, matKhauMoi, matKhauLapLai } = data;
    changePassword({
      variables: {
        input: {
          matKhauCu,
          matKhauMoi,
          matKhauMoiLapLai: matKhauLapLai,
        },
      },
    });
  };
  return (
    <div>
      <div className="mx-7 my-7 ">
        <h1 className="text-2xl font-medium leading-6 text-indigo-700 sm:truncate border-b-2 pb-2 border-b-gray-300">
          Đổi mật khẩu
        </h1>
      </div>
      <form className=" pl-20 " onSubmit={handleSubmit(submitHandler)}>
        <div className=" w-1/2 flex flex-col space-y-4">
          <FormInput
            id={"matkhaucu"}
            labelText="Mật khẩu cũ"
            errorMessage={errors.matKhauCu?.message}
            registerReturn={register("matKhauCu")}
            type={"password"}
          />
          <FormInput
            id={"matkhaumoi"}
            labelText="Mật khẩu mới"
            errorMessage={errors.matKhauMoi?.message}
            registerReturn={register("matKhauMoi")}
            type={"password"}
          />
          <FormInput
            id={"matkhaulaplai"}
            labelText="Mật khẩu lặp lại"
            errorMessage={errors.matKhauLapLai?.message}
            registerReturn={register("matKhauLapLai")}
            type={"password"}
          />
          <div className="flex space-x-5 justify-end mt-8 ">
            <button
              onClick={() => navigate("/")}
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Huỷ
            </button>
            <div className="w-16">
              <LoadingButton loading={loading} text={"Đổi"} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
