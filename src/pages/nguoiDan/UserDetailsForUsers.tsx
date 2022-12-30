import { useReactiveVar } from "@apollo/client";
import { UserIcon } from "@heroicons/react/outline";
import { FC, Fragment } from "react";
import { Navigate } from "react-router-dom";
import { userVar } from "../../apollo/reactiveVar/loginStatusVar";


const InfoField: FC<{
  title: string;
  value?: string | null;
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
        {value || "Không có thông tin"}
      </dd>
    </div>
  );
};
type Props = {};

const UserDetailsForUsers: FC<Props> = () => {
  const user = useReactiveVar(userVar);

  return (
    <Fragment>
        <div className="overflow-hidden bg-white py-4 pr-10">
          <div className="pl-4 py-5 sm:px-6 mt-2 ">
            <h3 className="text-3xl font-bold leading-6 text-indigo-700 mb-6 pb-6 border-b border-gray-300">
              Thông tin nhân khẩu
            </h3>
          </div>
          <div className="grid grid-cols-12 pl-6">
            <div className="col-span-4 flex flex-col space-y-3 items-center">
              <h1 className="font-semibold text-indigo-700 text-lg">
                Ảnh chân dung
              </h1>
              {!user?.avatar?.fileUrl && (
                <UserIcon className="w-72 h-96 mx-auto mt-1 rounded bg-cover bg-center shadow-md" />
              )}
              {user?.avatar && (
                <img
                  src={user?.avatar?.fileUrl}
                  className="w-72 h-96 mx-auto mt-1 rounded bg-cover bg-center shadow-md"
                />
              )}
            </div>
            <div className="col-span-8 shadow-md rounded-sm">
              {[
                ["Căn cước công dân", user?.canCuocCongDan],
                ["Họ tên", user?.ten],
                ["Bí danh", user?.biDanh],
                ["Giới tính", user?.gioiTinh],
                ["Ngày sinh", user?.ngaySinh],
                ["Nơi sinh", user?.noiSinh],
                ["Quê quán", user?.queQuan],
                ["Nghề nghiệp", user?.ngheNghiep],
                ["Nơi thường trú trước đó", user?.noiThuongTruTruocDo],
                ["Ngày đăng kí thường trú", user?.ngayDangKiThuongTru],
                ["Nghề nghiệp", user?.ngheNghiep],
                ["Nơi làm việc", user?.noiLamViec],
                ["Dân tộc", user?.danToc],
                ["Ghi chú", user?.ghiChu],
                ["Số điện thoại", user?.soDienThoai],
              ].map(([title, value], i) => {
                let gray = true;
                if (i % 2 == 0) gray = false;
                return (
                  <InfoField
                    key={i}
                    title={title || ""}
                    gray={gray}
                    value={value}
                  />
                );
              })}
            </div>
          </div>
        </div>
    </Fragment>
  );
};

export default UserDetailsForUsers;