import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { FormInput } from "../../../components/form/FormInput";
import LoadingButton from "../../../components/form/LoadingButton";
import { SERVER_URL } from "../../../config";
import {
  StoredFileInputType,
  useAddTamTruMutation,
} from "../../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";

type AddTamTruInputForm = {
  nguoiTamTruId: string;
  noiTamTruHienTai: string;
};
const AddTamTruInputSchema = yup.object().shape({
  nguoiTamTruId: yup.string().required("Cần điền thông tin"),
  noiTamTruHienTai: yup.string().required("Cần điền thông tin"),
});
type Props = {};
const AddTamTru: FC<Props> = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>();
  const [loadingMain, setLoadingMain] = useState(false);
  const {
    register,
    formState: { errors },
    getValues,
    reset,
    handleSubmit,
  } = useForm<AddTamTruInputForm>({
    mode: "onBlur",
    resolver: yupResolver(AddTamTruInputSchema),
  });

  const [AddTamTru] = useAddTamTruMutation();
  const submitHandler = async () => {
    setLoadingMain(true);
    await AddTamTru({
      variables: {
        input: {
          ...getValues(),
        },
      },
      onCompleted(data) {
        const { addTamTru } = data;
        if (addTamTru.error) {
          toast.error(addTamTru.error.message);
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
            Thêm nhân khẩu
          </h3>
          <div className="space-y-4">
            <h1 className="text-indigo-700 font-bold text-lg mb-4">
              Thông tin cơ bản
            </h1>
            <div className="pl-4 grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="col-span-1">
                <FormInput
                  id="nguoiTamTruId"
                  registerReturn={register("nguoiTamTruId")}
                  labelText="ID người tạm trú (*)"
                  errorMessage={errors.nguoiTamTruId?.message}
                  type={"text"}
                />
              </div>
              <div className="col-span-1">
                <FormInput
                  id="noiTamTruHienTai"
                  registerReturn={register("noiTamTruHienTai")}
                  labelText="Nơi tạm trú hiện tại (*)"
                  errorMessage={errors.noiTamTruHienTai?.message}
                  type={"text"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-5 flex justify-end space-x-3">
        <button
          onClick={() => navigate("/tamtru/manager")}
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Huỷ
        </button>
        {/* <button onClick={handleSubmit(submitHandler)}>Thêm</button> */}
        <LoadingButton
          loading={loadingMain}
          text="Thêm tạm trú"
          className="w-fit"
        />
      </div>
    </form>
  );
};
export default AddTamTru;
