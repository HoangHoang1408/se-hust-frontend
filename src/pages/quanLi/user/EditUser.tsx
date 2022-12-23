import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { FC, Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { FormInput } from "../../../components/form/FormInput";
import LoadingButton from "../../../components/form/LoadingButton";
import Loading from "../../../components/Loading";
import { SERVER_URL } from "../../../config";
import {
  StoredFileInputType,
  useEditUserMutation,
  useUserDetailsQuery,
} from "../../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";

const FixField: FC<{
  labelText: string;
  value?: string | null;
}> = ({ labelText, value }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 text-start">
        {labelText}
      </label>
      <div className="mt-1">
        <input
          disabled
          value={value || "Không có thông tin"}
          className="appearance-none block w-full h-11 px-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
        />
      </div>
    </div>
  );
};

type EditUserInputForm = {
  soDienThoai: string;
  ten: string;
  gioiTinh: string;
  biDanh: string;
  ngaySinh: Date;
  noiSinh: string;
  queQuan: string;
  noiThuongTruTruocDo: string;
  ngayDangKiThuongTru: Date;
  ngheNghiep: string;
  noiLamViec: string;
  danToc: string;
  ghiChu: string;
};

const UpdateUserInputSchema = yup.object().shape({
  soDienThoai: yup.string(),
  ten: yup.string(),
  gioiTinh: yup.string(),
  biDanh: yup.string(),
  ngaySinh: yup.date(),
  noiSinh: yup.string(),
  queQuan: yup.string(),
  noiThuongTruTruocDo: yup.string(),
  ngheNghiep: yup.string(),
  noiLamViec: yup.string(),
  danToc: yup.string(),
  ghiChu: yup.string(),
});
type Props = {};
const EditUser: FC<Props> = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [image, setImage] = useState<File>();
  const [loadingMain, setLoadingMain] = useState(false);
  const {
    register,
    formState: { errors },
    getValues,
    reset,
    handleSubmit,
  } = useForm<EditUserInputForm>({
    mode: "onBlur",
    resolver: yupResolver(UpdateUserInputSchema),
  });
  const { data, loading: getUserLoading } = useUserDetailsQuery({
    variables: {
      input: {
        userId: params.id!,
      },
    },
    onCompleted(data) {
      const { xemThongTinNguoiDungChoQuanLi } = data;
      if (xemThongTinNguoiDungChoQuanLi.error) {
        toast.error(xemThongTinNguoiDungChoQuanLi.error.message);
        return;
      }
      const { user } = xemThongTinNguoiDungChoQuanLi;
      if (!user) {
        toast.error("Không tìm thấy người dùng");
        return;
      }
      reset({
        soDienThoai: user.soDienThoai || undefined,
        ten: user.ten,
        gioiTinh: user.gioiTinh,
        biDanh: user.biDanh || undefined,
        ngaySinh: user.ngaySinh.split("T")[0],
        noiSinh: user.noiSinh,
        queQuan: user.queQuan,
        noiThuongTruTruocDo: user.noiThuongTruTruocDo || undefined,
        ngayDangKiThuongTru: user.ngayDangKiThuongTru,
        ngheNghiep: user.ngheNghiep || undefined,
        noiLamViec: user.noiLamViec || undefined,
        danToc: user.danToc,
        ghiChu: user.ghiChu || undefined,
      });
    },
    onError(err) {
      const message = getApolloErrorMessage(err);
      if (message) {
        toast.error(message);
        return;
      }
      toast.error("Lỗi xảy ra, thử lại sau");
    },
  });
  const [editUser] = useEditUserMutation();
  const submitHandler = async () => {
    let sendImage: StoredFileInputType | undefined;
    try {
      const formData = new FormData();
      if (image) {
        formData.append("file", image);
        formData.append("storagePath", "se/users/avatars");
        setLoadingMain(true);
        const res = await axios.post(SERVER_URL + "/upload/file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        sendImage = res.data["fileReference"];
      }
      await editUser({
        variables: {
          input: {
            ...getValues(),
            avatar: sendImage || undefined,
            nguoiYeuCauId: params.id!,
          },
        },
        onCompleted(data) {
          const { editUser } = data;
          if (editUser.error) {
            toast.error(editUser.error.message);
            throw new Error();
          }
          reset();
          setImage(undefined);
          toast.success("Cập nhật thành công");
        },
        onError(err) {
          const msg = getApolloErrorMessage(err);
          if (msg) toast.error(msg);
          else toast.error("Lỗi xảy ra, thử lại sau");
          throw err;
        },
        refetchQueries: ["UserDetails"],
      });
    } catch (err) {
      if (sendImage)
        await axios.delete(SERVER_URL + "/file", {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            storagePath: sendImage.filePath,
          },
        });
    } finally {
      setLoadingMain(false);
    }
  };
  const user = data?.xemThongTinNguoiDungChoQuanLi.user;
  return (
    <Fragment>
      {getUserLoading && <Loading />}
      {user && !getUserLoading && (
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="space-y-8 pl-12 pr-16 pt-12 pb-16 "
        >
          <div className="space-y-8 sm:space-y-5">
            <div className="flex flex-col">
              <h3 className="leading-6 font-semibold text-indigo-600 text-2xl mb-8">
                Cập nhật nhân khẩu
              </h3>
              <div className="space-y-4">
                <label
                  htmlFor="cover-photo"
                  className="block text-lg text-indigo-700 font-bold"
                >
                  Ảnh
                </label>
                <div className="w-60 mx-auto mb-4">
                  <div className="w-full">
                    <div className="max-w-lg w-full flex justify-center p-4 border-2 border-gray-300 border-dashed rounded-md ">
                      <div className="text-center flex flex-col space-y-3 items-center">
                        <div className="flex flex-wrap w-full items-center justify-center">
                          {user.avatar?.filePath && !image && (
                            <img
                              className="object-center bg-center mt-1 ml-1 w-52 h-60"
                              src={user.avatar.fileUrl}
                            />
                          )}
                          {image && (
                            <img
                              className="object-center bg-center mt-1 ml-1 w-52 h-60"
                              src={URL.createObjectURL(image)}
                            />
                          )}
                        </div>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 items-center"
                          >
                            <span>Tải ảnh lên</span>
                            <input
                              onChange={(e) => {
                                if (e.target.files) setImage(e.target.files[0]);
                              }}
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              multiple
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h1 className="text-indigo-700 font-bold text-lg mb-4">
                  Thông tin cơ bản
                </h1>
                <div className="pl-4 grid grid-cols-2 gap-x-8 gap-y-4">
                  <div className="col-span-1">
                    <FixField
                      labelText="Căn cước công dân"
                      value={user.canCuocCongDan}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormInput
                      id="ten"
                      registerReturn={register("ten")}
                      labelText="Họ và tên (*)"
                      errorMessage={errors.ten?.message}
                      type={"text"}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormInput
                      id="biDanh"
                      registerReturn={register("biDanh")}
                      labelText="Bí danh"
                      errorMessage={errors.biDanh?.message}
                      type={"text"}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormInput
                      id="ngaySinh"
                      registerReturn={register("ngaySinh")}
                      labelText="Ngày sinh (*)"
                      errorMessage={errors.ngaySinh?.message}
                      type={"date"}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormInput
                      id="gioiTinh"
                      registerReturn={register("gioiTinh")}
                      labelText="Giới tính (*)"
                      errorMessage={errors.gioiTinh?.message}
                      type={"text"}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormInput
                      id="soDienThoai"
                      registerReturn={register("soDienThoai")}
                      labelText="Số điện thoại"
                      errorMessage={errors.soDienThoai?.message}
                      type={"text"}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormInput
                      id="noiSinh"
                      registerReturn={register("noiSinh")}
                      labelText="Nơi sinh (*)"
                      errorMessage={errors.noiSinh?.message}
                      type={"text"}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormInput
                      id="queQuan"
                      registerReturn={register("queQuan")}
                      labelText="Quê quán (*)"
                      errorMessage={errors.queQuan?.message}
                      type={"text"}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormInput
                      id="danToc"
                      registerReturn={register("danToc")}
                      labelText="Dân tộc (*)"
                      errorMessage={errors.danToc?.message}
                      type={"text"}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormInput
                      id="noiThuongTruTruocDo"
                      registerReturn={register("noiThuongTruTruocDo")}
                      labelText="Nơi thường trú trước đó"
                      errorMessage={errors.noiThuongTruTruocDo?.message}
                      type={"text"}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormInput
                      id="ngheNghiep"
                      registerReturn={register("ngheNghiep")}
                      labelText="Nghề nghiệp"
                      errorMessage={errors.ngheNghiep?.message}
                      type={"text"}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormInput
                      id="noiLamViec"
                      registerReturn={register("noiLamViec")}
                      labelText="Nơi làm việc"
                      errorMessage={errors.noiLamViec?.message}
                      type={"text"}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormInput
                      id="ghiChu"
                      registerReturn={register("ghiChu")}
                      labelText="Ghi chú"
                      errorMessage={errors.ghiChu?.message}
                      type={"text"}
                    />
                  </div>
                </div>
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
            <LoadingButton
              loading={loadingMain}
              text="Cập nhật"
              className="w-fit"
            />
          </div>
        </form>
      )}
    </Fragment>
  );
};
export default EditUser;
