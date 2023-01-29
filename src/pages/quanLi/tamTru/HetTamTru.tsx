import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingButton from "../../../components/form/LoadingButton";
import {
  useDanhSachNguoiDungLazyQuery,
  useHetTamTruMutation,
  UserFragmentFragment,
} from "../../../graphql/generated/schema";
import { loadingWhite } from "../../../images";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";

type Props = {
  setNguoiDung: (thanhvien: UserFragmentFragment) => void;
};

const SearchInput: FC<Props> = ({ setNguoiDung }) => {
  const [canCuocCongDan, setCanCuocCongDan] = useState<string>("");
  const [getUsers, { loading }] = useDanhSachNguoiDungLazyQuery();
  const [results, setResults] = useState<UserFragmentFragment[]>([]);
  const [canShowResults, setCanShowResults] = useState<boolean>(false);
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
            {loading && (
              <img className="w-32 h-32 mx-auto" src={loadingWhite}></img>
            )}
            {canShowResults && results.length === 0 && !loading && (
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
                      setNguoiDung(results[i]);
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

const HetTamTru: FC = () => {
  const navigate = useNavigate();
  const [nguoiYeuCau, setNguoiYeuCau] = useState<UserFragmentFragment>();
  const [hetTamVang, { loading }] = useHetTamTruMutation();
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
        if (data.hetTamTru.ok) {
          toast.success("Kết thúc thành công!");
          setNguoiYeuCau(undefined);
          return;
        }
        const msg = data.hetTamTru.error?.message;
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
      onSubmit={submitHandler}
    >
      <div className="flex flex-col col-span-1">
        <h3 className="leading-6 font-semibold text-gray-900 text-3xl mb-8">
          Kết thúc tạm trú
        </h3>
        <div className="grid grid-cols-2 gap-x-6">
          <div className="rounded-md shadow-md p-3 col-span-1 h-fit flex flex-col space-y-4">
            <div>
              <h1 className="text-xl mb-2 font-semibold text-indigo-700">
                Người yêu cầu
              </h1>
              <SearchInput
                setNguoiDung={(nguoiYeuCau: UserFragmentFragment) =>
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
          onClick={() => navigate("/manager/tamtru")}
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Huỷ
        </button>
        <LoadingButton loading={loading} text="Kết thúc" className="w-fit" />
      </div>
    </form>
  );
};
export default HetTamTru;
