import { FC, Fragment, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTable } from "react-table";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading";
import {useDanhSachDongGopChoNguoiDungQuery } from "../../../graphql/generated/schema";
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
const DanhSachDongGopChoNguoiDung: FC<Props> = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data: dataDongGop, loading } = useDanhSachDongGopChoNguoiDungQuery({
    variables: {
    },
    onCompleted(data) {
      const { xemDanhSachDongGopChoNguoiDung } = data;
      if (xemDanhSachDongGopChoNguoiDung.error) {
        toast.error(xemDanhSachDongGopChoNguoiDung.error.message);
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
  const donggops = dataDongGop?.xemDanhSachDongGopChoNguoiDung.DongGop || [];
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
      
    ];
  }, []);
  const data = useMemo(() => donggops || [], [donggops]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ data, columns });
  return (
    <Fragment>
      {loading && <Loading />}
      {!loading && donggops && (
        <div className="overflow-hidden bg-white py-4 pr-10">
          <div className="pl-4 py-5 sm:px-6 mt-2 ">
            <h3 className="text-3xl font-bold leading-6 text-indigo-700 mb-6 pb-6 border-b border-gray-300">
              Thông tin các khoản đóng góp
            </h3>
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
              onClick={() => navigate("/thongtin")}
              className="px-5 py-2 bg-indigo-600 rounded text-white font-semibold hover:bg-indigo-700"
            >
              Trở về
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
};
export default DanhSachDongGopChoNguoiDung;
