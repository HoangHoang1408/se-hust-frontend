import { yupResolver } from "@hookform/resolvers/yup";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { FormInput } from "../../../components/form/FormInput";
import LoadingButton from "../../../components/form/LoadingButton";
import {
  useDanhSachNguoiDungLazyQuery,
  UserFragmentFragment,
  useSuaThongTinTamVangMutation,
} from "../../../graphql/generated/schema";
import { loadingWhite } from "../../../images";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";
import { SearchThanhVienInputs } from "../hoKhau/ThemHoKhau";

const EditTamVang: FC = () => {
  const navigate = useNavigate();
  const [nguoiYeuCau, setNguoiYeuCau] = useState<UserFragmentFragment>();
  const [suaTamVang, { loading }] = useSuaThongTinTamVangMutation();
  const {
    register,
    formState: { errors },
    getValues,
    reset,
    handleSubmit,
  } = useForm<{
    diaChi: string;
    lyDoTamVang: string;
    bangTamVangId: string;
  }>({
    mode: "onBlur",
    resolver: yupResolver(
      yup.object().shape({
        diaChi: yup.string().required("Vui lòng nhập địa chỉ mới"),
        lyDoTamVang: yup.string().required("Vui lòng nhập lý do tạm vắng"),
        bangTamVangId: yup.number().required("Vui lòng nhập mã tạm vắng"),
      })
    ),
  });
  const submitHandler = async () => {
    if (!nguoiYeuCau) {
      toast.error("Vui lòng nhập người yêu cầu");
      return;
    }
    suaTamVang({
      variables: {
        input: {
          nguoiYeuCauId: nguoiYeuCau?.id,
          diaChiNoiDenMoi: getValues("diaChi"),
          lyDoTamVang: getValues("lyDoTamVang"),
          bangTamVangId: getValues("bangTamVangId"),
        },
      },
      onCompleted: (data) => {
        if (data.suaThongTinTamVang.ok) {
          toast.success("Sửa thông tin thành công");
          setNguoiYeuCau(undefined);
          reset();
          return;
        }
        const msg = data.suaThongTinTamVang.error?.message;
        if (msg) {
          toast.error(msg);
          return;
        }
      },
      onError: (error) => {
        const msg = getApolloErrorMessage(error);
        if (msg) {
          toast.error(msg);
          return;
        }
        toast.error("Lỗi xảy ra, vui lòng thử lại sau");
      },
    });
  };
  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-8 pl-12 pr-16 pt-12 pb-16 "
    >
      <div className="flex flex-col col-span-1">
        <h3 className="leading-6 font-semibold text-gray-900 text-3xl mb-8">
          Sửa thông tin tạm vắng
        </h3>
        <div className="grid grid-cols-2 gap-x-6">
          <div className="rounded-md shadow-md p-3 col-span-1 h-fit flex flex-col space-y-4">
            <div>
              <h1 className="text-xl mb-2 font-semibold text-indigo-700">
                Người yêu cầu
              </h1>
              <SearchThanhVienInputs
                setThanhVien={(nguoiYeuCau: UserFragmentFragment) =>
                  setNguoiYeuCau(nguoiYeuCau)
                }
              />
              {nguoiYeuCau && (
                <div className="mx-1 px-3 py-2 flex flex-col border border-indigo-500 rounded-md">
                  <h1>Họ tên: {nguoiYeuCau.ten}</h1>
                  <h1>Căn cước công dân: {nguoiYeuCau.canCuocCongDan}</h1>
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-3">
              <label className="text-xl font-semibold text-indigo-700 -mb-2">
                Thông tin tạm vắng mới
              </label>
              <div className="px-1">
                <FormInput
                  id="bangTamVangId"
                  registerReturn={register("bangTamVangId", { required: true })}
                  labelText="Mã tạm vắng (ban đầu)"
                  type="number"
                  errorMessage={errors.diaChi && "Mã tạm vắng không được để trống "}
                />
              </div>
              <div className="px-2">
                <FormInput
                  id="diaChi"
                  registerReturn={register("diaChi", { required: true })}
                  labelText="Địa chỉ mới"
                  type="text"
                  errorMessage={errors.diaChi && "Địa chỉ không được để trống"}
                />
              </div>
              <div className="px-3">
                <FormInput
                  id="lyDoTamVang"
                  registerReturn={register("lyDoTamVang")}
                  labelText="Lý do tạm vắng"
                  type={"text"}
                  errorMessage={errors.lyDoTamVang?.message}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-5 flex justify-end space-x-3">
        <button
          onClick={() => navigate("/manager/tamvang")}
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Huỷ
        </button>
        <LoadingButton loading={loading} text="Thêm" className="w-fit" />
      </div>
    </form>
  );
};
export default EditTamVang;
