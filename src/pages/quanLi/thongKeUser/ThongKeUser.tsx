import { useReactiveVar } from "@apollo/client";
import { removeArgumentsFromDocument } from "@apollo/client/utilities";
import { UserIcon } from "@heroicons/react/outline";
import { FC, Fragment, useEffect } from "react";
import { toast } from "react-toastify";
import { number } from "yup";
import { useThongKeUserQuery } from "../../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";

const InfoField: FC<{
  title: string;
  value?: string;
  gray?: boolean;
}> = ({ title, value, gray }) => {
  const color = gray ? "bg-gray-50" : "bg-white";
  return (
    <div
      className={
        "px-4 py-[0.85rem] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 " + color
      }
    >
      <dt className="text-sm font-medium text-gray-500">{title}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        {value}
      </dd>
    </div>
  );
};
type Props = {};

const ThongKeUser: FC<Props> = (props: Props) => {
  const { data: thongKeData, loading } = useThongKeUserQuery({
    onCompleted(data) {
      const { thongKeUser } = data;
      if (thongKeUser.error) {
        if (thongKeUser.error) {
          toast.error(thongKeUser.error.message);
          return;
        }
      }
    },
    onError(err) {
      const msg = getApolloErrorMessage(err);
      if (msg) {
        toast.error(msg);
        return;
      }
      toast.error("Lỗi xảy ra, thử lại sau ");
    },
  });
  const soNguoiDangKi = thongKeData?.thongKeUser?.soNguoiDangKi;
  useEffect(() => {
    if (!soNguoiDangKi) return;
  }, [number]);
  const soNguoiDangKiTamTru = thongKeData?.thongKeUser?.soNguoiDangKiTamTru;
  useEffect(() => {
    if (!soNguoiDangKiTamTru) return;
  }, [number]);
  const soNguoiDangKiTamVang = thongKeData?.thongKeUser?.soNguoiDangKiTamVang;
  useEffect(() => {
    if (!soNguoiDangKiTamVang) return;
  }, [number]);
  const soHo = thongKeData?.thongKeUser?.soHo;
  useEffect(() => {
    if (!soHo) return;
  }, [number]);
  const soNguoiDuoiLaoDong = thongKeData?.thongKeUser?.soNguoiDuoiLaoDong;
  useEffect(() => {
    if (!soNguoiDuoiLaoDong) return;
  }, [number]);
  const soNguoiTrongLaoDong = thongKeData?.thongKeUser?.soNguoiTrongLaoDong;
  useEffect(() => {
    if (!soNguoiTrongLaoDong) return;
  }, [number]);
  const soNguoiTrenLaoDong = thongKeData?.thongKeUser?.soNguoiTrenLaoDong;
  useEffect(() => {
    if (!soNguoiDuoiLaoDong) return;
  }, [number]);

  return (
    <Fragment>
      <div className="overflow-hidden bg-white py-4 pr-10">
        <div className="pl-4 py-5 sm:px-6 mt-2 ">
          <h3 className="text-3xl font-bold leading-6 text-indigo-700 mb-6 pb-6 border-b border-gray-300">
            Quản lí thông tin chung
          </h3>
        </div>
        <div className="grid grid-cols-12 pl-6">
          <div className="col-span-8 shadow-md rounded-sm">
            {[
              ["Số người quản lí:", soNguoiDangKi],
              ["Số người đăng ký tạm trú", soNguoiDangKiTamTru],
              ["Số người đăng ký tạm vắng", soNguoiDangKiTamVang],
              ["Số hộ", soHo],
              ["Số người dưới độ tuổi lao động", soNguoiDuoiLaoDong],
              ["Số người trong độ tuổi lao động", soNguoiTrongLaoDong],
              ["Số người trên độ tuổi lao động", soNguoiTrenLaoDong],
            ].map(([title, value], i) => {
              let gray = true;
              if (i % 2 == 0) gray = false;
              return (
                <InfoField
                  key={i}
                  title={title?.toString() || ""}
                  gray={gray}
                  value={value?.toString()}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ThongKeUser;
