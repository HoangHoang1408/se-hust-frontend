import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { isBoolean } from "lodash";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { FormInput } from "../../../components/form/FormInput";
import LoadingButton from "../../../components/form/LoadingButton";
import SelectInput from "../../../components/form/SelectInput";
import SelectInput2 from "../../../components/form/SelectInput2";
import {
  LoaiPhi,
  useAddKhoanPhiMutation,
} from "../../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";

type AddKhoanPhiInputForm = {
  tenKhoanPhi: string;
  loaiPhi: LoaiPhi;
  ngayPhatDong: Date;
  theoHoKhau: string;
  soTien: number;
  ngayHetHan: Date;
};

const AddKhoanPhiInputSchema = yup.object().shape({
  tenKhoanPhi: yup.string().required("Cần điền thông tin"),
  ngayPhatDong: yup.date().required("Cần điền thông tin"),
  soTien: yup.number().required("Cần điền thông tin"),
  ngayHetHan: yup.date().required("Cần điền thông tin"),
});
type Props = {};
const AddKhoanPhi: FC<Props> = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    getValues,
    reset,
    handleSubmit,
  } = useForm<AddKhoanPhiInputForm>({
    mode: "onBlur",
    resolver: yupResolver(AddKhoanPhiInputSchema),
  });

  const [AddKhoanPhi, { loading }] = useAddKhoanPhiMutation();
  const submitHandler = async () => {
    const {
      tenKhoanPhi,
      loaiPhi,
      ngayHetHan,
      ngayPhatDong,
      soTien,
      theoHoKhau,
    } = getValues();
    await AddKhoanPhi({
      variables: {
        input: {
          theoHoKhau: theoHoKhau == "true" ? true : false,
          ngayHetHan,
          ngayPhatDong,
          soTien:+soTien,
          loaiPhi,
          tenKhoanPhi,
        },
      },
      onCompleted(data) {
        const { addKhoanPhi } = data;
        if (addKhoanPhi.error) {
          toast.error(addKhoanPhi.error.message);
          throw new Error();
        }
        reset();
        toast.success("Thêm thành công");
      },
      onError(err) {
        const msg = getApolloErrorMessage(err);
        console.log(err);
        if (msg) toast.error(msg);
        else toast.error("Lỗi xảy ra, thử lại sau");
        throw new Error();
      },
    });
  };
  console.log(errors);
  console.log(getValues());

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-8 pl-12 pr-16 pt-12 pb-16 "
    >
      <div className="space-y-8 sm:space-y-5">
        <div className="flex flex-col">
          <h3 className="leading-6 font-semibold text-gray-900 text-2xl mb-8">
            Thêm khoản phí
          </h3>
          <div className="space-y-4">
            <h1 className="text-indigo-700 font-bold text-lg mb-4">
              Thông tin cơ bản
            </h1>
            <div className="pl-4 grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="col-span-1">
                <FormInput
                  id="tenKhoanPhi"
                  registerReturn={register("tenKhoanPhi")}
                  labelText="Tên Khoản Phí (*)"
                  errorMessage={errors.tenKhoanPhi?.message}
                  type={"text"}
                />
              </div>
              <div className="col-span-1">
                <SelectInput2
                  id="loaiPhi"
                  registerReturn={register("loaiPhi")}
                  labelText="Loại Phí(*)"
                  errorMessage={errors.loaiPhi?.message}
                  showedValues={Object.keys(LoaiPhi)}
                  values={Object.values(LoaiPhi)}
                />
              </div>
              <div className="col-span-1">
                <FormInput
                  id="ngayPhatDong"
                  registerReturn={register("ngayPhatDong")}
                  labelText="Ngày phát động(*)"
                  errorMessage={errors.ngayPhatDong?.message}
                  type={"date"}
                />
              </div>
              <div className="col-span-1">
                <FormInput
                  id="ngayHetHan"
                  registerReturn={register("ngayHetHan")}
                  labelText="Ngày hết hạn (*)"
                  errorMessage={errors.ngayHetHan?.message}
                  type={"date"}
                />
              </div>
              <div className="col-span-1">
                <SelectInput2
                  id="theoHoKhau"
                  registerReturn={register("theoHoKhau")}
                  labelText="TheoHoKhau (*)"
                  errorMessage={errors.theoHoKhau?.message}
                  showedValues={["Có", "Không"]}
                  values={["true", "false"]}
                />
              </div>
              <div className="col-span-1">
                <FormInput
                  id="soTien"
                  registerReturn={register("soTien")}
                  labelText="Số Tiền"
                  errorMessage={errors.soTien?.message}
                  type={"text"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-5 flex justify-end space-x-3">
        <button
          onClick={() => navigate("/account")}
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Huỷ
        </button>
        <LoadingButton
          loading={loading}
          text="Thêm Khoản Phí"
          className="w-fit"
        />
      </div>
    </form>
  );
};
export default AddKhoanPhi;
