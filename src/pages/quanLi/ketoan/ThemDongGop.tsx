import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { isBoolean } from "lodash";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { FormInput } from "../../../components/form/FormInput";
import LoadingButton from "../../../components/form/LoadingButton";
import {
   useThemDongGopMutation,
} from "../../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";

type ThemDongGopInputForm = {
  hoKhauId: number;
  nguoiTamTruId: number;
  soTien: number;
};

const ThemDongGopInputSchema = yup.object().shape({
  soTien: yup.number().required("Cần điền thông tin"),
});
type Props = {};
const ThemDongGop: FC<Props> = () => {
  const navigate = useNavigate();
  const params= useParams();
  const {
    register,
    formState: { errors },
    getValues,
    reset,
    handleSubmit,
  } = useForm<ThemDongGopInputForm>({
    mode: "onBlur",
    resolver: yupResolver(ThemDongGopInputSchema),
  });

  const [ThemDongGop, { loading }] = useThemDongGopMutation();
  const submitHandler = async () => {
    const {
      soTien,
      hoKhauId,
      nguoiTamTruId,
    } = getValues();
    await ThemDongGop({
      variables: {
        input: {
        KhoanPhiId:+params.id!,
        soTienDongGop:+soTien,
        hoKhauId:+hoKhauId,
        nguoiTamTruId:+nguoiTamTruId,
    },
      },
      onCompleted(data) {
          console.log(data);
        const { addDongGop } = data;
        if (addDongGop.error) {
          toast.error(addDongGop.error.message);
          throw new Error();
        }
        reset();
        toast.success("Thêm thành công");
      },
      onError(err) {
        const msg = getApolloErrorMessage(err);
        if (msg) toast.error(msg);
        else toast.error("Lỗi xảy ra, thử lại sau");
        throw new Error();
      },
    });
  };
  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-8 pl-12 pr-16 pt-12 pb-16 "
    >
      <div className="space-y-8 sm:space-y-5">
        <div className="flex flex-col">
          <h3 className="leading-6 font-semibold text-gray-900 text-2xl mb-8">
            Thêm khoản phí
          </h3>
          <div className="space-y-4">
            <h1 className="text-indigo-700 font-bold text-lg mb-4">
              Thông tin cơ bản
            </h1>
            <div className="pl-4 grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="col-span-1">
                <FormInput
                  id="hoKhauId"
                  registerReturn={register("hoKhauId")}
                  labelText="Hộ khẩu"
                  errorMessage={errors.hoKhauId?.message}
                  type={"text"}
                />
              </div>
              <div className="col-span-1">
                <FormInput
                  id="nguoiTamTruId"
                  registerReturn={register("nguoiTamTruId")}
                  labelText="Người tạm trú"
                  errorMessage={errors.nguoiTamTruId?.message}
                  type={"text"}
                />
              </div>
              <div className="col-span-1">
                <FormInput
                  id="soTien"
                  registerReturn={register("soTien")}
                  labelText="Số Tiền"
                  errorMessage={errors.soTien?.message}
                  type={"text"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-5 flex justify-end space-x-3">
        <button
          onClick={() => navigate("/account")}
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Huỷ
        </button>
        <LoadingButton
          loading={loading}
          text="Thêm Đóng Góp"
          className="w-fit"
        />
      </div>
    </form>
  );
};
export default ThemDongGop;
