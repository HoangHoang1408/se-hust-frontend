import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { FormInput } from "../../../components/form/FormInput";
import LoadingButton from "../../../components/form/LoadingButton";
import { SERVER_URL } from "../../../config";
import {
  StoredFileInputType,
  useAddUserMutation,
} from "../../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";

type AddUserInputForm = {
  canCuocCongDan?: string;
  soDienThoai?: string;
  ten: string;
  gioiTinh: string;
  biDanh: string;
  ngaySinh: Date;
  noiSinh: string;
  queQuan: string;
  danToc: string;
  noiThuongTruTruocDo?: string;
  ngheNghiep?: string;
  noiLamViec?: string;
  // avatar?: StoredFileInputType;
  ghiChu?: string;
};

const AddUserInputSchema = yup.object().shape({
  canCuocCongDan: yup
    .string()
    .required("Cần điền thông tin")
    .matches(/^[0-9]+$/, "Cần ở dạng số")
    .min(12, "Cần có 12 kí tự")
    .max(12, "Cần có 12 kí tự"),
  soDienThoai: yup.string(),
  ten: yup.string().required("Cần điền thông tin"),
  gioiTinh: yup.string().required("Cần điền thông tin"),
  biDanh: yup.string(),
  ngaySinh: yup.date().required("Cần điền thông tin"),
  noiSinh: yup.string().required("Cần điền thông tin"),
  queQuan: yup.string().required("Cần điền thông tin"),
  noiThuongTruTruocDo: yup.string(),
  ngheNghiep: yup.string(),
  noiLamViec: yup.string(),
  danToc: yup.string().required("Cần điền thông tin"),
  // avatar: StoredFileInputType
  ghiChu: yup.string(),
});
type Props = {};
const AddUser: FC<Props> = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>();
  const [loadingMain, setLoadingMain] = useState(false);
  const {
    register,
    formState: { errors },
    getValues,
    reset,
    handleSubmit,
  } = useForm<AddUserInputForm>({
    mode: "onBlur",
    resolver: yupResolver(AddUserInputSchema),
  });

  const [addUser] = useAddUserMutation();
  const submitHandler = async () => {
    let sendImage: StoredFileInputType | null = null;
    try {
      setLoadingMain(true);
      const formData = new FormData();
      if (images && images.length > 0) {
        images.forEach((f) => formData.append("file", f));
        formData.append("storagePath", "se/users/avatars");
        const res = await axios.post(SERVER_URL + "/upload/file", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res.data);
        sendImage = res.data["fileReference"];
      }
      await addUser({
        variables: {
          input: {
            ...getValues(),
            avatar: sendImage,
          },
        },
        onCompleted(data) {
          const { addUser } = data;
          if (addUser.error) {
            toast.error(addUser.error.message);
            throw new Error();
          }
          reset();
          setImages(undefined);
          toast.success("Thêm thành công");
        },
        onError(err) {
          const msg = getApolloErrorMessage(err);
          if (msg) toast.error(msg);
          else toast.error("Lỗi xảy ra, thử lại sau");
          throw new Error();
        },
      });
    } catch (err) {
      // if (sendImage)
      //   await axios.post(SERVER_URL + "/delete/file", {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     data: {
      //       storagePath: sendImage.filePath,
      //     },
      //   });
    } finally {
      setLoadingMain(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-8 pl-12 pr-16 pt-12 pb-16 "
    >
      <div className="space-y-8 sm:space-y-5">
        <div className="flex flex-col">
          <h3 className="leading-6 font-semibold text-gray-900 text-2xl mb-8">
            Thêm nhân khẩu
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
                      {images?.map((i, b) => (
                        <img
                          key={b}
                          className="object-center bg-center mt-1 ml-1 w-52 h-60"
                          src={URL.createObjectURL(i)}
                        />
                      ))}
                    </div>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 items-center"
                      >
                        <span>Tải ảnh lên</span>
                        <input
                          onChange={(e) => {
                            if (e.target.files) setImages([...e.target.files]);
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
                <FormInput
                  id="canCuocCongDan"
                  registerReturn={register("canCuocCongDan")}
                  labelText="Căn cước công dân (*)"
                  errorMessage={errors.canCuocCongDan?.message}
                  type={"text"}
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
        {/* <button onClick={handleSubmit(submitHandler)}>Thêm</button> */}
        <LoadingButton
          loading={loadingMain}
          text="Thêm người"
          className="w-fit"
        />
      </div>
    </form>
  );
};
export default AddUser;
