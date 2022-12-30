import { useReactiveVar } from "@apollo/client";
import { Fragment, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTable } from "react-table";
import { toast } from "react-toastify";
import { userVar } from "../../apollo/reactiveVar/loginStatusVar";
import Loading from "../../components/Loading";
import { useHoKhauQuery } from "../../graphql/generated/schema";
import { getApolloErrorMessage } from "../../utils/getApolloErrorMessage";

type Props = {};

const NormalUserHomePage = (props: Props) => {
  const navigate = useNavigate();
  const user = useReactiveVar(userVar);

  const { data: hoKhauData, loading } = useHoKhauQuery(
    {
      onCompleted(data) {
      const {xemHoKhauChiTietChoNguoiDung} = data;
      if (xemHoKhauChiTietChoNguoiDung.error) {
        toast.error(xemHoKhauChiTietChoNguoiDung.error.message);
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

  const columns = useMemo(() => {
    return [
      {
        Header: "Vai trò",
        // @ts-ignore
        accessor: (row) => row["vaiTroThanhVien"],
      },
      {
        Header: "Họ tên",
        // @ts-ignore
        accessor: (row) => row,
        // @ts-ignore
        Cell: (row) => {
          const data = row["row"]["original"];
          return (
            <div className="flex space-x-2 items-center">
              <h1>{data["ten"]}</h1>
            </div>
          );
        },
      },
      {
        Header: " ",
        //@ts-ignore
        accessor: (row) => row,
        // @ts-ignore
        Cell: (row) => {
          const data = row["row"]["original"];
          return (
            <div className="space-x-2">
              <button
                onClick={() => {
                  navigate(`/${data["id"]}`);
                }}
                className="font-semibold text-indigo-500 cursor-pointer hover:text-indigo-700 p-1 hover:bg-indigo-300 text-left rounded transition w-fit"
              >
                Chi tiết
              </button>
            </div>
          );
        },
      },
    ];
  }, []);
  const hoKhau = hoKhauData?.xemHoKhauChiTietChoNguoiDung.hoKhau;
  const chuHo = hoKhau?.thanhVien?.find((tv) => tv.vaiTroThanhVien === "ChuHo");
  const thanhVien = hoKhau?.thanhVien?.filter((tv) => tv.vaiTroThanhVien !== "ChuHo");
  const data = useMemo(() => thanhVien || [], [thanhVien]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ data, columns });
  return (
  <Fragment>
    {loading && <Loading />}
      {!loading && user && (
         <div className="overflow-hidden bg-white py-4 pr-10">
         <div className="pl-4 py-5 sm:px-6 mt-2 ">
           <h3 className="text-3xl font-bold leading-6 text-indigo-700 mb-6 pb-6 border-b border-gray-300">
             Thông tin hộ khẩu của bạn
           </h3>
         </div>
          <div>
            <dl>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Số hộ khẩu
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {hoKhau?.soHoKhau}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Địa chỉ thường trú
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {hoKhau?.diaChiThuongTru}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Ngày cấp hộ khẩu
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {hoKhau?.createdAt}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Chủ hộ
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1 flex flex-row">
                  {chuHo?.ten}
                </dd>
                <div className="space-x-2">
                  <button
                      onClick={() => {
                       navigate(`/${chuHo?.id}`);
                      }}
                    className="m-0 text-indigo-500 cursor-pointer hover:text-indigo-700 hover:bg-indigo-300 text-left rounded transition w-fit">
                    Chi tiết
                  </button>
                </div>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Thành viên
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {}
                </dd>
              </div>
              <div>
                <div className="overflow-hidden shadow-sm ring- ring-black ring-opacity-5 ml-24">
                  <table
                    {...getTableProps()}
                    className="min-w-full divide-y divide-gray-300"
                  >
                    <thead className="space-x-2">
                      {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column) => (
                            <th
                              className="py-2 px-2 text-left text-sm font-semibold text-gray-500"
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
              </dl>
          </div>
        </div>
      )}
  </Fragment>
  );
};

export default NormalUserHomePage;
