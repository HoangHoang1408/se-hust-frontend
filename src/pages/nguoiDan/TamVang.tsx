import { FC, Fragment, useEffect } from "react";
import { toast } from "react-toastify";
import { useXemThongTinTamVangQuery } from "../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../utils/getApolloErrorMessage";

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

const TamVangUserPage: FC<Props> = (props: Props) => {
  const { data: tamVangData, loading } = useXemThongTinTamVangQuery({
    onCompleted(data) {
      const { xemThongTinTamVang } = data;
      if (xemThongTinTamVang.error) {
        if (xemThongTinTamVang.error) {
          toast.error(xemThongTinTamVang.error.message);
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
  const tamVang = tamVangData?.xemThongTinTamVang?.tamVang;
  useEffect(() => {
    if (!tamVang) return;
  }, [tamVang]);

  return (
    <Fragment>
      <div className="overflow-hidden bg-white py-4 pr-10">
        <div className="pl-4 py-5 sm:px-6 mt-2 ">
          <h3 className="text-3xl font-bold leading-6 text-indigo-700 mb-6 pb-6 border-b border-gray-300">
            Thông tin tạm vắng
          </h3>
        </div>
        <div className="grid grid-cols-12 pl-6">
          <div className="col-span-8 shadow-md rounded-sm">
            {[
              ["Họ tên", tamVang?.nguoiTamVang.ten],
              ["Địa chỉ nơi tạm vắng", tamVang?.diaChiNoiDen],
              [
                "Ngày hết hạn tạm vắng",
                tamVang?.ngayHetHieuLuc
                  ? new Date(tamVang.ngayHetHieuLuc).toLocaleDateString("vi", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "Chưa có thông tin",
              ],
              [
                "Ngày khai báo",
                tamVang?.createdAt
                  ? new Date(tamVang.createdAt).toLocaleDateString("vi", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "Chưa có thông tin",
              ],
              ["Người phê duyệt", tamVang?.nguoiPheDuyet.ten],
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

export default TamVangUserPage;
