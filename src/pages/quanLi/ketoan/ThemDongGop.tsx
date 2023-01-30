import { XCircleIcon, XIcon } from "@heroicons/react/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { cloneDeep } from "lodash";
import { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { VaiTroThanhVienDisplay } from "../../../common/constants";
import { FormInput } from "../../../components/form/FormInput";
import LoadingButton from "../../../components/form/LoadingButton";
import {
  HoKhauFragmentFragment,
  TamTruFragmentFragment,
  useDanhSachHoKhauLazyQuery,
  useThemDongGopMutation,
  useXemDanhSachTamTruLazyQuery,
} from "../../../graphql/generated/schema";
import { loadingWhite } from "../../../images";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";

type Props = {
  setHoKhau: (HoKhau: HoKhauFragmentFragment) => void;
  setNguoiTamTru: (nguoiTamTru: TamTruFragmentFragment) => void;
};
const SearchHoKhauInputs: FC<Props> = ({ setHoKhau }) => {
  const [soHoKhau, setSoHoKhau] = useState<string>("");
  const [getUsers, { loading }] = useDanhSachHoKhauLazyQuery();
  const [results, setResults] = useState<HoKhauFragmentFragment[]>([]);
  const [canShowResults, setCanShowResults] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // @ts-ignore
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setCanShowResults(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [ref]);
  useEffect(() => {
    if (soHoKhau.length === 0) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      getUsers({
        variables: {
          input: {
            soHoKhau,
            paginationInput: {
              page: 1,
              resultsPerPage: 10,
            },
          },
        },
        onCompleted: (data) => {
          setResults(data.xemDanhSachHoKhau.hoKhau || []);
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
  }, [soHoKhau]);

  return (
    <div className="flex flex-col grid-rows-2 space-y-3 mx-1 mb-2 p-3 rounded border border-indigo-500">
      <div className="flex flex-col space-y-2 relative">
        <label htmlFor="" className="text-indigo-700 font-semibold">
          Tìm theo số hộ khẩu
        </label>
        <div ref={ref}>
          <input
            className="appearance-none block w-full h-8 px-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            type="text"
            value={soHoKhau}
            onChange={(e) => setSoHoKhau(e.target.value)}
            onFocus={() => setCanShowResults(true)}
          />
          <div className="absolute top-full left-0 w-full flex flex-col space-y-1 rounded-md shadow-md bg-gray-200 z-10">
            {loading && (
              <img className="w-32 h-32 mx-auto" src={loadingWhite}></img>
            )}
            {canShowResults && results.length === 0 && !loading && (
              <h1 className="text-center py-4 bg-white">
                Nhập số hộ khẩu đúng để tìm
              </h1>
            )}
            {canShowResults &&
              results.length > 0 &&
              results.map(({ soHoKhau }, i) => {
                return (
                  <div
                    key={i}
                    onClick={() => {
                      setHoKhau(results[i]);
                      setCanShowResults(false);
                      setSoHoKhau("");
                    }}
                    className="p-2 bg-white border border-indigo-500 rounded-md m-1 cursor-pointer hover:bg-indigo-500 hover:text-white"
                  >
                    <h1>Số hộ khẩu: {soHoKhau}</h1>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchNguoiTamTruInputs: FC<Props> = ({ setNguoiTamTru }) => {
  const [nguoiTamTruCanCuocCongDan, setNguoiTamTruCanCuocCongDan] =
    useState<string>("");
  const [getUsers, { loading }] = useXemDanhSachTamTruLazyQuery();
  const [results, setResults] = useState<TamTruFragmentFragment[]>([]);
  const [canShowResults, setCanShowResults] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // @ts-ignore
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setCanShowResults(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [ref]);
  useEffect(() => {
    if (nguoiTamTruCanCuocCongDan.length === 0) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      getUsers({
        variables: {
          input: {
            canCuocCongDan: nguoiTamTruCanCuocCongDan,
            paginationInput: {
              page: 1,
              resultsPerPage: 10,
            },
          },
        },
        onCompleted: (data) => {
          const { xemDanhSachTamTru } = data;
          setResults(Object(xemDanhSachTamTru.tamTru) || []);
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
  }, [nguoiTamTruCanCuocCongDan]);

  return (
    <div className="flex flex-col grid-rows-2 space-y-3 mx-1 mb-2 p-3 rounded border border-indigo-500">
      <div className="flex flex-col space-y-2 relative">
        <label htmlFor="" className="text-indigo-700 font-semibold">
          Tìm theo căn cước công dân của người tạm trú
        </label>
        <div ref={ref}>
          <input
            className="appearance-none block w-full h-8 px-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            type="text"
            value={nguoiTamTruCanCuocCongDan}
            onChange={(e) => setNguoiTamTruCanCuocCongDan(e.target.value)}
            onFocus={() => setCanShowResults(true)}
          />
          <div className="absolute top-full left-0 w-full flex flex-col space-y-1 rounded-md shadow-md bg-gray-200 z-10">
            {loading && (
              <img className="w-32 h-32 mx-auto" src={loadingWhite}></img>
            )}
            {canShowResults && results.length === 0 && !loading && (
              <h1 className="text-center py-4 bg-white">
                Nhập số căn cước công dân của người tạm trú để tìm
              </h1>
            )}
            {canShowResults &&
              results.length > 0 &&
              results.map(({ nguoiTamTru }, i) => {
                return (
                  <div
                    key={i}
                    onClick={() => {
                      setNguoiTamTru(results[i]);
                      setCanShowResults(false);
                      setNguoiTamTruCanCuocCongDan("");
                    }}
                    className="p-2 bg-white border border-indigo-500 rounded-md m-1 cursor-pointer hover:bg-indigo-500 hover:text-white"
                  >
                    <h1>Căn cước công dân: {nguoiTamTru.canCuocCongDan}</h1>
                    <h1>Họ và tên: {nguoiTamTru.ten}</h1>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

const ThemDongGop: FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [hoKhau, setHoKhau] = useState<HoKhauFragmentFragment>();
  const [nguoiTamTru, setNguoiTamTru] = useState<TamTruFragmentFragment>();
  const [ThemDongGop, { loading }] = useThemDongGopMutation();
  const {
    register,
    formState: { errors },
    getValues,
    reset,
    handleSubmit,
  } = useForm<{
    soTienDongGop: number;
  }>({
    mode: "onBlur",
    resolver: yupResolver(
      yup.object().shape({
        soTienDongGop: yup.number().required("Vui lòng nhập số tiền đóng góp"),
      })
    ),
  });
  const submitHandler = async () => {
    if (!hoKhau && !nguoiTamTru) {
      toast.error("Vui lòng nhập hộ khẩu hoặc người tạm trú");
      return;
    }
    console.log(params.id);
    console.log(hoKhau?.id!);
    ThemDongGop({
      variables: {
        input: {
          KhoanPhiId: +params.id!,
          nguoiTamTruId: +nguoiTamTru?.id! || 0,
          hoKhauId: +hoKhau?.id! || 0,
          soTienDongGop: +getValues("soTienDongGop"),
        },
      },
      onCompleted: (data) => {
        console.log(data.addDongGop);
        if (data.addDongGop.ok) {
          toast.success("Thêm đóng góp thành công");
          setHoKhau(undefined);
          setNguoiTamTru(undefined);
          reset();
          return;
        }
        const msg = data.addDongGop.error?.message;
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
          Thêm đóng góp
        </h3>
        <div className="grid grid-cols-2 gap-x-6">
          <div className="rounded-md shadow-md p-3 col-span-1 h-fit flex flex-col space-y-4">
            <div>
              <h1 className="text-xl mb-2 font-semibold text-indigo-700">
                Hộ khẩu
              </h1>
              <SearchHoKhauInputs
                setHoKhau={(hoKhau: HoKhauFragmentFragment) =>
                  setHoKhau(hoKhau)
                }
                setNguoiTamTru={function (
                  nguoiTamTru: TamTruFragmentFragment
                ): void {
                  throw new Error("Function not implemented.");
                }}
              />
              {hoKhau && (
                <div className="flex flex-col p-2 bg-white m-1 relative border-indigo-500 rounded-md border">
                  <div className="absolute top-2 right-1 w-fit h-fit bg-red-500 rounded-full flex items-center justify-center cursor-pointer">
                    <XIcon
                      onClick={() => {
                        setHoKhau(undefined);
                      }}
                      className="w-5 h-5 text-white cursor-pointer"
                    />
                  </div>
                  <h1>ID: {hoKhau.id}</h1>
                  <h1>Số hộ khẩu: {hoKhau.soHoKhau}</h1>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl mb-2 font-semibold text-indigo-700">
                Tạm trú
              </h1>
              <SearchNguoiTamTruInputs
                setNguoiTamTru={(tamTru: TamTruFragmentFragment) =>
                  setNguoiTamTru(tamTru)
                }
                setHoKhau={function (HoKhau: HoKhauFragmentFragment): void {
                  throw new Error("Function not implemented.");
                }}
              />
              {nguoiTamTru && (
                <div className="flex flex-col p-2 bg-white m-1 relative border-indigo-500 rounded-md border">
                  <div className="absolute top-2 right-1 w-fit h-fit bg-red-500 rounded-full flex items-center justify-center cursor-pointer">
                    <XIcon
                      onClick={() => {
                        setNguoiTamTru(undefined);
                      }}
                      className="w-5 h-5 text-white cursor-pointer"
                    />
                  </div>
                  <h1>ID: {nguoiTamTru?.id}</h1>
                  <h1>
                    Căn cước công dân: {nguoiTamTru.nguoiTamTru.canCuocCongDan}
                  </h1>
                  <h1>Tên: {nguoiTamTru.nguoiTamTru.ten}</h1>
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-3">
              <label className="text-xl font-semibold text-indigo-700 -mb-2">
                Số tiền đóng góp
              </label>
              <div className="px-1">
                <FormInput
                  id="soTienDongGop"
                  registerReturn={register("soTienDongGop", { required: true })}
                  type="text"
                  errorMessage={
                    errors.soTienDongGop &&
                    "Số tiền đóng góp không được để trống"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-5 flex justify-end space-x-3">
        <button
          onClick={() => navigate("/account/show")}
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
