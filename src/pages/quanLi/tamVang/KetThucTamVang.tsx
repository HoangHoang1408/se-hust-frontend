import { yupResolver } from "@hookform/resolvers/yup";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useKetThucTamVangMutation,
  UserFragmentFragment,
} from "../../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";
import { SearchThanhVienInputs } from "../hoKhau/ThemHoKhau";

const KetThucTamVang: FC = () => {
  const navigate = useNavigate();
  const [nguoiYeuCau, setNguoiYeuCau] = useState<UserFragmentFragment>();
  const [hetTamVang, { loading }] = useKetThucTamVangMutation();
  const submitHandler = () => {
    if (!nguoiYeuCau) {
      toast.error("Vui lòng nhập người yêu cầu");
      return;
    }
    hetTamVang({
      variables: {
        input: {
          nguoiYeuCauId: nguoiYeuCau?.id,
        },
      },
      onCompleted: (data) => {
        if (data.hetTamVang.ok) {
          toast.success("Đã hết tạm vắng!");
          setNguoiYeuCau(undefined);
          return;
        }
        const msg = data.hetTamVang.error?.message;
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
      className="space-y-8 pl-12 pr-16 pt-12 pb-16 "
    >
      <div className="flex flex-col col-span-1">
        <h3 className="leading-6 font-semibold text-gray-900 text-3xl mb-8">
          Kết thúc tạm vắng
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
        <button
          type="button"
          onClick={() => submitHandler()}
        >  
          Thêm
        </button>
        {/* <LoadingButton loading={loading} text="Thêm" className="w-fit" /> */}
      </div>
    </form>
  );
};
export default KetThucTamVang;
