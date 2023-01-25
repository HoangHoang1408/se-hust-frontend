import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useDanhSachNguoiDungLazyQuery,
  UserFragmentFragment,
} from "../../graphql/generated/schema";
import { loadingWhite } from "../../images";
import { getApolloErrorMessage } from "../../utils/getApolloErrorMessage";
type Props = {
  setThanhVien: (thanhvien: UserFragmentFragment) => void;
};

export const SearchThanhVienInputs: FC<Props> = ({ setThanhVien }) => {
  const [canCuocCongDan, setCanCuocCongDan] = useState<string>("");
  const [getUsers, { loading: loadingUsers }] = useDanhSachNguoiDungLazyQuery();
  const [results, setResults] = useState<UserFragmentFragment[]>([]);
  const [canShowResults, setCanShowResults] = useState<boolean>(false);

  // search users
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
        onCompleted: (data) => {
          setResults(data.xemDanhSachNguoiDung.users || []);
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
    }, 500);
    return () => clearTimeout(timer);
  }, [canCuocCongDan]);

  return (
    <div className="flex flex-col grid-rows-2 space-y-3 mx-1 mb-2 p-3 rounded border border-indigo-500">
      <div className="flex flex-col space-y-2 relative">
        <label htmlFor="" className="text-indigo-700 font-semibold">
          Tìm theo căn cước công dân
        </label>
        <div
          onBlur={() => {
            setTimeout(() => {
              setCanShowResults(false);
            }, 100);
          }}
        >
          <input
            className="appearance-none block w-full h-8 px-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            type="text"
            value={canCuocCongDan}
            onChange={(e) => setCanCuocCongDan(e.target.value)}
            onFocus={() => setCanShowResults(true)}
          />
          <div className="absolute top-full left-0 w-full flex flex-col space-y-1 rounded-md shadow-md bg-gray-200 z-10">
            {loadingUsers && (
              <img className="w-32 h-32 mx-auto" src={loadingWhite}></img>
            )}
            {canShowResults && results.length === 0 && !loadingUsers && (
              <h1 className="text-center py-4 bg-white">
                Nhập căn cước công dân đúng để tìm
              </h1>
            )}
            {canShowResults &&
              results.length > 0 &&
              results.map(({ ten, canCuocCongDan }, i) => {
                return (
                  <div
                    key={i}
                    onClick={() => {
                      setThanhVien(results[i]);
                      setCanShowResults(false);
                      setCanCuocCongDan("");
                    }}
                    className="flex flex-col p-2 bg-white border border-indigo-500 rounded-md m-1 cursor-pointer hover:bg-indigo-500 hover:text-white"
                  >
                    <h1>Họ tên: {ten}</h1>
                    <h1>Căn cước công dân: {canCuocCongDan}</h1>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
