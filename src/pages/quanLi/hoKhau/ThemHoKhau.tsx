import { FC, Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../../components/form/LoadingButton";
import {
  ThanhVien,
  useDanhSachNguoiDungLazyQuery,
  useThemHoKhauMutation,
} from "../../../graphql/generated/schema";

type Props = {
  setThanhVien: (thanhvien: ThanhVien[]) => void;
  thanhVien: ThanhVien[];
};
const SearchUserInputs: FC<Props> = ({ setThanhVien, thanhVien }) => {
  const [canCuocCongDan, setCanCuocCongDan] = useState<string>("");
  const [getUsers, { loading, data }] = useDanhSachNguoiDungLazyQuery();
  const [results, setResults] = useState<ThanhVien[]>([]);
  useEffect(() => {
    if (canCuocCongDan.length === 0) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      getUsers({
        variables: {
          input: {
            canCuocCongDan,
            paginationInput: {
              page: 1,
              resultsPerPage: 10,
            },
          },
        },
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [canCuocCongDan]);

  return (
    <Fragment>
      <div className="grid grid-cols-2 gap-x-6">
        <div className="col-span-1 flex flex-col grid-rows-2 space-y-3 shadow-md p-3">
          <h1 className="text-lg font-semibold text-indigo-700">Tìm kiếm</h1>
          <div className="flex flex-col space-y-2 relative">
            <label htmlFor="" className="text-indigo-700">
              Căn cước công dân
            </label>
            <input
              className="appearance-none block w-full h-8 px-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              type="text"
              value={canCuocCongDan}
              onChange={(e) => setCanCuocCongDan(e.target.value)}
            />
            <div className="absolute top-full left-0 w-full flex flex-col space-y-1 rounded-md shadow-md bg-gray-100 p-1">
              {data?.xemDanhSachNguoiDung.users?.map(
                ({ ten, canCuocCongDan }) => {
                  return (
                    <div className="flex flex-col p-2 bg-white border border-indigo-500 rounded-md">
                      <h1>Họ tên: {ten}</h1>
                      <h1>Căn cước công dân: {canCuocCongDan}</h1>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
        <div className="col-span-1 shadow-md p-3 h-fit">
          <h1 className="text-lg font-semibold text-indigo-700">Thông tin</h1>
        </div>
      </div>
    </Fragment>
  );
};

const ThemHoKhau: FC = () => {
  const navigate = useNavigate();
  const [thanhVien, setThanhVien] = useState<ThanhVien[]>([]);
  const [themHoKhau, { loading }] = useThemHoKhauMutation();
  const submitHandler = async () => {};
  return (
    <form
      onSubmit={submitHandler}
      className="space-y-8 pl-12 pr-16 pt-12 pb-16 "
    >
      <div className="space-y-8 sm:space-y-5">
        <div className="flex flex-col">
          <h3 className="leading-6 font-semibold text-gray-900 text-2xl mb-8">
            Thêm hộ khẩu
          </h3>
          <div className="space-y-4">
            <SearchUserInputs
              setThanhVien={(thanhVien: ThanhVien[]) => setThanhVien(thanhVien)}
              thanhVien={thanhVien}
            />
          </div>
        </div>
      </div>
      <div className="pt-5 flex justify-end space-x-3">
        <button
          onClick={() => navigate("/manager/users")}
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
export default ThemHoKhau;
