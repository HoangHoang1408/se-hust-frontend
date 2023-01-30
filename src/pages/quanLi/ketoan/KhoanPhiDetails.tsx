import { UserIcon } from "@heroicons/react/solid";
import { FC, Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTable } from "react-table";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading";
import PaginationNav from "../../../components/PaginationNav";
import {
  LoaiPhi,
  useKhoanPhiDetailsQuery,
} from "../../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../../utils/getApolloErrorMessage";
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
const KhoanPhiDetails: FC<Props> = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data: dataKhoanPhi, loading } = useKhoanPhiDetailsQuery({
    variables: {
      input: {
        khoanPhiId: params.id!,
      },
    },
    onCompleted(data) {
      const { xemKhoanPhiChiTietChoNguoiQuanLi } = data;
      if (xemKhoanPhiChiTietChoNguoiQuanLi.error) {
        toast.error(xemKhoanPhiChiTietChoNguoiQuanLi.error.message);
        return;
      }
    },
    onError(err) {
      const msg = getApolloErrorMessage(err);
      if (msg) {
        toast.error(msg);
        return;
      }
      toast.error("Lỗi xảy ra, thử lại sau");
    },
  });
  const donggops = dataKhoanPhi?.xemKhoanPhiChiTietChoNguoiQuanLi.donggop || [];
  const columns = useMemo(() => {
    return [
      {
        Header: "ID",
        // @ts-ignore
        accessor: (row) => row["id"],
      },
      {
        Header: "Trạng thái",
        // @ts-ignore
        accessor: (row) => (row["trangThai"] ? "Đã đóng" : "Chưa đóng"),
      },
      {
        Header: "Ngày nộp",
        // @ts-ignore
        accessor: (row) =>
          new Date(row["ngayNop"]).toLocaleDateString("vi", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
      },
      {
        Header: "Số tiền đóng góp",
        // @ts-ignore
        accessor: (row) => row["soTienDongGop"],
      },
      {
        Header: "Người tạm trú/Hộ khẩu",
        // @ts-ignore
        accessor: (row) => {
          return row["nguoiTamTru"]
            ? row["nguoiTamTru"].canCuocCongDan
            : row["hoKhau"].soHoKhau;
        },
      },
      {
        Header: "ID người tạm trú",
        // @ts-ignore
        accessor: (row) => {
          return row["nguoiTamTru"] ? row["nguoiTamTru"].id : row["hoKhau"].id;
        },
      },
      {
        Header: "Hành động",
        //@ts-ignore
        accessor: (row) => row,
        // @ts-ignore
        Cell: (row) => {
          const data = row["row"]["original"];
          return (
            <div className="space-x-2">
              <button
                onClick={() => {
                  navigate(`/account/edit/${data["id"]}`);
                }}
                className="font-semibold text-indigo-500 cursor-pointer hover:text-indigo-700 p-1 hover:bg-indigo-300 text-left rounded transition w-fit"
              >
                Cập nhật
              </button>
            </div>
          );
        },
      },
    ];
  }, []);
  const data = useMemo(() => donggops || [], [donggops]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ data, columns });
  const khoanphi = dataKhoanPhi?.xemKhoanPhiChiTietChoNguoiQuanLi.khoanphi;
  return (
    <Fragment>
      {loading && <Loading />}
      {!loading && donggops && khoanphi && (
        <div className="overflow-hidden bg-white py-4 pr-10">
          <div className="pl-4 py-5 sm:px-6 mt-2 ">
            <h3 className="text-3xl font-bold leading-6 text-indigo-700 mb-6 pb-6 border-b border-gray-300">
              Thông tin khoản phí
            </h3>
          </div>
          <div className="grid grid-cols-12 pl-6">
            <div className="col-span-8 shadow-md rounded-sm">
              {[
                ["Tên khoản phí", khoanphi.tenKhoanPhi],
                [
                  "Loại phí",
                  khoanphi.loaiPhi == LoaiPhi.BatBuoc ? "Bắt buộc" : "Ủng hộ",
                ],
                [
                  "Ngày phát động",
                  new Date(khoanphi.ngayPhatDong).toLocaleDateString("vi", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }),
                ],
                [
                  "Ngày hết hạn",
                  new Date(khoanphi.ngayHetHan).toLocaleDateString("vi", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }),
                ],
                [
                  "Số tiền đã thu được(VNĐ)",
                  dataKhoanPhi?.xemKhoanPhiChiTietChoNguoiQuanLi.tongtien,
                ],
                [
                  "Số người đã đóng góp",
                  dataKhoanPhi?.xemKhoanPhiChiTietChoNguoiQuanLi.nDaDong
                    ? dataKhoanPhi?.xemKhoanPhiChiTietChoNguoiQuanLi.nDaDong
                    : "0",
                ],
                [
                  "Số người chưa đóng góp",
                  dataKhoanPhi?.xemKhoanPhiChiTietChoNguoiQuanLi.nChuaDong
                    ? dataKhoanPhi?.xemKhoanPhiChiTietChoNguoiQuanLi.nChuaDong
                    : "0",
                ],
              ].map(([title, value], i) => {
                let gray = true;
                if (i % 2 == 0) gray = false;
                return (
                  <InfoField
                    key={i}
                    title={String(title) || ""}
                    gray={gray}
                    value={String(value)}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                  <table
                    {...getTableProps()}
                    className="min-w-full divide-y divide-gray-300"
                  >
                    <thead className="bg-gray-50">
                      {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column) => (
                            <th
                              className="py-3.5 px-2 text-left text-sm font-semibold text-gray-900"
                              {...column.getHeaderProps()}
                            >
                              {column.render("Header")}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody
                      {...getTableBodyProps()}
                      className="divide-y divide-gray-200 bg-white"
                    >
                      {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                              return (
                                <td
                                  className="whitespace-nowrap py-[0.5rem] px-2 text-sm font-medium text-gray-600"
                                  {...cell.getCellProps()}
                                >
                                  {cell.render("Cell")}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate("/account/show")}
              className="px-5 py-2 bg-indigo-600 rounded-lg text-white font-semibold hover:bg-indigo-700"
            >
              Trở về
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
};
export default KhoanPhiDetails;
