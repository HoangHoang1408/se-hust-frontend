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
import { useEditDongGopMutation } from "../../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";

type EditDongGopInputForm = {
  soTienDongGop: number;
  ngayNop: Date;
};

const EditDongGopInputSchema = yup.object().shape({
  soTienDongGop: yup.number().required("Cần điền thông tin"),
  ngayNop: yup.date().required("Cần điền thông tin"),
});
type Props = {};
const EditDongGop: FC<Props> = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    getValues,
    reset,
    handleSubmit,
  } = useForm<EditDongGopInputForm>({
    mode: "onBlur",
    resolver: yupResolver(EditDongGopInputSchema),
  });
  const [EditDongGop, { loading }] = useEditDongGopMutation();
  const params = useParams();
  console.log(register);
  const { ngayNop, soTienDongGop } = getValues();
  const submitHandler = async () => {
    await EditDongGop({
      variables: {
        input: {
          dongGopId: +params.id!,
          ngayNop: ngayNop.toLocaleString(),
          soTienDongGop: +soTienDongGop,
        },
      },
      onCompleted(data) {
        console.log("dafs");
        const { EditDongGop } = data;
        if (EditDongGop.error) {
          toast.error(EditDongGop.error.message);
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
                  id="ngayNop"
                  registerReturn={register("ngayNop")}
                  labelText="Ngày nộp (*)"
                  errorMessage={errors.ngayNop?.message}
                  type={"date"}
                />
              </div>
              <div className="col-span-1">
                <FormInput
                  id="soTienDongGop"
                  registerReturn={register("soTienDongGop")}
                  labelText="Số Tiền"
                  errorMessage={errors.soTienDongGop?.message}
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
          text="Thêm Khoản Phí"
          className="w-fit"
        />
      </div>
    </form>
  );
};
export default EditDongGop;
