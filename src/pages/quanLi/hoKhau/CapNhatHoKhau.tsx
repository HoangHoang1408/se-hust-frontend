import { XIcon } from "@heroicons/react/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { cloneDeep } from "lodash";
import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { VaiTroThanhVienDisplay } from "../../../common/constants";
import { FormInput } from "../../../components/form/FormInput";
import LoadingButton from "../../../components/form/LoadingButton";
import { SearchThanhVienInputs } from "../../../components/hoKhau/SearchThanhVienInputs";
import Loading from "../../../components/Loading";
import {
  useCapNhatHoKhauMutation,
  useHoKhauDetailLazyQuery,
  UserFragmentFragment,
  VaiTroThanhVien,
} from "../../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";

// main component
interface ThanhVienThemBot {
  user: UserFragmentFragment;
  vaiTro: VaiTroThanhVien | null;
}
const CapNhatHoKhau: FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  // react-hook-form
  const {
    register,
    formState: { errors },
    getValues,
    reset,
    handleSubmit,
  } = useForm<{
    diaChi: string;
  }>({
    mode: "onBlur",
    resolver: yupResolver(
      yup.object().shape({
        diaChi: yup.string().required("Vui lòng nhập địa chỉ"),
      })
    ),
  });

  // apollo hooks
  const [capNhatHoKhau, { loading: capNhatHoKhauLoading }] =
    useCapNhatHoKhauMutation({
      onCompleted: (data) => {
        if (data.capNhatHoKhau.ok) {
          toast.success("Thêm hộ khẩu thành công");
          setThanhVienMoi([]);
          setThanhVienXoa([]);
          setNguoiYeuCau(undefined);
          return;
        }
        const msg = data.capNhatHoKhau.error?.message;
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
  const [getHoKhau, { loading: loadingHoKhau, data: hoKhauData }] =
    useHoKhauDetailLazyQuery({
      onCompleted(data) {
        const { xemHoKhauChiTietChoQuanLi } = data;
        if (xemHoKhauChiTietChoQuanLi.error) {
          toast.error(xemHoKhauChiTietChoQuanLi.error.message);
          return;
        }
      },
      onError(err) {
        const msg = getApolloErrorMessage(err);
        if (msg) {
          toast.error(msg);
          return;
        }
        toast.error("Lôi xảy ra, thử lại sau");
      },
    });

  // quản lí thành viên state
  const [thanhVienHienTai, setThanhVienHienTai] = useState<ThanhVienThemBot[]>(
    []
  );
  const [thanhVienMoi, setThanhVienMoi] = useState<ThanhVienThemBot[]>([]);
  const [thanhVienXoa, setThanhVienXoa] = useState<ThanhVienThemBot[]>([]);

  const [nguoiYeuCau, setNguoiYeuCau] = useState<UserFragmentFragment>();
  const hoKhauCu = hoKhauData?.xemHoKhauChiTietChoQuanLi.hoKhau;

  // load ho khau cu khi load trang
  useEffect(() => {
    getHoKhau({
      variables: {
        input: {
          hoKhauId: params.id!,
        },
      },
    });
  }, []);

  // set thành viên hiện tại khi load xong ho khau cu
  useEffect(() => {
    if (!hoKhauCu) return;
    const { thanhVien } = hoKhauCu;
    const thanhVienHienTai = thanhVien.map((tv) => {
      return {
        user: tv,
        vaiTro: tv.vaiTroThanhVien || null,
      };
    });
    setThanhVienHienTai(thanhVienHienTai);
    reset({
      diaChi: hoKhauCu.diaChiThuongTru,
    });
  }, [hoKhauCu]);

  // functions to add or remove member in three states
  const themThanhVienMoi = useCallback(
    (thanhVien: UserFragmentFragment) => {
      const daLoaiBo = thanhVienXoa.some((tv) => tv.user.id == thanhVien.id);
      if (daLoaiBo) {
        toast.error("Thành viên đã được loại bỏ");
        return;
      }
      const daCoTrongHo = thanhVienHienTai.some(
        (tv) => tv.user.id == thanhVien.id
      );
      if (daCoTrongHo) {
        toast.error("Thành viên đã có trong hộ");
        return;
      }
      setThanhVienHienTai((pre) => {
        const temp = cloneDeep(pre);
        temp.push({
          user: thanhVien,
          vaiTro: null,
        });
        return temp;
      });
      setThanhVienMoi((pre) => {
        const temp = cloneDeep(pre);
        temp.push({
          user: thanhVien,
          vaiTro: null,
        });
        return temp;
      });
    },
    [thanhVienXoa, thanhVienHienTai]
  );
  const loaiBoThanhVienTuThanhVienHienTai = useCallback(
    (thanhVien: ThanhVienThemBot, id: string) => {
      setThanhVienHienTai((pre) => {
        const temp = cloneDeep(pre);
        return temp.filter((tv) => tv.user.id != id);
      });
      setThanhVienXoa((pre) => {
        const temp = cloneDeep(pre);
        temp.push(thanhVien);
        return temp;
      });
    },
    []
  );
  const loaiBoThanhVienTuThanhVienMoiThem = useCallback((id: string) => {
    setThanhVienMoi((pre) => {
      const temp = cloneDeep(pre);
      return temp.filter((tv) => tv.user.id != id);
    });
    setThanhVienHienTai((pre) => {
      const temp = cloneDeep(pre);
      return temp.filter((tv) => tv.user.id != id);
    });
  }, []);
  const loaiBoThanhVienTuThanhVienBiXoa = useCallback(
    (thanhVien: ThanhVienThemBot, id: string) => {
      setThanhVienHienTai((pre) => {
        const temp = cloneDeep(pre);
        temp.push(thanhVien);
        return temp;
      });
      setThanhVienXoa((pre) => {
        const temp = cloneDeep(pre);
        return temp.filter((tv) => tv.user.id != id);
      });
    },
    []
  );

  // send request
  const submitHandler = async () => {
    if (!params.id) {
      toast.error("Lỗi xảy ra, thử lại sau");
      navigate("/manager");
      return;
    }
    if (thanhVienHienTai.length === 0) {
      toast.error("Vui lòng thêm thành viên");
      return;
    }
    if (!nguoiYeuCau) {
      toast.error("Vui lòng nhập người yêu cầu");
      return;
    }
    const allHaveVaiTro = thanhVienHienTai.every((tv) => tv.vaiTro);
    if (!allHaveVaiTro) {
      toast.error("Vui lòng chọn vai trò cho tất cả thành viên");
      return;
    }
    await capNhatHoKhau({
      variables: {
        input: {
          hoKhauId: params.id,
          thanhVienMoi: thanhVienHienTai.map((tv) => ({
            id: tv.user.id,
            vaiTroThanhVien: tv.vaiTro!,
          })),
          nguoiYeuCauId: nguoiYeuCau?.id,
          diaChiThuongTru: getValues("diaChi"),
        },
      },
    });
  };
  return (
    <Fragment>
      {loadingHoKhau && <Loading />}
      {!loadingHoKhau && hoKhauData && (
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="space-y-8 pl-12 pr-16 pt-12 pb-16 "
        >
          <div className="flex flex-col col-span-1">
            <h3 className="leading-6 font-semibold text-gray-900 text-3xl mb-8">
              Cập nhật hộ khẩu
            </h3>
            <div className="grid grid-cols-2 gap-x-6">
              {/* left side */}
              <div className="col-span-1 h-fit flex-col space-y-3">
                {/* Thành viên hiện tại */}
                <div className="rounded-md shadow-md p-3 h-fit">
                  <h1 className="text-lg font-semibold text-indigo-700 mb-1">
                    Danh sách thành viên hiện tại
                  </h1>
                  {thanhVienHienTai.length > 0 && (
                    <div className="flex flex-col space-y-2 border border-indigo-500 rounded-md divide-y divide-indigo-300 ">
                      {thanhVienHienTai.map((thanhVien, i) => {
                        const {
                          user: { ten, canCuocCongDan, id },
                        } = thanhVien;
                        return (
                          <div
                            key={i}
                            className="flex flex-col p-2 bg-white m-1 relative"
                          >
                            {!thanhVienMoi
                              .map((tv) => tv.user.id)
                              .includes(id) && (
                              <div className="absolute top-2 right-1 w-fit h-fit bg-red-500 rounded-full flex items-center justify-center cursor-pointer">
                                <XIcon
                                  onClick={() =>
                                    loaiBoThanhVienTuThanhVienHienTai(
                                      thanhVien,
                                      id
                                    )
                                  }
                                  className="w-5 h-5 text-white cursor-pointer"
                                />
                              </div>
                            )}
                            <h1 className="text-lg font-semibold text-indigo-700 mb-1">
                              Thành viên thứ {i + 1}:
                            </h1>
                            <div className="px-2 flex flex-col space-y-1">
                              <h1>Họ tên: {ten}</h1>
                              <h1>Căn cước công dân: {canCuocCongDan}</h1>
                              <div className="flex items-center space-x-3">
                                <label className="w-fit">
                                  Quan hệ với chủ hộ:
                                </label>
                                <select
                                  className="appearance-none block h-8 px-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-medium w-fit"
                                  onChange={(e) => {
                                    setThanhVienHienTai((pre) => {
                                      const temp = cloneDeep(pre);
                                      // @ts-ignore
                                      temp[i].vaiTro = e.target.value;
                                      return temp;
                                    });
                                  }}
                                  value={thanhVienHienTai[i].vaiTro || "Null"}
                                >
                                  <option value="Null">Null</option>
                                  {Object.entries(VaiTroThanhVienDisplay).map(
                                    (v) => {
                                      return (
                                        <option key={v[0]} value={v[0]}>
                                          {v[1]}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Thêm mới thành viên */}
                <div className="rounded-md shadow-md p-3 h-fit">
                  <h1 className="text-lg font-semibold text-indigo-700 mb-1">
                    Thêm mới thành viên
                  </h1>
                  <SearchThanhVienInputs setThanhVien={themThanhVienMoi} />
                  {thanhVienMoi.length > 0 && (
                    <div className="flex flex-col space-y-2 border border-indigo-500 rounded-md divide-y divide-indigo-300 ">
                      {thanhVienMoi.map(
                        ({ user: { ten, canCuocCongDan, id } }, i) => {
                          return (
                            <div
                              key={i}
                              className="flex flex-col p-2 bg-white m-1 relative"
                            >
                              <div className="absolute top-2 right-1 w-fit h-fit bg-red-500 rounded-full flex items-center justify-center cursor-pointer">
                                <XIcon
                                  onClick={() =>
                                    loaiBoThanhVienTuThanhVienMoiThem(id)
                                  }
                                  className="w-5 h-5 text-white cursor-pointer"
                                />
                              </div>
                              <h1 className="text-lg font-semibold text-indigo-700 mb-1">
                                Người thứ {i + 1}:
                              </h1>
                              <div className="px-2 flex flex-col space-y-1">
                                <h1>Họ tên: {ten}</h1>
                                <h1>Căn cước công dân: {canCuocCongDan}</h1>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>

                {/* Loại bỏ thành viên */}
                <div className="rounded-md shadow-md p-3 h-fit">
                  <h1 className="text-lg font-semibold text-indigo-700 mb-1">
                    Thành viên bị loại ra
                  </h1>
                  {thanhVienXoa.length > 0 && (
                    <div className="flex flex-col space-y-2 border border-indigo-500 rounded-md divide-y divide-indigo-300 ">
                      {thanhVienXoa.map((thanhVien, i) => {
                        const {
                          user: { ten, canCuocCongDan, id },
                        } = thanhVien;
                        return (
                          <div
                            key={i}
                            className="flex flex-col p-2 bg-white m-1 relative"
                          >
                            <div className="absolute top-2 right-1 w-fit h-fit bg-red-500 rounded-full flex items-center justify-center cursor-pointer">
                              <XIcon
                                onClick={() =>
                                  loaiBoThanhVienTuThanhVienBiXoa(thanhVien, id)
                                }
                                className="w-5 h-5 text-white cursor-pointer"
                              />
                            </div>
                            <h1 className="text-lg font-semibold text-indigo-700 mb-1">
                              Người thứ {i + 1}:
                            </h1>
                            <div className="px-2 flex flex-col space-y-1">
                              <h1>Họ tên: {ten}</h1>
                              <h1>Căn cước công dân: {canCuocCongDan}</h1>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* right side */}
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
                    Địa chỉ
                  </label>
                  <div className="px-1">
                    <FormInput
                      id="diaChi"
                      registerReturn={register("diaChi", { required: true })}
                      type="text"
                      errorMessage={
                        errors.diaChi && "Địa chỉ không được để trống"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* bottom buttons */}
          <div className="pt-5 flex justify-end space-x-3">
            <button
              onClick={() => navigate("/manager/hoKhau")}
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Huỷ
            </button>
            <LoadingButton
              loading={capNhatHoKhauLoading}
              text="Cập nhật"
              className="w-fit"
            />
          </div>
        </form>
      )}
    </Fragment>
  );
};
export default CapNhatHoKhau;
